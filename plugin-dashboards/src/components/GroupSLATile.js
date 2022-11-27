import { connect } from "react-redux";
import QueueDataUtil from "../utils/QueueDataUtil";
import { CustomSLDataTile } from "./CustomSLDataTile/CustomSLDataTile";


/**
 * @param {props} props.group The queue grouping (for example "sales")
 */
const GroupSLATile = connect((state, ownProps) => {
  const queues = Object.values(state.flex.realtimeQueues.queuesList);
  return QueueDataUtil.getSLTodayByGroup(queues, ownProps.group);
  //object returned from connect is merged into component props
  //See https://react-redux.js.org/api/connect
})((props) => {
  const { group, handledTasks, handledTasksWithinSL, serviceLevelPct } = props;
  
  return (<CustomSLDataTile
    title={group + " SLA"}
    content={serviceLevelPct}
    description={handledTasksWithinSL + " / " + handledTasks} >
  </CustomSLDataTile>)
});

export default GroupSLATile