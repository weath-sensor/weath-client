import React, { FC } from "react";
import Chart from "../Chart/Chart";
import { formatDate } from "../../utils/formatDate";
import { Table } from "antd";

type DataPoint = {
    timestamp: string;
    [key: string]: string | number;
}

type TabContentProps = {
    data: DataPoint[];
    label: string;
    yKey: string;
};

export const TabContent: FC<TabContentProps> = ({ data, label, yKey }) => {
    return (
        <>
            <Chart data={data} label={label} yKey={yKey} />
            <Table
                dataSource={data}
                columns={[
                    { title: "ID", dataIndex: "id", key: "id" },
                    { title: label, dataIndex: yKey, key: yKey },
                    { title: "TimeStamp", dataIndex: 'timestamp', key: "timestamp", render: formatDate },
                ]}
                rowKey="id"
            />
        </>
    )
}