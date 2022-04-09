import { createContext, FC, useState } from "react";
import { Population } from "../types/pref";
export const PopulationContext = createContext<any>({});

export const PopulationProvider: FC = ({ children }) => {
  const [populationList, setPopulationList] = useState<Population[]>([]);

  return (
    <PopulationContext.Provider value={{ populationList, setPopulationList }}>
      {children}
    </PopulationContext.Provider>
  );
};
