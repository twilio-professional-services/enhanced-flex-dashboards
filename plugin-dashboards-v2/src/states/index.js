import { combineReducers } from 'redux';

import { reduce as AgentMetricsReducer } from './AgentMetricsState';

// Register your redux store under a unique namespace
export const namespace = 'dashboards';

// Combine the reducers
export default combineReducers({
  agentMetrics: AgentMetricsReducer
});
