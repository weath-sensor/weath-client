import React, { useEffect, useState } from "react";
import { Table, Tabs } from "antd";
import "antd/dist/reset.css";

const { TabPane } = Tabs;

interface LdrData {
  id: number;
  ldr_value: string;
  timestamp: number;
}

const App: React.FC = () => {
  const [ldrData, setLdrData] = useState<LdrData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch("http://51.222.111.230:3000/ldr-data");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: LdrData[] = await response.json();
      setLdrData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const columns = [
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

  return (
    <div style={{ padding: "20px" }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Tabs defaultActiveKey="1" style={{ maxWidth: "100%", margin: "0 auto" }}>
          <TabPane tab="Data" key="1">
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
                columns={columns}
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
          {/* You can add more tabs here */}
          <TabPane tab="Other Tab" key="2">
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
