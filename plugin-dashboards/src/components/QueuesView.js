import { ColumnDefinition, QueuesStats } from '@twilio/flex-ui';
const PLUGIN_NAME = 'DashboardsPlugin';

export default (manager) => {
  setVisibleQueues(manager);
  customizeQueueStats();
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
    QueuesStats.setFilter((queue) => queue.friendly_name == "Everyone");

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