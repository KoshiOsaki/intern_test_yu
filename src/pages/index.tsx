import { NextPage } from "next";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pref } from "../types/pref";
import { PrefChart } from "../components/PrefChart";
import { CheckBox } from "../components/CheckBox";

const Home: NextPage = () => {
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
  const [prefList, setPrefList] = useState<Pref[]>([]);
  const [populationList, setPopulationList] = useState<any[]>([]);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_KEY) {
      var headers = { "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY };
      const _prefList: Pref[] = [];
      axios
        .get("https://opendata.resas-portal.go.jp/api/v1/prefectures", {
          headers: headers,
        })
        .then((res) => {
          res.data.result.forEach((pref: Pref) => {
            _prefList.push(pref);
          });
          setPrefList(_prefList);
        });
    }
  }, []);

  const fetchPopulation = (id: number) => {
    if (process.env.NEXT_PUBLIC_API_KEY) {
      const headers = { "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY };
      const newPopulationList: any = {
        name: "",
        population: [],
      };
      axios
        .get(
          `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${id}`,
          {
            headers: headers,
          }
        )
        .then((res) => {
          res.data.result.data[0].data.forEach((p: any) => {
            newPopulationList.name = prefList[id - 1].prefName;
            newPopulationList.population.push(p);
          });
          setPopulationList([...populationList, newPopulationList]);
        });
      console.log(populationList);
    }
  };
  const onChange = (id: any) => {
    const newItems = [...checkedItems];
    newItems[id] = !newItems[id];
    setCheckedItems(newItems);
  };

  return (
    <div>
      <h1>都道府県の総人口推移</h1>
      {prefList.map((item) => (
        <label key={item.prefCode}>
          <CheckBox
            id={item.prefCode}
            value={item.prefName}
            onChange={onChange}
            checked={false}
            checkedItems={checkedItems}
            fetchPopulation={fetchPopulation}
          />
          {item.prefName}
        </label>
      ))}
      <PrefChart populationList={populationList} />
    </div>
  );
};

export default Home;
