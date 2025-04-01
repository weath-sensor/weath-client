import { create } from "zustand";

interface DataStore {
  ldrData: { id: number; ldr_value: number; timestamp: string }[];
  temperatureData: { id: number; temperature: number; timestamp: string }[];
  humidityData: { id: number; humidity_value: number; timestamp: string }[];
  loading: boolean;
  fetchAllData: () => void;
}

export const useDataStore = create<DataStore>((set) => ({
  ldrData: [],
  temperatureData: [],
  humidityData: [],
  loading: true,
  fetchAllData: async () => {
    set({ loading: true });
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const fetchData = async (url: string): Promise<any[]> => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`status: ${response.status}`);
        return (await response.json()).slice(-50).reverse();
      };

      const [ldr, temp, hum] = await Promise.all([
        fetchData(`${baseUrl}/ldr-data`),
        fetchData(`${baseUrl}/temperature`),
        fetchData(`${baseUrl}/humidity`),
      ]);
      set({ ldrData: ldr, temperatureData: temp, humidityData: hum, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
}));
