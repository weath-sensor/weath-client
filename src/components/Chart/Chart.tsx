import React, { FC } from "react"
import { CanvasJSChart } from 'canvasjs-react-charts';

type DataPoint = {
    timestamp: string;
    [key: string]: string | number;
}

type ChartProps = {
    data: DataPoint[];
    label: string;
    yKey: string;
};

const Chart: React.FC<ChartProps> = ({ data, label, yKey }) => {
  const chartData = data.map((item) => ({
    x: new Date(item.timestamp),
    y: item[yKey],
  }));

  const options = {
    animationEnabled: true,
    theme: "light2",
    title: { text: `${label}` },
    axisX: { valueFormatString: "HH:mm:ss" },
    axisY: { title: label },
    data: [{
      type: "line",
      dataPoints: chartData,
    }],
  };

  return <CanvasJSChart options={options} />;
};

export default Chart;
