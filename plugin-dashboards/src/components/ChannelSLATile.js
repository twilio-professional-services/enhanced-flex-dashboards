import { connect } from "react-redux";
import QueueDataUtil from "../utils/QueueDataUtil";
import { CustomSLDataTile } from "./CustomSLDataTile/CustomSLDataTile";


/**
 * @param {props} props.channelName The channelName ("voice", "chat", "sms" etc.)
 */
const ChannelSLATile = connect((state) => {
  const queues = Object.values(state.flex.realtimeQueues.queuesList);
  return QueueDataUtil.getSLTodayByChannel(queues);
  //object returned from connect is merged into component props
  //See https://react-redux.js.org/api/connect
})((props) => {
  let channelName = props.channelName;
  let sla = props[channelName];
  return (<CustomSLDataTile
    title={channelName + " SLA"}
    content={sla.serviceLevelPct}
    description={sla.handledTasksWithinSL + " / " + sla.handledTasks} >
  </CustomSLDataTile>)
});

export default ChannelSLATile