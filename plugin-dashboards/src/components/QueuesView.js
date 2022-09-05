import * as Flex from "@twilio/flex-ui";
import { connect } from "react-redux";

import { ColumnDefinition, QueuesStats } from '@twilio/flex-ui';
const PLUGIN_NAME = 'DashboardsPlugin';

export default (manager) => {
  //setVisibleQueues(manager);
  customizeQueueStats();
  console.log(PLUGIN_NAME, 'Adding Tiles');
  addTiles();
}

const TasksTile1 = connect((state) => {
  const queues = Object.values(state.flex.realtimeQueues.queuesList);
  let activeTasks = 0;
  let waitingTasks = 0;
  if (queues && queues.length > 0) {
    queues.forEach(q => {
      if (q.friendly_name.toLowerCase().includes("sales")) {
        if (q.tasks_by_status) {
          activeTasks += q.tasks_by_status.assigned + q.tasks_by_status.wrapping;
          waitingTasks += q.tasks_by_status.pending + q.tasks_by_status.reserved;
        }
      }
    })
    return {
      activeTasks: activeTasks.toString() + " / " + waitingTasks.toString()
    };
  } else {
    return {
      activeTasks: "0"
    };
  }
  
})(({ activeTasks }) => (
  <Flex.AggregatedDataTile title="Sales Tasks" content={activeTasks} description="Active / Waiting" />
));


const TasksTile2 = connect((state) => {
  const queues = Object.values(state.flex.realtimeQueues.queuesList);
  let activeTasks = 0;
  let waitingTasks = 0;
  if (queues && queues.length > 0) {
    queues.forEach(q => {
      if (q.friendly_name.toLowerCase().includes("service")) {
        if (q.tasks_by_status) {
          activeTasks += q.tasks_by_status.assigned + q.tasks_by_status.wrapping;
          waitingTasks += q.tasks_by_status.pending + q.tasks_by_status.reserved;
        }
      }
    })
    return {
      activeTasks: activeTasks.toString() + " / " + waitingTasks.toString()
    };
  } else {
    return {
      activeTasks: "0"
    };
  }
  
})(({ activeTasks }) => (
  <Flex.AggregatedDataTile title="Service Tasks" content={activeTasks} description="Active / Waiting" />
));



const addTiles = () => {
  Flex.QueuesStats.AggregatedQueuesDataTiles.Content.add(
    <TasksTile1 key="tasks-tile-1" />,
    { sortOrder: -1 }
  );
  Flex.QueuesStats.AggregatedQueuesDataTiles.Content.add(
    <TasksTile2 key="tasks-tile-2" />,
    { sortOrder: -1 }
  );

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
    //QueuesStats.setFilter((queue) => queue.friendly_name == "Everyone");

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