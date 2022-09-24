import React from "react";
import { connect } from "react-redux";
import { Icon } from '@twilio/flex-ui';
import { Container, Label, Metric, Tile } from "./MyStats.Components";

const PLUGIN_NAME = "DashboardsPlugin";
class MyStats extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  formatHandleTime = (totalHandleTime, taskCount) => {
    let timeStr = "0";
    if (taskCount > 0) {
      const aht = Math.floor(totalHandleTime / taskCount);
      if (aht > 60) {
        timeStr = Math.floor(aht / 60) + ":" + aht % 60;
      } else {
        timeStr = aht + "s";
      }
      return timeStr;
    }
  }

  render() {
    const { callStats, chatStats } = this.props;
    let callAHT = this.formatHandleTime(callStats.totalHandlingTime, callStats.answered + callStats.outbound);
    let chatAHT = this.formatHandleTime(chatStats.totalHandlingTime, chatStats.handled);

    return (
      <Container>
        <Icon icon='Call' />
        <Tile>
          <Metric>
            {callStats?.answered}
          </Metric>
          <Label>Inbound</Label>
        </Tile>
        <Tile>
          <Metric>
            {callStats?.outbound}
          </Metric>
          <Label>Outbound</Label>
        </Tile>
        <Tile>
          <Metric>{callAHT}</Metric>
          <Label>Average Handle Time</Label>
        </Tile>
        <Icon icon='Message' />
        <Tile>
          <Metric>{chatStats?.handled}</Metric>
          <Label>Chats</Label>
        </Tile>
        <Tile>
          <Metric>{chatAHT}</Metric>
          <Label>Average Handle Time</Label>
        </Tile>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    callStats: state["dashboards"]?.agentMetrics?.callStats || {},
    chatStats: state["dashboards"]?.agentMetrics?.chatStats || {},
  };
};

export default connect(mapStateToProps)(MyStats);
