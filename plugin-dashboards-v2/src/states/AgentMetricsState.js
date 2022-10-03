const ACTION_SET_AGENT_METRICS = "SET_AGENT_METRICS";

const initialState = { };

// Define plugin actions
export class Actions {
  static setAgentMetrics = (agentMetrics) => ({
    type: ACTION_SET_AGENT_METRICS,
    agentMetrics
  });
}

// Define how actions influence state
export function reduce(state = initialState, action) {
  switch (action.type) {
    case ACTION_SET_AGENT_METRICS:
      return {
        ...state,
        ...action.agentMetrics
      };
    default:
      return state;
  }

};
