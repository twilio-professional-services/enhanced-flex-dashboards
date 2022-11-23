import * as Flex from "@twilio/flex-ui";
import { connect } from "react-redux";

import { ColumnDefinition, QueuesStats } from '@twilio/flex-ui';
import QueueFilters from "./QueueFilters/QueueFilters";
import ServiceLevelTile from "./ServiceLevelTile/ServiceLevelTile";

const PLUGIN_NAME = 'DashboardsPlugin';

export default (manager) => {
  setVisibleQueues(manager);
  customizeQueueStats();
  console.log(PLUGIN_NAME, 'Adding Tiles');
  addTiles();
  addFilters();
}

const addFilters = () => {

  Flex.QueuesStatsView.Content.add(<QueueFilters key="queue-filters" />, {
    align: 'start',
    sortOrder: 0,
  })
}

const getTasksByGroup = (queues, group) => {
  let activeTasks = 0;
  let waitingTasks = 0;
  if (queues && queues.length > 0) {
    queues.forEach(q => {
      if (q.friendly_name.toLowerCase().includes(group)) {
        if (q.tasks_by_status) {
          activeTasks += q.tasks_by_status.assigned + q.tasks_by_status.wrapping;
          waitingTasks += q.tasks_by_status.pending + q.tasks_by_status.reserved;
        }
      }
    })
  }
  return { activeTasks, waitingTasks }
}

const TasksTile1 = connect((state) => {
  const queues = Object.values(state.flex.realtimeQueues.queuesList);
  let tasks = getTasksByGroup(queues, "sales");
  return tasks;
})((tasks) => (
  <Flex.AggregatedDataTile title="Sales (Active)" content={tasks.activeTasks}
    description={"Waiting: " + tasks.waitingTasks} />
));


const TasksTile2 = connect((state) => {
  const queues = Object.values(state.flex.realtimeQueues.queuesList);
  let tasks = getTasksByGroup(queues, "service");
  return tasks;
})((tasks) => (
  <Flex.AggregatedDataTile title="Service (Active)" content={tasks.activeTasks}
    description={"Waiting: " + tasks.waitingTasks} />
));

const getTasksByChannel = (queues, channelName) => {
  let activeTasks = 0;
  let waitingTasks = 0;
  if (queues && queues.length > 0) {
    queues.forEach(q => {
      if (q.channels) {
        q.channels.forEach(ch => {
          if (ch.unique_name == channelName) {
            activeTasks += ch.tasks_now?.active_tasks;
            waitingTasks += ch.tasks_now?.waiting_tasks;
          }
        })
      }
    })
  }
  return { activeTasks, waitingTasks };
}

const getSLTodayByChannel = (queues, channelName) => {
  let handledTasks = 0;
  let handledTasksWithinSL = 0;
  if (queues && queues.length > 0) {
    queues.forEach(q => {
      if (q.channels) {
        q.channels.forEach(ch => {
          if (ch.unique_name == channelName) {
            //Not all queues/channels have SLA
            if (ch.sla_today) {
              handledTasks += ch?.sla_today?.handled_tasks_count;
              handledTasksWithinSL += ch?.sla_today?.handled_tasks_within_sl_threshold_count;
            }
          }
        })
      }
    })
  }
  let serviceLevelPct = 0;
  if (handledTasks > 0) serviceLevelPct = Math.floor((handledTasksWithinSL / handledTasks) * 100);
  return { handledTasks, handledTasksWithinSL, serviceLevelPct };
}



const ChatTasksTile = connect((state) => {
  const queues = Object.values(state.flex.realtimeQueues.queuesList);
  let tasks = getTasksByChannel(queues, "chat");
  return tasks;
})((tasks) => (
  <Flex.AggregatedDataTile title="Active Chats" content={tasks.activeTasks}
    description={"Waiting: " + tasks.waitingTasks} />
));

const VoiceTasksTile = connect((state) => {
  const queues = Object.values(state.flex.realtimeQueues.queuesList);
  let tasks = getTasksByChannel(queues, "voice");
  return tasks;
})((tasks) => (
  <Flex.AggregatedDataTile title="Active Calls" content={tasks.activeTasks}
    description={"Waiting: " + tasks.waitingTasks} />
));

const ChatSLATile = connect((state) => {
  const queues = Object.values(state.flex.realtimeQueues.queuesList);
  let sla = getSLTodayByChannel(queues, "chat");
  return sla;
})((sla) => (
  <Flex.AggregatedDataTile title="Chat SLA"
    description={sla.handledTasksWithinSL + " / " + sla.handledTasks} >
    <ServiceLevelTile sla={sla} />
  </Flex.AggregatedDataTile>

));

const VoiceSLATile = connect((state) => {
  const queues = Object.values(state.flex.realtimeQueues.queuesList);
  let sla = getSLTodayByChannel(queues, "voice");
  return sla;
})((sla) => (
  <Flex.AggregatedDataTile title="Voice SLA"
    description={sla.handledTasksWithinSL + " / " + sla.handledTasks} >
    <ServiceLevelTile sla={sla} />
  </Flex.AggregatedDataTile>
));

const addTiles = () => {
  Flex.QueuesStats.AggregatedQueuesDataTiles.Content.add(
    <ChatTasksTile key="chat-tasks-tile" />,
    { sortOrder: -6 }
  );
  Flex.QueuesStats.AggregatedQueuesDataTiles.Content.add(
    <ChatSLATile key="chat-sla-tile" />,
    { sortOrder: -5 }
  );
  Flex.QueuesStats.AggregatedQueuesDataTiles.Content.add(
    <VoiceTasksTile key="voice-tasks-tile" />,
    { sortOrder: -4 }
  );
  Flex.QueuesStats.AggregatedQueuesDataTiles.Content.add(
    <VoiceSLATile key="voice-sla-tile" />,
    { sortOrder: -3 }
  );
  Flex.QueuesStats.AggregatedQueuesDataTiles.Content.add(
    <TasksTile1 key="tasks-tile-1" />,
    { sortOrder: -2 }
  );
  Flex.QueuesStats.AggregatedQueuesDataTiles.Content.add(
    <TasksTile2 key="tasks-tile-2" />,
    { sortOrder: -1 }
  );

  //Remove original tiles
  Flex.QueuesStats.AggregatedQueuesDataTiles.Content.remove('active-tasks-tile');
  Flex.QueuesStats.AggregatedQueuesDataTiles.Content.remove('waiting-tasks-tile');
  Flex.QueuesStats.AggregatedQueuesDataTiles.Content.remove('longest-wait-time-tile');
}




const setVisibleQueues = (manager) => {
  const TEAM_TWILIO = 'TwilioPS';
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
    //QueuesStats.setSubscriptionFilter((queue) => queue.friendly_name == "Everyone");

  }
}

const RenderWaitingTasks = (workerQueue) =>
  // QueuesDataTableCell component helps us render additional expandable rows with channel specific data
  <QueuesStats.QueuesDataTableCell
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

const customizeQueueStats = () => {
  QueuesStats.QueuesDataTable.Content.remove("waiting-tasks");
  // Create a new column with custom formatting
  QueuesStats.QueuesDataTable.Content.add(
    <ColumnDefinition
      key="my-waiting-tasks"
      header="Waiting"
      subHeader="Now"
      content={RenderWaitingTasks}
    />,
    { sortOrder: 1 } // Put this after the second column
  );
}