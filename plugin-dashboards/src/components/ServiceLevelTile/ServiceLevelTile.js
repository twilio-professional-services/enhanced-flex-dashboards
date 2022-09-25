import * as React from 'react';
import { withTheme } from '@twilio/flex-ui';
import styled from 'react-emotion';

const PLUGIN_NAME = 'DashboardsPlugin';

function ServiceLevelTile(props) {

  const {  theme } = props;
  //console.log(PLUGIN_NAME, theme);
  let bgColor = getColor(props);

  return (
    <div style={{'background-color' : bgColor}}>
      <SLA> {props.sla.serviceLevelPct } % </SLA>
    </div>
  );
  
}

function getColor(props) {
  if (props.sla.serviceLevelPct >= 90) {
    return props.theme.colors.notificationBackgroundColorSuccess;
  } else if (props.sla.serviceLevelPct > 60) {
    return props.theme.colors.notificationBackgroundColorWarning;
  } else {
    return props.theme.colors.notificationBackgroundColorError;
  }
}

const SLA = styled("div")`
      display: flex;
      flex-direction: row;
      padding: 6px 6px 12px 6px;
      align-items: center;
      font-size: 35px;
      height: 40px;
      font-weight: 600;   
    `;

export default withTheme(ServiceLevelTile);