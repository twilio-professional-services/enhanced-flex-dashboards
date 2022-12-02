import { Icon } from '@twilio/flex-ui';
import { connect } from "react-redux";
import QueueDataUtil from "../../utils/QueueDataUtil";
import { TileWrapper, Title, Channel, ChannelIcon, Content, Description } from './ChannelSLATile.Components';
import { cx } from "emotion";
// Version 2 with icon

/**
 * @param {props} props.channelName The channelName ("voice", "chat", "sms" etc.)
 */
const ChannelSLATileV2 = connect((state) => {
  const queues = Object.values(state.flex.realtimeQueues.queuesList);
  return QueueDataUtil.getSLTodayByChannel(queues);
  //object returned from connect is merged into component props
  //See https://react-redux.js.org/api/connect
})((props) => {
  const { channelName, className } = props;
  let sla = props[channelName];

  let content = "-";
  if (sla.handledTasks && sla.handledTasks > 0) {
    content = sla.serviceLevelPct + "%";
  }

  return (
    //Pass value to TileWrapper for changing color
    <TileWrapper value={sla.serviceLevelPct} count={sla.handledTasks} className={cx("Twilio-AggregatedDataTile", className)}>
      <Channel>
      <ChannelIcon>
        {channelName == "voice" && <Icon icon='Call' />}
        {channelName == "chat" && <Icon icon='Message' />}
        {channelName == "sms" && <Icon icon='Sms' />}
        </ChannelIcon>
        <Title className="Twilio-AggregatedDataTile-Title">{channelName + " SLA"}</Title>
        </Channel>
      <Content className="Twilio-AggregatedDataTile-Content">{content}</Content>
      <Description className="Twilio-AggregatedDataTile-Description">
        {sla.handledTasksWithinSL + " / " + sla.handledTasks}
      </Description>
    </TileWrapper>
  );
});

export default ChannelSLATileV2;