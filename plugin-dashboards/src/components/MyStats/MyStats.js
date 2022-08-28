import React from 'react';
import { connect } from "react-redux";
import { Manager, FlexBox } from '@twilio/flex-ui';

import { Container, Title } from './MyStats.Components';

const PLUGIN_NAME = 'DashboardsPlugin';
class MyStats extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(PLUGIN_NAME, 'MyStats props', this.props);
    const {callStats, chatStats} = this.props;
    let callAHT = callStats.answered + callStats.outbound > 0 ?
      (callStats.totalHandlingTime / (callStats.answered + callStats.outbound)).toFixed(1) : "??";

    let chatAHT = chatStats.handled > 0? (chatStats.totalHandlingTime / chatStats.handled).toFixed(1) : "??";

    return (
      <Container>
        <Title>
          Calls In/Out: {callStats?.answered} / {callStats?.outbound}, 
          AHT: {callAHT}s |
          Chats: {chatStats?.handled},
          AHT: {chatAHT}s
        </Title>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    callStats: state['dashboards']?.agentMetrics?.callStats || {},
    chatStats: state['dashboards']?.agentMetrics?.chatStats || {}
  };
}

export default connect(mapStateToProps)(MyStats);

