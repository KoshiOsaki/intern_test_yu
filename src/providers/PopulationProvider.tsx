import { createContext, useState } from "react";
import { PopulationList } from "../types/pref";
export const PopulationContext = createContext<any>({});

export const PopulationProvider = (props: any) => {
  const { children } = props;
  const [populationList, setPopulationList] = useState<PopulationList[]>([]);

  return (
    <PopulationContext.Provider value={{ populationList, setPopulationList }}>
      {children}
    </PopulationContext.Provider>
  );
};
