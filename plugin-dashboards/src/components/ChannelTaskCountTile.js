import * as Flex from "@twilio/flex-ui";
import { connect } from "react-redux";
import QueueDataUtil from "../utils/QueueDataUtil";
import { CustomDataTile } from "./CustomDataTile/CustomDataTile";

/**
 * @param {props} props.channelName The channelName ("voice", "chat", "sms" etc.)
 * @param {props} props.bgColor The tile background color
 */
const ChannelTaskCountTile = connect((state) => {
  const queues = Object.values(state.flex.realtimeQueues.queuesList);
  return QueueDataUtil.getTaskCountsByChannel(queues);
  //object returned from connect is merged into component props
  //See https://react-redux.js.org/api/connect
})((props) => {
  const { channelName, bgColor} = props;
  let taskCounts = props[channelName];
  return (<CustomDataTile 
    bgColor={bgColor}
    title={channelName + " Active"}
    content={taskCounts.activeTasks}
    description={"Waiting: " + taskCounts.waitingTasks} />
  )
});

export default ChannelTaskCountTile;