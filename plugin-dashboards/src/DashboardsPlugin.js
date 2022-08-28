import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

import reducers, { namespace } from './states';
import QueuesView from './components/QueuesView';
import TeamsView from './components/TeamsView';
import CustomActions from './actions';

const PLUGIN_NAME = 'DashboardsPlugin';
import { updateWorkerAttributesForCapacity } from './utils/workerUtil';

import SyncHelper from "./utils/syncHelper";
import MyStats from "./components/MyStats/MyStats";

export default class DashboardsPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {
    this.registerReducers(manager);
    SyncHelper.init(manager);

    flex.MainHeader.Content.add(
      <MyStats key="my-agent-stats" />, 
      { sortOrder: -999, align: 'end' }
    );



    //Queue Stats Dashboard enhancements
    QueuesView(manager);
    //Teams View enhancements
    TeamsView(manager);
    CustomActions(manager);

    const workerSid = manager.workerClient.sid;
    await updateWorkerAttributesForCapacity(workerSid);

    await SyncHelper.fetchAndSubcribeToSyncDoc();
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint-disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
