import { useColorScheme } from "react-native";
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

// Define Interfaces
interface colorProviderType {
  children: ReactNode;
}

export interface colorScheme {
  backgroundColor: string;
  text: string;
  primaryOne: string;
  primaryTwo: string;
  subtleText: string;
}

type colorContextType = {
  colors: colorScheme;
  theme: "light" | "dark";
  toggleTheme: () => void;
};

// Create the context
const ColorContext = createContext<colorContextType | null>(null);

// Create hook to access context values
export const useColor = (): colorContextType | any => useContext(ColorContext);

// Define light nadn dark mode colors
const lightMode: colorScheme = {
  backgroundColor: "#FBFF62",
  text: "#28282B",
  primaryOne: "#DEE05A",
  primaryTwo: "#B0B243",
  subtleText: "#949494",
};
const darkMode: colorScheme = {
  backgroundColor: "#FBFF62",
  text: "#28282B",
  primaryOne: "#CCCE4F",
  primaryTwo: "#B0B243",
  subtleText: "#949494",
};

// Make and export the contex provider component
export const ColorProvider: React.FC<colorProviderType> = ({ children }) => {
  const scheme = useColorScheme();
  const [theme, setTheme] = useState<"light" | "dark">(scheme || "light");

  const colors = useMemo(() => {
    return theme === "dark" ? darkMode : lightMode;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ColorContext.Provider value={{ colors, theme, toggleTheme }}>
      {children}
    </ColorContext.Provider>
  );
};
