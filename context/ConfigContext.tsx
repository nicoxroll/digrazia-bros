import React, { createContext, useContext, useEffect, useState } from "react";
import { ConfigService } from "../services/supabase";
import { AppConfig } from "../types";

interface ConfigContextType {
  config: AppConfig;
  updateConfig: (updates: Partial<AppConfig>) => Promise<void>;
  isLoading: boolean;
}

const defaultConfig: AppConfig = {
  id: 1,
  ai_enabled: true,
  ai_chat_enabled: true,
  ai_simulation_enabled: true,
  use_test_images: true,
  maintenance_mode: false,
};

const ConfigContext = createContext<ConfigContextType>({
  config: defaultConfig,
  updateConfig: async () => {},
  isLoading: true,
});

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await ConfigService.getConfig();
      if (data) setConfig(data);
    } catch (error) {
      console.error("Failed to load config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = async (updates: Partial<AppConfig>) => {
    try {
      // Optimistic update
      setConfig((prev) => ({ ...prev, ...updates }));
      await ConfigService.updateConfig(updates);
    } catch (error) {
      console.error("Failed to update config:", error);
      // Revert on error
      loadConfig();
    }
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, isLoading }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
