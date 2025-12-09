import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type NavigationTab = "home" | "library" | "browse";

interface NavigationHistoryItem {
  tab: NavigationTab;
  timestamp: number;
}

interface NavigationContextType {
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  
  history: NavigationHistoryItem[];
  pushHistory: (tab: NavigationTab) => void;
  canGoBack: boolean;
  goBack: () => void;
  
  showBackButton: boolean;
  setShowBackButton: (show: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentTab, setCurrentTabState] = useState<NavigationTab>("home");
  const [history, setHistory] = useState<NavigationHistoryItem[]>([
    { tab: "home", timestamp: Date.now() },
  ]);
  const [showBackButton, setShowBackButton] = useState(false);

  const setCurrentTab = useCallback((tab: NavigationTab) => {
    setCurrentTabState(tab);
  }, []);

  const pushHistory = useCallback((tab: NavigationTab) => {
    setHistory((prev) => {
      // Don't add duplicate consecutive tabs
      if (prev.length > 0 && prev[prev.length - 1].tab === tab) {
        return prev;
      }
      return [...prev, { tab, timestamp: Date.now() }];
    });
    setCurrentTab(tab);
  }, [setCurrentTab]);

  const canGoBack = history.length > 1;

  const goBack = useCallback(() => {
    if (!canGoBack) return;
    setHistory((prev) => {
      const newHistory = prev.slice(0, -1);
      if (newHistory.length > 0) {
        setCurrentTab(newHistory[newHistory.length - 1].tab);
      }
      return newHistory;
    });
  }, [canGoBack, setCurrentTab]);

  return (
    <NavigationContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        history,
        pushHistory,
        canGoBack,
        goBack,
        showBackButton,
        setShowBackButton,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
