import React, { useEffect, useState } from "react";
import { Table, Tabs } from "antd";
import "antd/dist/reset.css";

const { TabPane } = Tabs;

interface LdrData {
  id: number;
  ldr_value: string;
  timestamp: number;
}

interface TemperatureData {
  id: number;
  temperature: number;
  timestamp: number;
}

const App: React.FC = () => {
  const [ldrData, setLdrData] = useState<LdrData[]>([]);
  const [temperatureData, setTemperatureData] = useState<TemperatureData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLdrData = async () => {
    try {
      const response = await fetch("http://51.222.111.230:3000/ldr-data");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: LdrData[] = await response.json();
      setLdrData(data);
    } catch (error) {
      console.error("Error fetching LDR data:", error);
    }
  };

  const fetchTemperatureData = async () => {
    try {
      const response = await fetch("http://51.222.111.230:3000/temperature");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: TemperatureData[] = await response.json();
      setTemperatureData(data);
    } catch (error) {
      console.error("Error fetching temperature data:", error);
    }
  };

  useEffect(() => {
    fetchLdrData();
    fetchTemperatureData();
    const intervalId = setInterval(() => {
      fetchLdrData();
      fetchTemperatureData();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const ldrColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "LDR Value",
      dataIndex: "ldr_value",
      key: "ldr_value",
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp: number) => new Date(timestamp).toLocaleString(),
    },
  ];

  const temperatureColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Temperature (°C)",
      dataIndex: "temperature",
      key: "temperature",
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp: number) => new Date(timestamp).toLocaleString(),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Tabs defaultActiveKey="1" style={{ maxWidth: "100%", margin: "0 auto" }}>
          <TabPane tab="LDR Data" key="1">
            <div
              style={{
                maxHeight: "100%",
                overflowY: "auto",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Table
                dataSource={ldrData}
                columns={ldrColumns}
                pagination={false}
                rowKey="id"
              />
            </div>
            <div
              style={{
                textAlign: "left",
                marginTop: "10px",
                fontSize: "14px",
              }}
            >
              Total records: {ldrData.length}
            </div>
          </TabPane>

          {/* Add Temperature Data Tab */}
          <TabPane tab="Temperature Data" key="2">
            <div
              style={{
                maxHeight: "100%",
                overflowY: "auto",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Table
                dataSource={temperatureData}
                columns={temperatureColumns}
                pagination={false}
                rowKey="id"
              />
            </div>
            <div
              style={{
                textAlign: "left",
                marginTop: "10px",
                fontSize: "14px",
              }}
            >
              Total records: {temperatureData.length}
            </div>
          </TabPane>

          <TabPane tab="Other Tab" key="3">
            <div
              style={{
                padding: "20px",
                backgroundColor: "#f7f7f7",
                height: "100%",
                overflowY: "auto",
              }}
            >
              <p>Content for another tab goes here.</p>
            </div>
          </TabPane>
        </Tabs>
      )}
    </div>
  );
};

export default App;
