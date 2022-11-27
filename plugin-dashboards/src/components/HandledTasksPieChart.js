import { connect } from "react-redux";
import QueueDataUtil from "../utils/QueueDataUtil";
import { PieChartTile } from "./PieChartTile/PieChartTile";


const HandledTasksPieChart = connect((state) => {
  const queues = Object.values(state.flex.realtimeQueues.queuesList);
  return QueueDataUtil.getSLTodayByChannel(queues);
  //object returned from connect is merged into component props
  //See https://react-redux.js.org/api/connect
})((props) => {
  //props has all task counts

  let handledVoice = props["voice"].handledTasks;
  let handledChat = props["chat"].handledTasks;
  let handledSms = props["sms"].handledTasks;

  let data = [];
  if (handledVoice) data.push({ title: 'voice', value: handledVoice, color: '#ADD8E6' });
  if (handledChat) data.push({ title: 'chat', value: handledChat, color: '#87CEFA' });
  if (handledSms) data.push({ title: 'sms', value: handledSms, color: '#4682B4' });
  return (<PieChartTile
    title="Tasks Pie Chart"
    content={data}
    description="Today by Channel" />
  )
});

export default HandledTasksPieChart;