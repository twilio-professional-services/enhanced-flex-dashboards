import * as React from 'react';
import { withTheme } from '@twilio/flex-ui';
import styled from 'react-emotion';

const PLUGIN_NAME = 'DashboardsPlugin';

function ServiceLevelTile(props) {

  const {  theme } = props;
  //console.log(PLUGIN_NAME, 'Theme:', theme);
  let bgColor = getColor(props);

  return (
    <div style={{'background-color' : bgColor}}>
      <SLA> {props.sla.serviceLevelPct }% </SLA>
    </div>
  );
  
}

function getColor(props) {
  if (props.sla.serviceLevelPct >= 90) {
    //return props.theme.colors.notificationBackgroundColorSuccess;
    return "#d0f4d1";
  } else if (props.sla.serviceLevelPct > 60) {
    //return props.theme.colors.notificationBackgroundColorWarning;
    return "#ffe3b9";
  } else {
    //return props.theme.colors.notificationBackgroundColorError;
    return "#feced3";
  }
}

const SLA = styled("div")`
      display: flex;
      flex-direction: row;
      padding: 24px 12px;
      align-items: center;
      font-size: 30px;
      font-weight: 600;   
    `;

export default withTheme(ServiceLevelTile);