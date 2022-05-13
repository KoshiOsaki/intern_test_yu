import axios from "axios";
import { Pref } from "../types/pref";

export const useFetchPrefData = async () => {
  const prefList: Pref[] = [];
  const headers = { "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY as string };
  const result = await axios.get(
    "https://opendata.resas-portal.go.jp/api/v1/prefectures",
    {
      headers: headers,
    }
  );
  const data = result.data.result;
  data.forEach((pref: Pref) => {
    pref.prefCode = pref.prefCode - 1; //idを0からに統一
    prefList.push(pref);
  });
  return { prefList };
};

export const fetchPopulationData = async (id: number) => {
  const headers = {
    "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY as string,
  };
  const _populationList = [...populationList];
  if (_populationList[id].checked) {
    const result = await axios.get(
      `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${
        id + 1
      }`,
      {
        headers: headers,
      }
    );
    _populationList[id].population = [];
    result.data.result.data[0].data.forEach((yv: YearValueData) => {
      _populationList[id].population.push(yv);
    });
  }
  setPopulationList(_populationList);
};

const handleChange = () => {
  const _populationList = [...populationList];
  _populationList[id].checked = !_populationList[id].checked;
  setPopulationList(_populationList);
};
