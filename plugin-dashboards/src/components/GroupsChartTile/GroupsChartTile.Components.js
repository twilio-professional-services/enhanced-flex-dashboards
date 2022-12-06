import styled from "react-emotion";

export const TileWrapper = styled("div")`
    background-color: ${(props) => props.theme.colors.base2};
    color: ${(props) => props.theme.calculated.textColor};
    padding: 12px;
    box-shadow: ${(props) => props.theme.colors.base4} 0 -1px 0 inset;
    display: flex;
    flex-direction: row;
    min-width: 230px;
    flex: 1 1 auto;
`;
export const Summary = styled("div")`
  flex-direction: column;
  padding-right: 16px;
`;

export const Chart = styled("div")`
  width: 120px;
  display: flex;
  justify-content: center;
`;

export const Description = styled("div")`
    font-size: 10px;
    line-height: 14px;
`;

export const Group = styled("div")`
display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  font-size: 12px;
  margin-bottom: 1px;
  margin-top: 1px;
`;

export const Label = styled("div")`
  background-color: ${(props) => props.bgColor || props.theme.colors.base2};
  font-size: 10px;
  font-weight: bold;
  width: 55px;
  padding: 2px 2px 2px 6px;
  margin: 1px;
`;

export const Metric = styled("div")`
  font-size: 10px;
  padding: 2px;
  width: 40px;
  text-align: right;
  margin: 1px;

`;

export const SLPct = styled("div")`
  background-color: ${(props) => getColor(props)};
  font-size: 10px;
  font-weight: bold;
  padding: 2px;
  width: 40px;
  text-align: right;
  margin: 1px;
`;

function getColor(props) {
  let {value, greenLine, yellowLine} = props;
  if (!greenLine) greenLine = 90;
  if (!yellowLine) yellowLine = 60;
    if (value >= greenLine) {
      return props.theme.colors.notificationBackgroundColorSuccess;
    } else if (value > yellowLine) {
      return props.theme.colors.notificationBackgroundColorWarning;
    } else {
      return props.theme.colors.notificationBackgroundColorError;
    }
  }

