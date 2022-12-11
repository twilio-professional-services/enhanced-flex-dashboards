import * as React from "react";
import { TileWrapper, Title, Content, Description } from "./CustomSLDataTile.Components";
import { cx } from "emotion";

export class CustomSLDataTile extends React.PureComponent {
    render() {
        const { title, slPct, handledTasks, handledTasksWithinSL, className } = this.props;
        let content = "-";
        if (handledTasks && handledTasks > 0) {
            content = slPct + "%";
        }
        return (
            //Pass value to TileWrapper for changing color
            <TileWrapper value={slPct} count={handledTasks} className={cx("Twilio-AggregatedDataTile", className)}>
                <Title className="Twilio-AggregatedDataTile-Title">{title}</Title>
                <Content className="Twilio-AggregatedDataTile-Content">{content}</Content>
                <Description className="Twilio-AggregatedDataTile-Description">
                    {handledTasksWithinSL + " / " + handledTasks}
                </Description>
            </TileWrapper>
        );
    }
}