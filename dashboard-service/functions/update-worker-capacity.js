const TokenValidator = require("twilio-flex-token-validator").functionValidator;

exports.handler = TokenValidator(async function (context, event, callback) {
  const client = context.getTwilioClient();
  const response = new Twilio.Response();

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

  let chatCapacity = 0, smsCapacity = 0;
  let chatTasks = 0, smsTasks = 0;
  let chatAvailable, smsAvailable;
  try {
    const { workerSid } = event;
    //Get Worker Channels
    const workerChannels = await client.taskrouter.v1
      .workspaces(context.TWILIO_WORKSPACE_SID)
      .workers(workerSid)
      .workerChannels
      .list({ limit: 20 });

    workerChannels.forEach(wc => {
      //console.log(wc);
      if (wc.taskChannelUniqueName == "chat") {
        chatCapacity = wc.configuredCapacity;
        chatTasks = wc.assignedTasks;
        chatAvailable = wc.available;
      } else if (wc.taskChannelUniqueName == "sms") {
        smsCapacity = wc.configuredCapacity;
        smsTasks = wc.assignedTasks;
        smsAvailable = wc.available;
      }
    })

    //Update capacity in Worker attributes
    
    const worker = await client.taskrouter
      .workspaces(context.TWILIO_WORKSPACE_SID)
      .workers(workerSid)
      .fetch();

    //console.log('Worker:', worker);
    // Worker Attributes are encoded as Json string
    let workersAttributes = JSON.parse(worker.attributes);

    workersAttributes = {
      ...workersAttributes, chatAvailable, smsAvailable,
      chatCapacity, chatTasks, smsCapacity, smsTasks};

    const updateWorker = await client.taskrouter
      .workspaces(context.TWILIO_WORKSPACE_SID)
      .workers(workerSid)
      .update({ attributes: JSON.stringify(workersAttributes) });

    //console.log('Updated', workerSid, 'attributes with', workersAttributes);

    response.appendHeader("Content-Type", "application/json");
    response.setBody(JSON.parse(updateWorker.attributes));
    return callback(null, response);
  } catch (err) {
    returnError(callback, response, err.message);
  }
});

const returnError = (callback, response, errorString) => {
  console.error(errorString);
  response.appendHeader("Content-Type", "plain/text");
  response.setBody(errorString);
  response.setStatusCode(500);
  return callback(null, response);
};
