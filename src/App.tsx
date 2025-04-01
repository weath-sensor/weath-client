import React, { FC, useEffect, useState } from "react";
import { Tabs } from "antd";
import "antd/dist/reset.css";
import { TabContent } from "./components/TabContent/TabContent";
import { useDataStore } from "./store/useDataStore";

const { TabPane } = Tabs;

const App: FC = () => {
  const [activeTab, setActiveTab] = useState("1");

  const { ldrData, temperatureData, humidityData, loading, fetchAllData } = useDataStore();

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const data = {
    "1": { data: ldrData, label: "LDR Value", yKey: "ldr_value" },
    "2": { data: temperatureData, label: "Temperature (°C)", yKey: "temperature" },
    "3": { data: humidityData, label: "Humidity (%)", yKey: "humidity_value" },
  };

  return (
    <div style={{ padding: "20px" }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {Object.keys(data).map((key) => (
            <TabPane tab={data[key].label} key={key}>
              <TabContent
                data={data[key].data}
                label={data[key].label}
                yKey={data[key].yKey}
                key={key}
              />
            </TabPane>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default App;
