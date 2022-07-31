import { WorkersDataTable, ColumnDefinition } from '@twilio/flex-ui';

const displayRoleCode = (manager) => {
  window.Handlebars.registerHelper('showRoleCode', (workerAttributes) => {
    if (workerAttributes.roles.includes('supervisor')) {
      return '(S)';
    } else if (workerAttributes.roles.includes('agent')) {
      return '(A)';
    } else if (workerAttributes.roles.includes('admin')) {
      return '(D)';
    } else {
      return '';
    }
  });

  manager.strings.WorkerDirectoryItemFirstLine = "{{worker.fullName}} {{showRoleCode worker.attributes}}";
  manager.strings.SupervisorUserCardFirstLine = "{{worker.fullName}} {{showRoleCode worker.attributes}}";
}

const addColumns = () => {
  WorkersDataTable.Content.add(<ColumnDefinition key="maxChat" header={"Chat Util."} style={{ width: 75 }}
    content={item => {
      if (Object.hasOwn(item.worker.attributes, "chatTasks") 
      && Object.hasOwn(item.worker.attributes, "chatCapacity")
      && Object.hasOwn(item.worker.attributes, "chatAvailable")) {
        return item.worker.attributes.chatAvailable ? 
        item.worker.attributes.chatTasks + " / " + item.worker.attributes.chatCapacity:
        "X";
      } else {
        return "?";
      }
    }} />);
  WorkersDataTable.Content.add(<ColumnDefinition key="maxSMS" header={"SMS Util."} style={{ width: 75 }}
    content={item => {
      if (Object.hasOwn(item.worker.attributes, "smsTasks") 
      && Object.hasOwn(item.worker.attributes, "smsCapacity")
      && Object.hasOwn(item.worker.attributes, "smsAvailable")) {
        return item.worker.attributes.smsAvailable ?
        item.worker.attributes.smsTasks + " / " + item.worker.attributes.smsCapacity:
        "X";
      } else {
        return "?";
      }
    }} />);

  WorkersDataTable.Content.add(<ColumnDefinition key="skills" header={"Skills"}
    content={item => {
      return item.worker.attributes.routing ?
        item.worker.attributes.routing?.skills.join(' / ') : 'NONE'
    }
    } />);

    // WorkersDataTable.Content.add(<ColumnDefinition key="team" header={"Team"} 
    // content={item => item.worker.attributes.team_name}/>);

}

export default (manager) => {
  displayRoleCode(manager);
  addColumns();
}