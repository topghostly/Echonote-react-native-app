import { View, Text } from "react-native";
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  Children,
  ReactNode,
} from "react";

interface utilType {
  isPlaying: boolean | null;
  updateIsPlaying: (value: boolean) => void;
}

interface providerType {
  children: ReactNode;
}
const UtilContext = createContext<utilType | any>(null);

export const useUtil = (): utilType => useContext(UtilContext);

export const UtilProvider: React.FC<providerType> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const updateIsPlaying = (value: boolean) => {
    setIsPlaying(value);
  };
  return (
    <UtilContext.Provider value={{ updateIsPlaying, isPlaying }}>
      {children}
    </UtilContext.Provider>
  );
};
