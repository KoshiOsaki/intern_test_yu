import { NextPage } from "next";
import axios from "axios";
import { useEffect, useState } from "react";
import { PopulationList, Pref, YVData } from "../types/pref";
import { PrefChart } from "../components/PrefChart";
import { CheckBox } from "../components/CheckBox";

const Home: NextPage = () => {
  const [prefList, setPrefList] = useState<Pref[]>([]);
  const [populationList, setPopulationList] = useState<PopulationList[]>([]);

  //都道府県リストの作成
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
            pref.prefCode = pref.prefCode - 1;          //idを0からに統一
            _prefList.push(pref);
          });
          setPrefList(_prefList);
        });
    }
  }, []);

  //人口データリストの作成
  useEffect(() => {
    const defaultPopulationList: PopulationList[] = [];
    for (var i = 0; i < 47; i++) {
      if (prefList[i]) {        //意味なし
        defaultPopulationList.push({
          id: i,
          name: prefList[i].prefName,
          population: [],
          checked: false,
        });
      }
    }
    setPopulationList(defaultPopulationList);
  }, []);

  //チェック済の人口データを取得
  const fetchPopulation = () => {
    if (process.env.NEXT_PUBLIC_API_KEY) {
      const headers = { "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY };
      for (var i = 0; i < 47; i++) {
        if (populationList[i].checked) {
          axios
            .get(
              `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${
                i + 1
              }`,
              {
                headers: headers,
              }
            )
            .then((res) => {
              populationList[i].population=[]
              res.data.result.data[0].data.forEach((p: YVData) => {
                populationList[i].population.push(p);
              });
            });
        } else {
          populationList[i].population = [];
        }
      }
    }
  };


  const handleChange = (id: any) => {
    const newPopulationList = [...populationList];
    newPopulationList[id].checked = !newPopulationList[id].checked; //マシな書き方は？
    setPopulationList(newPopulationList);
  };

  return (
    <div>
      <h1>都道府県の総人口推移</h1>
      {populationList.map((p) => (
        <label key={p.id}>
          <CheckBox
            id={p.id}
            value={p.name}
            handleChange={handleChange}
            checked={p.checked}
            fetchPopulation={fetchPopulation}
          />
          {p.name}
        </label>
      ))}
      <PrefChart populationList={populationList} />
    </div>
  );
};

export default Home;
