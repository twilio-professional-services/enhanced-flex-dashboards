import React from "react";
import { connect } from "react-redux";
import { Icon } from '@twilio/flex-ui';
import { Container, Label, Metric, Tile } from "./MyStats.Components";

const PLUGIN_NAME = "DashboardsPlugin";
class MyStats extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(PLUGIN_NAME, "MyStats props", this.props);
    const { callStats, chatStats } = this.props;
    let callAHT =
      callStats.answered + callStats.outbound > 0
        ? (
            callStats.totalHandlingTime /
            (callStats.answered + callStats.outbound)
          ).toFixed(1)
        : "??";

    let chatAHT =
      chatStats.handled > 0
        ? (chatStats.totalHandlingTime / chatStats.handled).toFixed(1)
        : "??";

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
          <Metric>{callAHT}s</Metric>
          <Label>Average Handle Time</Label>
        </Tile>
        <Icon icon='Message' />
        <Tile>
          <Metric>{chatStats?.handled}</Metric>
          <Label>Chats</Label>
        </Tile>
        <Tile>
          <Metric>{chatAHT}s</Metric>
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
