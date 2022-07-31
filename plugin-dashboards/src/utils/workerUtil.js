import { Manager } from '@twilio/flex-ui';
const manager = Manager.getInstance();
const PLUGIN_NAME = 'DashboardsPlugin';

export const updateWorkerCapacity = async (worker) => {
  //Note: This only works at plugin init.  
  //TR SDK does not receive real-time updates from Worker Channel changes to assigned tasks
  let chatCapacity = 0, smsCapacity = 0;
  let chatTasks = 0, smsTasks = 0;
  let workerChannels = worker.channels; // returns Map
  console.log(PLUGIN_NAME, workerChannels);
  workerChannels.forEach( (wc, key) => {
    if (wc.taskChannelUniqueName == "chat") {
      chatCapacity = wc.capacity;
      chatTasks = wc.assignedTasks;
    } else if (wc.taskChannelUniqueName == "sms") {
      smsCapacity = wc.capacity;
      smsTasks = wc.assignedTasks;
    }
  } );
  let workerAttributes = worker.attributes;
  let newWorkerAttributes = {...workerAttributes, chatCapacity, chatTasks, smsCapacity, smsTasks}
  console.log(PLUGIN_NAME, 'Updated Worker Attributes:', newWorkerAttributes);
  await worker.setAttributes(newWorkerAttributes);

}

export const updateWorkerAttributesForCapacity = async (workerSid) => {
  console.debug(PLUGIN_NAME, 'Update Worker Channels Capacity');
  const fetchUrl = `${process.env.FLEX_APP_FUNCTIONS_BASE}/update-worker-capacity`;
  const fetchBody = {
    Token: manager.store.getState().flex.session.ssoTokenPayload.token,
    workerSid
  };
  const fetchOptions = {
    method: 'POST',
    body: new URLSearchParams(fetchBody),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  };

  let worker;
  try {
    const response = await fetch(fetchUrl, fetchOptions);
    worker = await response.json();
    console.debug(PLUGIN_NAME, 'Updated Worker:', worker);
  } catch (error) {
    console.error(PLUGIN_NAME, 'Failed to update worker');
  }
  //Fix attributes, Json string back to object
  return worker;
}