import React from "react";
import { SYNC_CLIENT as syncClient } from "../../utils/syncHelper";
import { Container, Channel, Handled, AHT } from './AgentStatsCard.Components';

const PLUGIN_NAME = "DashboardsPlugin";

const INITIAL_STATE = {
  workerDoc: undefined,
  callStats: {
    answered: 0,
    outbound: 0,
    rejected: 0,
    missed: 0,
    totalHandlingTime: 0
  },
  chatStats: {
    handled: 0,
    rejected: 0,
    missed: 0,
    totalHandlingTime: 0
  },
  loginTimestamp: 0,
  activeCallSeconds: 0
}


class AgentStatsCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE
  }

  fetchAndSubcribeToSyncDoc = async (workerSid) => {
    try {
      const workerDoc = await syncClient.document({
        id: `workerStatsFor-${workerSid}`,
        mode: "open_or_create",
        data: {
          callStats: {
            answered: 0,
            outbound: 0,
            rejected: 0,
            missed: 0,
            totalHandlingTime: 0
          },
          chatStats: {
            handled: 0,
            rejected: 0,
            missed: 0,
            totalHandlingTime: 0
          },
          loginTimestamp: 0,
          activeCallSeconds: 0,
        },
      });
      //Store ref to workerDoc in state. Needed for close/unsub

      this.setState({ workerDoc, ...workerDoc.data });
      console.log(PLUGIN_NAME, 'Fetched Stats Doc for ', workerSid, ' New State:', this.state);

      workerDoc.on("updated", (args) => {
        console.log(PLUGIN_NAME, `Document ${workerDoc.sid} updated`);
        console.log(PLUGIN_NAME, 'Updated Stats Doc. New State:', this.state);
        this.setState(workerDoc.data);
      });
    } catch (error) {
      console.error(PLUGIN_NAME, `Error fetchAndSubcribeToDoc for ${workerSid}`, error);
    }
  };

  async componentDidMount() {
    //fetch and sub to worker capacity sync doc
    const workerSid = this.props.workerSid;
    await this.fetchAndSubcribeToSyncDoc(workerSid);
    console.log(PLUGIN_NAME, 'Component Mounted');
  }

  componentWillUnmount() {
    //Cleanup
    //cancel sync subscription
    this.state.workerDoc.close();
    console.log(PLUGIN_NAME, 'Component Unmount');
  }

  formatHandleTime = (totalHandleTime, taskCount) => {
    let timeStr = "0";
    if (taskCount > 0) {
      const aht = Math.floor(totalHandleTime / taskCount);
      if (aht > 60) {
        let seconds = aht % 60;
        if (seconds < 10) seconds = "0" + seconds;
        timeStr = Math.floor(aht / 60) + ":" + seconds;
      } else {
        timeStr = aht + "s";
      }
      return timeStr;
    }
  }


  render() {
    const { callStats, chatStats } = this.state;
    let handledCalls = callStats.answered + callStats.outbound;

    let callAHT = this.formatHandleTime(callStats.totalHandlingTime, handledCalls);
    let chatAHT = this.formatHandleTime(chatStats.totalHandlingTime, chatStats.handled);

    return (
      <Container>
        <Channel>
          <Handled>Calls: {handledCalls}</Handled> <AHT> {callAHT} </AHT>
        </Channel>
        <Channel>
          <Handled>Chats: {chatStats.handled} </Handled> <AHT> {chatAHT} </AHT>
        </Channel>
      </Container>
    );
  }
}

export default AgentStatsCard;
