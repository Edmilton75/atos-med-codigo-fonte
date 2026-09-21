"use client";
import { createContext, useContext } from "react";
import { defaultSettings, type Settings } from "@/lib/content";
const Context = createContext<Settings>(defaultSettings);
export function SettingsProvider({
  settings,
  children,
}: {
  settings: Settings;
  children: React.ReactNode;
}) {
  return <Context.Provider value={settings}>{children}</Context.Provider>;
}
export const useSettings = () => useContext(Context);
