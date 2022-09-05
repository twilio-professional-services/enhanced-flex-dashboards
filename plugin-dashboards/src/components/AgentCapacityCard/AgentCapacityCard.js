import React from "react";
import { Icon, FlexBox } from '@twilio/flex-ui';
import { SYNC_CLIENT as syncClient } from "../../utils/syncHelper";
import { Container, Channel } from './AgentCapacityCard.Components';

const PLUGIN_NAME = "DashboardsPlugin";

const INITIAL_STATE = {
  workerDoc: undefined,
  chatCapacity: 1,
  chatTasks: 0,
  chatAvailable: true,
  smsCapacity: 1,
  smsTasks: 0,
  smsAvailable: true
}


class AgentCapacityCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE
  }

  fetchAndSubcribeToSyncDoc = async (workerSid) => {
    try {
      const workerDoc = await syncClient.document({
        id: `workerCapacityFor-${workerSid}`,
        mode: "open_or_create",
        value: {
          chatCapacity: 1,
          chatTasks: 0,
          chatAvailable: true,
          smsCapacity: 1,
          smsTasks: 0,
          smsAvailable: true
        },
      });
      //Store ref to workerDoc in state. Needed for close/unsub

      this.setState({workerDoc, ...workerDoc.value});
      console.log(PLUGIN_NAME, 'Fetched Capacity Doc for ', workerSid, ' New State:', this.state);

      workerDoc.on("updated", (args) => {
        console.log(PLUGIN_NAME, `Document ${workerDoc.sid} updated`);
        console.log(PLUGIN_NAME, 'Updated Capacity Doc. New State:', this.state);
        this.setState(workerDoc.value);
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


  render() {
    const { chatCapacity, chatTasks, chatAvailable, smsCapacity, smsTasks, smsAvailable } = this.state;
    
    return (
      <Container>
        {!chatAvailable && <Channel> Chat Unavailable </Channel>}
        {chatAvailable &&
          <Channel> 
            {chatCapacity > 0 && chatTasks >= 0 ?
              <div>Chat: {chatTasks} / {chatCapacity} </div> :
              <div>Chat: ? </div>
            }
          </Channel>
        }

        {!smsAvailable && <Channel> SMS Unavailable </Channel>}
        {smsAvailable &&
          <Channel> 
            {smsCapacity > 0 && smsTasks >= 0 ?
              <div> SMS: {smsTasks} / {smsCapacity} </div> :
              <div> SMS: ? </div>
            }
          </Channel>
        }
      </Container>
    );
  }
}

export default AgentCapacityCard;
