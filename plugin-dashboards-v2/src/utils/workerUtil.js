import { Manager } from '@twilio/flex-ui';
const manager = Manager.getInstance();
const PLUGIN_NAME = 'DashboardsPlugin';

export const updateWorkerCapacity = async (workerSid) => {
  console.debug(PLUGIN_NAME, 'Update Worker Channels Capacity Sync Doc');
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

  let workerCapacity;
  try {
    const response = await fetch(fetchUrl, fetchOptions);
    workerCapacity = await response.json();
    console.debug(PLUGIN_NAME, 'Updated Worker Capacity Sync Doc:', workerCapacity);
  } catch (error) {
    console.error(PLUGIN_NAME, 'Failed to update sync doc');
  }
  return workerCapacity;
}