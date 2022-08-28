const fetchSyncDoc = (client, syncServiceSid, syncDocName) => {
  return (syncDoc = client.sync.v1
    .services(syncServiceSid)
    .documents(syncDocName)
    .fetch());
};

const createSyncDoc = (client, syncServiceSid, syncDocName) => {
  return client.sync.v1.services(syncServiceSid).documents.create({
    uniqueName: syncDocName,
    data: {
      callStats: {
        answered: 0,
        outbound: 0,
        rejected: 0,
        missed: 0,
        totalHandlingTime: 0
      },
      chatStats: {
        handled: 0,
        missed: 0,
        rejected: 0,
        totalHandlingTime: 0
      },
      loginTimestamp: 0,
      activeCallSeconds: 0,
    },
  });
};

const updateSyncDoc = (client, syncServiceSid, syncDoc) => {
  return client.sync.v1
    .services(syncServiceSid)
    .documents(syncDoc.uniqueName)
    .update({ data: syncDoc.data });
};

const updateLoginTimestamp = (client, syncServiceSid, syncDoc) => {
  syncDoc.data.loginTimestamp = Date.now();
  syncDoc.data.activeCallSeconds = 0;
  syncDoc.data.callStats = {
    answered: 0,
    outbound: 0,
    missed: 0,
    rejected: 0,
    totalHandlingTime: 0
  };
  syncDoc.data.chatStats = {
    handled: 0,
    missed: 0,
    rejected: 0,
    totalHandlingTime: 0
  };


  return client.sync.v1
    .services(syncServiceSid)
    .documents(syncDoc.uniqueName)
    .update({ data: syncDoc.data });
};

const firstLoginOfDayCheck = (syncDoc) => {
  const loginTimestamp = syncDoc.data.loginTimestamp;

  const loginDate = new Date(loginTimestamp);
  const now = new Date();

  return !(loginDate.toDateString() === now.toDateString());
};

const getCallDuration = async (client, callSid) => {
  call = await client.calls(callSid).fetch();
  return parseInt(call.duration);
};

const getReservationAcceptedTime = async (context, reservationSid) => {
  const client = context.getTwilioClient();
  let events;
  try {
    events = await client.taskrouter.v1.workspaces(context.TWILIO_WORKSPACE_SID)
    .events
    .list({ reservationSid: reservationSid, eventType: "reservation.accepted", minutes: 180})
  } catch (err) {
    console.log('Error in find events', err);
  }
  if (events.length > 0) {
    //Return timestamp in whole seconds
    return Math.floor(events[0].eventDateMs / 1000);
  }
  //Default if not found
  return 0;
}

exports.handler = async function (context, event, callback) {
  const client = context.getTwilioClient();
  const syncServiceSid = context.TWILIO_SYNC_SERVICE_SID;
  const {
    EventType,
    ResourceSid,
    WorkerSid,
    WorkerActivityName,
    TaskAttributes,
    TaskChannelUniqueName,
    Timestamp
  } = event;

  const ActivityUpdated = "worker.activity.update";
  const ReservationAccepted = "reservation.accepted";
  const ReservationWrapup = "reservation.wrapup";
  const ReservationCompleted = "reservation.completed";
  const ReservationRejected = "reservation.rejected";
  const ReservationTimeout = "reservation.timeout";
  const eventsToHandle = [
    ActivityUpdated,
    ReservationAccepted,
    ReservationWrapup,
    ReservationCompleted,
    ReservationRejected,
    ReservationTimeout,
  ];

  try {
    if (eventsToHandle.includes(EventType)) {
      console.log(`Handling ${EventType} for ${ResourceSid}`);

      const syncDocName = `workerStatsFor-${WorkerSid}`;

      let syncDoc = null;
      try {
        syncDoc = await fetchSyncDoc(client, syncServiceSid, syncDocName);
      } catch (error) {
        console.log(
          "Error fetching sync doc. Assume it didn't existe and create one",
          error
        );
        syncDoc = await createSyncDoc(client, syncServiceSid, syncDocName);
      }

      if (EventType === ActivityUpdated && WorkerActivityName === "Available") {
        if (firstLoginOfDayCheck(syncDoc)) {
          await updateLoginTimestamp(client, syncServiceSid, syncDoc);
        }
      } else {
        if (TaskChannelUniqueName === "voice") {
          const taskAttributes = JSON.parse(TaskAttributes);
          switch (EventType) {
            case ReservationAccepted: {
              //
              break;
            }
            case ReservationWrapup: {
              const agentCallDuration = await getCallDuration(
                client,
                taskAttributes.conference.participants.worker
              );

              syncDoc.data.activeCallSeconds += agentCallDuration;
              await updateSyncDoc(client, syncServiceSid, syncDoc);
              break;
            }
            case ReservationCompleted: {
              console.log('Completed timestamp', Timestamp);
              const acceptedTimestamp = await getReservationAcceptedTime(context, ResourceSid);
              if (acceptedTimestamp > 0) {
                //calc AHT
                let handlingTime = (Timestamp - acceptedTimestamp);
                console.log('Reservation:', ResourceSid, 'HT:', handlingTime);
                taskAttributes.direction === "inbound"
                ? syncDoc.data.callStats.answered++
                : syncDoc.data.callStats.outbound++;
                syncDoc.data.callStats.totalHandlingTime += handlingTime;
                await updateSyncDoc(client, syncServiceSid, syncDoc);

              }
              break;
            }
            case ReservationRejected: {
              syncDoc.data.callStats.rejected++;
              await updateSyncDoc(client, syncServiceSid, syncDoc);
              break;
            }
            case ReservationTimeout: {
              syncDoc.data.callStats.missed++;
              await updateSyncDoc(client, syncServiceSid, syncDoc);
              break;
            }
          }
        } else if (TaskChannelUniqueName === "chat") {
          switch (EventType) {
            case ReservationAccepted: {
              //
              break;
            }
            case ReservationWrapup: {
              // Calc Talk Time?
              break;
            }
            case ReservationCompleted: {
              console.log('Completed timestamp', Timestamp);
              const acceptedTimestamp = await getReservationAcceptedTime(context, ResourceSid);
              if (acceptedTimestamp > 0) {
                //calc AHT
                let handlingTime = (Timestamp - acceptedTimestamp);
                console.log('Reservation:', ResourceSid, 'HT:', handlingTime);
                syncDoc.data.chatStats.handled++;
                syncDoc.data.chatStats.totalHandlingTime += handlingTime;
                await updateSyncDoc(client, syncServiceSid, syncDoc);

              }
              break;
            }
            case ReservationRejected: {
              syncDoc.data.chatStats.rejected++;
              await updateSyncDoc(client, syncServiceSid, syncDoc);
              break;
            }
            case ReservationTimeout: {
              syncDoc.data.chatStats.missed++;
              await updateSyncDoc(client, syncServiceSid, syncDoc);
              break;
            }
          }

        }
      }
    }
  } catch (error) {
    console.error(error);
    return callback(error, null);
  }

  const response = new Twilio.Response();
  response.setStatusCode(204);
  return callback(null, response);
};
