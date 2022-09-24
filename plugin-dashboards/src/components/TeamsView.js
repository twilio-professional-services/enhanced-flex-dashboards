import { WorkersDataTable, ColumnDefinition } from '@twilio/flex-ui';
import AgentCapacityCard from './AgentCapacityCard/AgentCapacityCard';
import AgentStatsCard from './AgentStats/AgentStatsCard';

const displayRoleCode = (manager) => {
  window.Handlebars.registerHelper('showRoleCode', (workerAttributes) => {
    if (workerAttributes.roles) {
      if (workerAttributes.roles.includes('supervisor')) {
        return '(S)';
      } else if (workerAttributes.roles.includes('agent')) {
        return '(A)';
      } else if (workerAttributes.roles.includes('admin')) {
        return '(D)';
      } else {
        return '';
      }
    }
  });

  manager.strings.WorkerDirectoryItemFirstLine = "{{worker.fullName}} {{showRoleCode worker.attributes}}";
  manager.strings.SupervisorUserCardFirstLine = "{{worker.fullName}} {{showRoleCode worker.attributes}}";
}

const addColumns = () => {

  WorkersDataTable.Content.add(<ColumnDefinition key="agentStats" header={"Handled | AHT"} style={{ width: 150 }}
    content={(item, context) => (
      <AgentStatsCard workerSid={item.worker.sid} context={context} />
    )}
  />, { sortOrder: 3 });

  WorkersDataTable.Content.add(<ColumnDefinition key="channelCapacity" header={"Capacity"} style={{ width: 75 }}
    content={(item, context) => (
      <AgentCapacityCard workerSid={item.worker.sid} context={context} />
    )}
  />, { sortOrder: 10 });

  WorkersDataTable.Content.add(<ColumnDefinition key="skills" header={"Skills"} style={{ width: 150 }}
    content={item => {
      return item.worker.attributes.routing ?
        item.worker.attributes.routing?.skills.join(' / ') : 'NONE'
    }}
  />, { sortOrder: 5 });

  // WorkersDataTable.Content.add(<ColumnDefinition key="team" header={"Team"} 
  // content={item => item.worker.attributes.team_name}/>);

}

export default (manager) => {
  displayRoleCode(manager);
  addColumns();
}