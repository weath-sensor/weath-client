import React, { useEffect, useState } from "react";
import { Table, Tabs, Card, Button } from "antd";
import "antd/dist/reset.css";
import { CanvasJSChart } from 'canvasjs-react-charts';

const { TabPane } = Tabs;

const App: React.FC = () => {
  // Explicitly define the type of state for each data array
  const [ldrData, setLdrData] = useState<{ id: number; ldr_value: number; timestamp: string }[]>([]);
  const [temperatureData, setTemperatureData] = useState<{ id: number; temperature: number; timestamp: string }[]>([]);
  const [humidityData, setHumidityData] = useState<{ id: number; humidity_value: number; timestamp: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1");

  const limitData = (data: any[]) => data.slice(-50).reverse();

  const fetchData = async (url: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setter(limitData(data));
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };

  const fetchCsvSummary = async () => {
    try {
      const response = await fetch("http://51.222.111.230:3000/csv-summary");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.text();
      const link = document.createElement('a');
      link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(data);
      link.download = "csv-summary.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error fetching CSV summary:", error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchData("http://51.222.111.230:3000/ldr-data", setLdrData);
      await fetchData("http://51.222.111.230:3000/temperature", setTemperatureData);
      await fetchData("http://51.222.111.230:3000/humidity", setHumidityData);
      setLoading(false);
    };
    fetchAllData();
    const intervalId = setInterval(fetchAllData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const renderChart = (data: any[], label: string, yKey: string) => {
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

  return (
    <div style={{ padding: "20px" }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="LDR Data" key="1">
              {renderChart(ldrData, "LDR Value", "ldr_value")}
              <Table dataSource={ldrData} columns={[
                { title: "ID", dataIndex: "id", key: "id" },
                { title: "LDR Value", dataIndex: "ldr_value", key: "ldr_value" },
                { title: "Timestamp", dataIndex: "timestamp", key: "timestamp", render: (t: string) => new Date(t).toLocaleString() },
              ]} pagination={false} rowKey="id" />
            </TabPane>
            <TabPane tab="Temperature Data" key="2">
              {renderChart(temperatureData, "Temperature (°C)", "temperature")}
              <Table dataSource={temperatureData} columns={[
                { title: "ID", dataIndex: "id", key: "id" },
                { title: "Temperature (°C)", dataIndex: "temperature", key: "temperature" },
                { title: "Timestamp", dataIndex: "timestamp", key: "timestamp", render: (t: string) => new Date(t).toLocaleString() },
              ]} pagination={false} rowKey="id" />
            </TabPane>
            <TabPane tab="Humidity Data" key="3">
              {renderChart(humidityData, "Humidity (%)", "humidity_value")}
              <Table dataSource={humidityData} columns={[
                { title: "ID", dataIndex: "id", key: "id" },
                { title: "Humidity (%)", dataIndex: "humidity_value", key: "humidity_value" },
                { title: "Timestamp", dataIndex: "timestamp", key: "timestamp", render: (t: string) => new Date(t).toLocaleString() },
              ]} pagination={false} rowKey="id" />
            </TabPane>
          </Tabs>
          <Button 
            type="primary" 
            style={{ marginTop: "20px" }} 
            onClick={fetchCsvSummary}
          >
            Download CSV Summary
          </Button>
        </>
      )}
    </div>
  );
};

export default App;
