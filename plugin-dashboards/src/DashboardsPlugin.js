import React from 'react';
import { VERSION, ColumnDefinition, QueuesStats, Actions } from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

import reducers, { namespace } from './states';

const PLUGIN_NAME = 'DashboardsPlugin';
import { updateWorkerAttributesForCapacity } from './utils/workerUtil';

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

    //Queue Stats Dashboard
    //flex.QueuesStats.AggregatedQueuesDataTiles.Content.remove("agents-by-activity-chart-tile");

    flex.QueuesStats.QueuesDataTable.Content.remove("agents");


    //ADD: import { ColumnDefinition } from '@twilio/flex-ui';
    const RenderWaitingTasks = (workerQueue) =>
      // QueuesDataTableCell component helps us render additional expandable rows with channel specific data
      <flex.QueuesStats.QueuesDataTableCell
        // Pass the queue data down 
        queue={workerQueue}

        // Render the queue level value
        renderQueueData={(queue) => {
          if (!queue.friendly_name.includes("Everyone")) {
            // Calculate number of waiting tasks by adding pending and reserved
            const { pending, reserved } = queue.tasks_by_status;
            const waitingTasks = pending + reserved;
            // Return the element to render
            return <span>{waitingTasks}</span>;
          } else {
            return <span> </span>;
          }
        }}
        // Render a value for each active channel in the queue
        renderChannelData={(channel, queue) => {
          if (!queue.friendly_name.includes("Everyone")) {
            // Calculate number of waiting tasks by adding pending and reserved
            const { pending, reserved } = queue.tasks_by_status;
            const waitingTasks = pending + reserved;
            // Return the element to render
            return <span>{waitingTasks}</span>;
          } else {
            return <span> </span>;
          }
        }}
      />

    flex.QueuesStats.QueuesDataTable.Content.remove("waiting-tasks");
    // Create a new column with custom formatting
    flex.QueuesStats.QueuesDataTable.Content.add(
      <ColumnDefinition
        key="my-waiting-tasks"
        header="Waiting"
        subHeader="Now"
        content={RenderWaitingTasks}
      />,
      { sortOrder: 1 } // Put this after the second column
    );

    //import { ColumnDefinition } from "@twilio/flex-ui";

    // flex.WorkersDataTable.Content.add(<ColumnDefinition key="team" header={"Team"} 
    // content={item => item.worker.attributes.team_name}/>);


    window.Handlebars.registerHelper('showRoleCode', (workerAttributes) => {
      if (workerAttributes.roles.includes('supervisor')) {
        return '(S)';
      } else if (workerAttributes.roles.includes('agent')) {
        return '(A)';
      } else if (workerAttributes.roles.includes('admin')) {
        return '(D)';
      } else {
        return '';
      }
    });



    manager.strings.WorkerDirectoryItemFirstLine = "{{worker.fullName}} {{showRoleCode worker.attributes}}";
    manager.strings.SupervisorUserCardFirstLine = "{{worker.fullName}} {{showRoleCode worker.attributes}}";

    const TEAM_TWILIO = 'Twilio';
    //import { QueuesStats } from '@twilio/flex-ui';
    const TEAM_BPO1 = 'BPO1';
    const TEAM_BPO2 = 'BPO2';

    let team_name = manager.workerClient.attributes?.team_name || "None";
    console.log(PLUGIN_NAME, 'Worker team:', team_name);

    if (team_name == TEAM_TWILIO) {
      //No filter - Show All Queues
      console.log(PLUGIN_NAME, 'Show all queues');
    } else if (team_name == TEAM_BPO1) {
      let prefix = TEAM_BPO1;
      QueuesStats.setFilter((queue) => queue.friendly_name.substring(0, prefix.length) == prefix);
    } else if (team_name == TEAM_BPO2) {
      let prefix = TEAM_BPO2;
      QueuesStats.setFilter((queue) => queue.friendly_name.substring(0, prefix.length) == prefix);
    } else {
      //Only show Anyone queue
      //QueuesStats.setFilter((queue) => queue.friendly_name == "Everyone");

    }
    const workerSid = manager.workerClient.sid;
    await updateWorkerAttributesForCapacity(workerSid);

    Actions.addListener('afterAcceptTask', async (payload) => {
      if (['chat', 'sms'].includes(payload.task.taskChannelUniqueName)) {
        console.log(PLUGIN_NAME, 'Task Accepted, Update Capacity');
        updateWorkerAttributesForCapacity(workerSid);
      }
    });

    Actions.addListener('afterCompleteTask', async (payload) => {
      if (['chat', 'sms'].includes(payload.task.taskChannelUniqueName)) {
        console.log(PLUGIN_NAME, 'Task Completed, Update Capacity');
        updateWorkerAttributesForCapacity(workerSid);
      }
    });

    flex.WorkersDataTable.Content.add(<ColumnDefinition key="maxChat" header={"Chat Util."} style={{ width: 75 }}
      content={item => {
        if (Object.hasOwn(item.worker.attributes, "chatTasks") && Object.hasOwn(item.worker.attributes, "chatCapacity")) {
          return item.worker.attributes.chatTasks + " / " + item.worker.attributes.chatCapacity;
        } else {
          return "?";
        }
      }} />);
    flex.WorkersDataTable.Content.add(<ColumnDefinition key="maxSMS" header={"SMS Util."} style={{ width: 75 }}
      content={item => {
        if (Object.hasOwn(item.worker.attributes, "smsTasks") && Object.hasOwn(item.worker.attributes, "smsCapacity")) {
          return item.worker.attributes.smsTasks + " / " + item.worker.attributes.smsCapacity;
        } else {
          return "?";
        }
      }} />);

    flex.WorkersDataTable.Content.add(<ColumnDefinition key="skills" header={"Skills"}
      content={item => {
        return item.worker.attributes.routing ?
          item.worker.attributes.routing?.skills.join(' / ') : 'NONE'
      }
      } />);
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
