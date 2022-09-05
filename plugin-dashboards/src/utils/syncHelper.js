import { Manager, WorkersDataTable } from "@twilio/flex-ui";
import { SyncClient } from "twilio-sync";
import { Actions } from "../states/AgentMetricsState";

const PLUGIN_NAME = "DashboardsPlugin";

export const SYNC_CLIENT = new SyncClient(Manager.getInstance().user.token);

function tokenUpdateHandler() {
  console.log(PLUGIN_NAME, "Refreshing SYNC_CLIENT Token");

  const loginHandler =
    Manager.getInstance().store.getState().flex.session.loginHandler;

  const tokenInfo = loginHandler.getTokenInfo();
  const accessToken = tokenInfo.token;

  SYNC_CLIENT.updateToken(accessToken);
}

export default class SyncHelper {
  static init(manager) {
    console.log(PLUGIN_NAME, " SyncHelper add tokenUpdateHandler for sync");
    manager.store
      .getState()
      .flex.session.loginHandler.on("tokenUpdated", tokenUpdateHandler);
  }

  static async fetchAndSubcribeToSyncDoc () {
    try {
      const workerSid = Manager.getInstance().workerClient.sid; 
      console.log(PLUGIN_NAME, 'Fetch sync doc for', workerSid);
      //Note: Old Sync Client SDK uses "value" in the OpenOptions
      //https://media.twiliocdn.com/sdk/js/sync/releases/0.9.2/docs/Client.html#OpenOptions
      //New Sync Client SDK uses "data" in OpenDocumentOptions
      //https://media.twiliocdn.com/sdk/js/sync/releases/3.0.1/docs/interfaces/OpenDocumentOptions.html


      const workerDoc = await SYNC_CLIENT.document({
        id: `workerStatsFor-${workerSid}`,
        mode: "open_or_create",
        value: {
          callStats: {
            answered: 0,
            outbound: 0,
            rejected: 0,
            missed: 0,
            totalHandlingTime: 0
          },
          chatStats: {
            handled: 0,
            rejected: 0,
            missed: 0,
            totalHandlingTime: 0
          },
          loginTimestamp: 0,
          activeCallSeconds: 0,
        },
      });
      console.log(PLUGIN_NAME, 'Doc:', workerDoc);
      Manager.getInstance().store.dispatch(Actions.setAgentMetrics(workerDoc.value));

      workerDoc.on("updated", (args) => {
        console.log(`Document ${workerDoc.sid} updated`);
        Manager.getInstance().store.dispatch(Actions.setAgentMetrics(workerDoc.value));
      });
    } catch (error) {
      console.error(`Error fetchAndSubcribeToDoc for ${workerSid}`, error);
    }
  };
}
