import { Icon } from '@twilio/flex-ui';
import * as React from "react";
import { TileWrapper, Summary, Chart, Description, Channel, Label, Metric, SLPct } from "./AllChannelsSLATile.Components"
import { cx } from "emotion";

import { connect } from "react-redux";
import QueueDataUtil from "../../utils/QueueDataUtil";
import PieChart from 'react-minimal-pie-chart';

const AllChannelsSLATile = connect((state) => {
    const queues = Object.values(state.flex.realtimeQueues.queuesList);
    return QueueDataUtil.getSLTodayByChannel(queues);
    //object returned from connect is merged into component props
    //See https://react-redux.js.org/api/connect
})((props) => {
    //props has all task counts

    const { className, colors } = props;
    const handledVoice = props.voice.handledTasks || 0;
    const handledChat = props.chat.handledTasks || 0;
    const handledSMS = props.sms.handledTasks || 0;

    const slPctVoice = props["voice"].serviceLevelPct;
    const slPctChat = props["chat"].serviceLevelPct;
    const slPctSMS = props["sms"].serviceLevelPct;
    let data = [];
    if (handledVoice) data.push({ title: 'voice', value: handledVoice, color: colors.voice });
    if (handledChat) data.push({ title: 'chat', value: handledChat, color: colors.chat });
    if (handledSMS) data.push({ title: 'sms', value: handledSMS, color: colors.sms });

    return (
        <TileWrapper className={cx("Twilio-AggregatedDataTile", className)}>
            <Summary>
                <Description className="Twilio-AggregatedDataTile-Description">Channel SLA Today</Description>
                <Channel>
                    <Icon icon='Call' />
                    <Label bgColor={colors.voice}>Voice:</Label>
                    {handledVoice > 0 ?
                        <SLPct value={slPctVoice}> {slPctVoice}% </SLPct>
                        : <Metric> - </Metric>
                    }
                </Channel>
                <Channel>
                    <Icon icon='Message' />
                    <Label bgColor={colors.chat}>Chat:</Label>
                    {handledChat > 0 ?
                        <SLPct value={slPctChat}> {slPctChat}% </SLPct>
                        : <Metric> - </Metric>
                    }
                </Channel>

                <Channel>
                    <Icon icon='Sms' />
                    <Label bgColor={colors.sms}>SMS:</Label>
                    {handledSMS > 0 ?
                        <SLPct value={slPctSMS}> {slPctSMS}% </SLPct>
                        : <Metric> - </Metric>
                    }
                </Channel>
                <Description className="Twilio-AggregatedDataTile-Description">Handled Task Count &rarr;</Description>
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

export default AllChannelsSLATile;
