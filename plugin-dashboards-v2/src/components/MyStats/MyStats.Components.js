import styled from "react-emotion";

export const Container = styled("div")`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  font-size: 10px;
  margin-bottom: auto;
  margin-right: 4px;
  margin-top: auto;
  text-align: center;
`;

export const Tile = styled("div")`
  background-color: #606471;
  border-radius: 3px;
  flex-direction: column;
  margin-right: 5px;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 6px;
  padding-right: 6px;
`;

export const Metric = styled("div")`
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
`;

export const Label = styled("div")`
  font-size: 8px;
  font-weight: bold;
  color: #ffffff;
`;
