import styled from "react-emotion";

export const TileWrapper = styled("div")`
    background-color: ${(props) => getColor(props)};
    color: ${(props) => props.theme.calculated.textColor};
    padding: 12px;
    box-shadow: ${(props) => props.theme.colors.base4} 0 -1px 0 inset;
    display: flex;
    flex-direction: column;
`;

export const Title = styled("h3")`
    margin-top: 0;
    margin-bottom: 4px;
    letter-spacing: 2px;
    font-size: 10px;
    min-height: 30px;
    text-transform: uppercase;
    font-weight: bold;
`;
export const Description = styled("div")`
    font-size: 10px;
    line-height: 18px;
`;

export const Content = styled("div")`
    font-size: 36px;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: 1px;
`;

function getColor(props) {
  let {value, count, greenLine, yellowLine} = props;
  //No color if handled tasks count = 0 (N/A)
  if (!count) return props.theme.colors.base2;
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
  