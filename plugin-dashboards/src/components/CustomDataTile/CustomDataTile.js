import * as React from "react";
import { TileWrapper, Title, Content, Description } from "./CustomDataTile.Components";
import { cx } from "emotion";

/**
 * Props to define the content of an AggregatedDataTile
 *
 * @typedef AggregatedDataTileProps
 * @property {React.ReactChild} title - The main title of the tile
 * @property {string} [content] - The textual content of the tile. If props.children is provided, this prop won't be rendered.
 * @property {React.ReactChild} [description] - A secondary description of the tile.
 * @property {string} [className] - - An additional class name for the tile
 * @memberof AggregatedDataTile
 * @private
 */
// export interface AggregatedDataTileProps {
//     title: React.ReactChild;
//     content?: string;
//     description?: React.ReactChild;
//     className?: string;
// }

/**
 * This component is used to display KPIs
 *
 * @component
 * @category Components / Basic
 * @hideconstructor
 * @param {AggregatedDataTile.AggregatedDataTileProps} props - props
 * @private
 */
export class CustomDataTile extends React.PureComponent {
    render() {
        const { title, content, description, children, className, bgColor } = this.props;

        return (
            <TileWrapper className={cx("Twilio-AggregatedDataTile", className)} bgColor={bgColor}>
                <Title className="Twilio-AggregatedDataTile-Title">{title}</Title>
                {children || <Content className="Twilio-AggregatedDataTile-Content">{content}</Content>}
                {description && (
                    <Description className="Twilio-AggregatedDataTile-Description">{description}</Description>
                )}
            </TileWrapper>
        );
    }
}