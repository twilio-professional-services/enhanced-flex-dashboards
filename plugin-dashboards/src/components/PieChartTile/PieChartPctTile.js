import * as React from "react";
import { TileWrapper, Title, Content, Description } from "./PieChartTile.Components";
import { cx } from "emotion";
import PieChart from 'react-minimal-pie-chart';

export class PieChartTile extends React.PureComponent {
    render() {
        const { title, content, description, children, className } = this.props;

        return (
            <TileWrapper className={cx("Twilio-AggregatedDataTile", className)}>
                <PieChart
                    labelStyle={{
                        fontSize: '14px', fill: 'Black'
                    }}
                    data={content}

                    label={({ data, dataIndex }) =>
                        Math.round(data[dataIndex].percentage) + '%'
                    }
                />
                {description && (
                    <Description className="Twilio-AggregatedDataTile-Description">{description}</Description>
                )}
            </TileWrapper>
        );
    }
}