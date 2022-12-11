import { Icon } from '@twilio/flex-ui';
import * as React from "react";
import { TileWrapper, Summary, Chart, Description, Group, Label, Metric, SLPct } from "./GroupsChartTile.Components"
import { cx } from "emotion";

import { connect } from "react-redux";
import QueueDataUtil from "../../utils/QueueDataUtil";
import PieChart from 'react-minimal-pie-chart';

/**
 * @param {props} props.groups The queue groupings (for example ["sales", "service"])
 */
const GroupsChartTile = connect((state, ownProps) => {
    const queues = Object.values(state.flex.realtimeQueues.queuesList);
    return QueueDataUtil.getSLTodayByQueueGroups(queues, ownProps.groups);
    //object returned from connect is merged into component props
    //See https://react-redux.js.org/api/connect
})((props) => {
    //props has all task counts

    const { className, colors, groups } = props;
    const count = groups.length;

    const handled1 = props[groups[0]].handledTasks || 0;
    const slPct1 = props[groups[0]].serviceLevelPct;

    const handled2 = props[groups[1]].handledTasks || 0;
    const slPct2 = props[groups[1]].serviceLevelPct;

    let handled3 = 0, handled4 = 0;
    let slPct3, slPct4;
    if (count > 2) {
        handled3 = props[groups[2]].handledTasks || 0;
        slPct3 = props[groups[2]].serviceLevelPct;
    }
    if (count > 3) {
        handled4 = props[groups[3]].handledTasks || 0;
        slPct4 = props[groups[3]].serviceLevelPct;
    }


    let data = [];
    if (handled1) data.push({ title: groups[0], value: handled1, color: colors[0] });
    if (handled2) data.push({ title: groups[1], value: handled2, color: colors[1] });
    if (handled3) data.push({ title: groups[2], value: handled3, color: colors[2] });
    if (handled4) data.push({ title: groups[3], value: handled4, color: colors[2] });

    return (
        <TileWrapper className={cx("Twilio-AggregatedDataTile", className)}>
            <Summary>
                <Description className="Twilio-AggregatedDataTile-Description">SLA Today</Description>
                <Group>
                    <Label bgColor={colors[0]}>{groups[0]}:</Label>
                    {handled1 > 0 ?
                        <SLPct value={slPct1}> {slPct1}% </SLPct>
                        : <Metric> - </Metric>
                    }
                </Group>
                <Group>
                    <Label bgColor={colors[1]}>{groups[1]}:</Label>
                    {handled2 > 0 ?
                        <SLPct value={slPct2}> {slPct2}% </SLPct>
                        : <Metric> - </Metric>
                    }
                </Group>
                <Group>
                    <Label bgColor={colors[2]}>{groups[2]}:</Label>
                    {handled3 > 0 ?
                        <SLPct value={slPct3}> {slPct3}% </SLPct>
                        : <Metric> - </Metric>
                    }
                </Group>
                <Group>
                    <Label bgColor={colors[3]}>{groups[3]}:</Label>
                    {handled4 > 0 ?
                        <SLPct value={slPct4}> {slPct4}% </SLPct>
                        : <Metric> - </Metric>
                    }
                </Group>
                <Description className="Twilio-AggregatedDataTile-Description">Handled Tasks &rarr;</Description>
            </Summary>
            <Chart>
                <PieChart
                    labelStyle={{
                        fontSize: '14px', fill: 'Black'
                    }}
                    data={data}
                    label={true}
                />
            </Chart>

        </TileWrapper>
    )
});

export default GroupsChartTile;
