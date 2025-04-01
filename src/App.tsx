import React, { useEffect, useState } from "react";
import { Table, Tabs, } from "antd";
import "antd/dist/reset.css";
import Chart from "./components/Chart/Chart";
const { TabPane } = Tabs;

const App: React.FC = () => {
  const [ldrData, setLdrData] = useState<{ id: number; ldr_value: number; timestamp: string }[]>([]);
  const [temperatureData, setTemperatureData] = useState<{ id: number; temperature: number; timestamp: string }[]>([]);
  const [humidityData, setHumidityData] = useState<{ id: number; humidity_value: number; timestamp: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1");

  const limitData = (data: any[]) => data.slice(-50).reverse();
  const fetchData = async (url: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`status: ${response.status}`);
      const data = await response.json();
      setter(limitData(data));
    } catch (error) { console.error(error) }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchData(`${import.meta.env.VITE_API_BASE_URL}/ldr-data`, setLdrData);
      await fetchData(`${import.meta.env.VITE_API_BASE_URL}/temperature`, setTemperatureData);
      await fetchData(`${import.meta.env.VITE_API_BASE_URL}/humidity`, setHumidityData);
      setLoading(false);
    };
    fetchAllData();
    const intervalId = setInterval(fetchAllData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="LDR Data" key="1">
            <Chart data={ldrData} label="LDR Value" yKey="ldr_value" />
            <Table dataSource={ldrData} columns={[
                { title: "ID", dataIndex: "id", key: "id" },
                { title: "LDR Value", dataIndex: "ldr_value", key: "ldr_value" },
                { title: "Timestamp", dataIndex: "timestamp", key: "timestamp", render: (t: string) => new Date(t).toLocaleString() },
              ]} pagination={false} rowKey="id" />
            </TabPane>
            <TabPane tab="Temperature Data" key="2">
              <Chart data={temperatureData} label="Temperature (°C)" yKey="temperature" />
              <Table dataSource={temperatureData} columns={[
                { title: "ID", dataIndex: "id", key: "id" },
                { title: "Temperature (°C)", dataIndex: "temperature", key: "temperature" },
                { title: "Timestamp", dataIndex: "timestamp", key: "timestamp", render: (t: string) => new Date(t).toLocaleString() },
              ]} pagination={false} rowKey="id" />
            </TabPane>
            <TabPane tab="Humidity Data" key="3">
            <Chart data={humidityData} label="Humidity (%)" yKey="humidity_value" />
              <Table dataSource={humidityData} columns={[
                { title: "ID", dataIndex: "id", key: "id" },
                { title: "Humidity (%)", dataIndex: "humidity_value", key: "humidity_value" },
                { title: "Timestamp", dataIndex: "timestamp", key: "timestamp", render: (t: string) => new Date(t).toLocaleString() },
              ]} pagination={false} rowKey="id" />
            </TabPane>
          </Tabs>
          
        </>
      )}
    </div>
  );
};

export default App;
