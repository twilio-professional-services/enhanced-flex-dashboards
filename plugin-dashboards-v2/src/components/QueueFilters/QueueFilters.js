import * as React from 'react';
import { QueuesStats } from '@twilio/flex-ui';
//import MenuItem from '@material-ui/core/MenuItem';
//import Select from '@material-ui/core/Select';
import { Container, Filter } from './QueueFilters.Components';
import { Theme } from '@twilio-paste/core/theme';
import { Button, Text, Select, Option } from "@twilio-paste/core";



const PLUGIN_NAME = "DashboardsPlugin";
const DefaultFilter = 'ALL';

const INITIAL_STATE = {
  channelFilter: DefaultFilter,
  groupFilter: DefaultFilter,
  channelOptions: ['ALL', 'voice', 'chat'],
  groupOptions: ['ALL', 'sales', 'service']
};

class QueueFilters extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }


  handleChangeChannelFilter = e => {
    console.log(PLUGIN_NAME, 'Change event', e.target);
    const value = e.target.value;
    this.setState({ channelFilter: value });
  }

  handleChangeGroupFilter = e => {
    console.log(PLUGIN_NAME, 'Change event', e.target);
    const value = e.target.value;
    this.setState({ groupFilter: value });
  }

  componentDidUpdate(prevProps) {
    console.log(PLUGIN_NAME, 'New state', this.state);
    let group = this.state.groupFilter;
    let channel = this.state.channelFilter;
    if (group == DefaultFilter && channel == DefaultFilter) {
      //Show all
      QueuesStats.setFilter((queue) => true);
    } else if (group == DefaultFilter) {
      //Only apply channel filter
      QueuesStats.setFilter((queue) => queue.friendly_name.includes(channel));
    } else if (channel == DefaultFilter) {
      //Only apply group filter
      QueuesStats.setFilter((queue) => queue.friendly_name.includes(group));
    } else {
      //Apply both filters
      QueuesStats.setFilter((queue) => queue.friendly_name.includes(group) 
                                  && queue.friendly_name.includes(channel));
    }

  }



  render() {
    return (
      <Theme.Provider theme="flex">
      <Container>
        <Filter key="channel-filter">
          <Text>Channel:&nbsp;&nbsp;</Text>
          <Select
            value={this.state.channelFilter}
            onChange={this.handleChangeChannelFilter}
            name="channel"
            id="channel"
            key="channel"
          >
            {this.state.channelOptions.map((option) => (
              <Option
                key={option}
                value={option}
              > {option}
              </Option>
            ))}
          </Select>
        </Filter>
        <Filter key="group-filter">
          <Text>Group:&nbsp;&nbsp;</Text>
          <Select
            value={this.state.groupFilter}
            onChange={this.handleChangeGroupFilter}
            name="group"
            id="group"
            key="group"
          >
            {this.state.groupOptions.map((option) => (
              <Option
                key={option}
                value={option}
              > {option}
              </Option>
            ))}
          </Select>
        </Filter>
      </Container>
      </Theme.Provider>

    );
  }
}


export default QueueFilters;
