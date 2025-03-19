import React, { useEffect, useState } from "react";
import { Table, Tabs, Card } from "antd";
import "antd/dist/reset.css";

const { TabPane } = Tabs;

const App: React.FC = () => {
  const [ldrData, setLdrData] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1");

  const limitData = (data) => data.slice(-100).reverse();

  const fetchData = async (url, setter) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setter(limitData(data));
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
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

  const renderCurrentData = (data, label) => {
    if (!data.length) return <p>No data available</p>;
    const latest = data[0];
    return (
      <Card style={{ marginBottom: "10px" }}>
        <p><strong>{label}:</strong> {latest[label]}</p>
        <p><strong>Timestamp:</strong> {new Date(latest.timestamp).toLocaleString()}</p>
      </Card>
    );
  };

  const columns = {
    ldr: [
      { title: "ID", dataIndex: "id", key: "id" },
      { title: "LDR Value", dataIndex: "ldr_value", key: "ldr_value" },
      { title: "Timestamp", dataIndex: "timestamp", key: "timestamp", render: (t) => new Date(t).toLocaleString() },
    ],
    temperature: [
      { title: "ID", dataIndex: "id", key: "id" },
      { title: "Temperature (°C)", dataIndex: "temperature", key: "temperature" },
      { title: "Timestamp", dataIndex: "timestamp", key: "timestamp", render: (t) => new Date(t).toLocaleString() },
    ],
    humidity: [
      { title: "ID", dataIndex: "id", key: "id" },
      { title: "Humidity (%)", dataIndex: "humidity_value", key: "humidity_value" },
      { title: "Timestamp", dataIndex: "timestamp", key: "timestamp", render: (t) => new Date(t).toLocaleString() },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="LDR Data" key="1">
            {renderCurrentData(ldrData, "ldr_value")}
            <Table dataSource={ldrData} columns={columns.ldr} pagination={false} rowKey="id" />
          </TabPane>
          <TabPane tab="Temperature Data" key="2">
            {renderCurrentData(temperatureData, "temperature")}
            <Table dataSource={temperatureData} columns={columns.temperature} pagination={false} rowKey="id" />
          </TabPane>
          <TabPane tab="Humidity Data" key="3">
            {renderCurrentData(humidityData, "humidity_value")}
            <Table dataSource={humidityData} columns={columns.humidity} pagination={false} rowKey="id" />
          </TabPane>
        </Tabs>
      )}
    </div>
  );
};

export default App;