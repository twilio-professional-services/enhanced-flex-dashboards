import styled from "react-emotion";

export const TileWrapper = styled("div")`
    background-color: ${(props) => props.theme.colors.base2};
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
    font-size: 48px;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: 1px;
`;