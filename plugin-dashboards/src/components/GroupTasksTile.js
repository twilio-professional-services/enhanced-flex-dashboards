import * as Flex from "@twilio/flex-ui";
import { connect } from "react-redux";
import QueueDataUtil from "../utils/QueueDataUtil";

/**
 * @param {props} props.group The queue grouping (for example "sales")
 */
const GroupTasksTile = connect((state, ownProps) => {
  //console.log('Own Props: ', ownProps);
  const queues = Object.values(state.flex.realtimeQueues.queuesList);
  return QueueDataUtil.getTasksByGroup(queues, ownProps.group);
})((props) => {
  return (
    <Flex.AggregatedDataTile
      title={props.group + " (Active)"}
      content={props.activeTasks}
      description={"Waiting: " + props.waitingTasks} />
  )
});

export default GroupTasksTile;