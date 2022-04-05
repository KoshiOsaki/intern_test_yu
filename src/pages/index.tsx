import { NextPage } from "next";
import axios from "axios";
import styles from "../styles/CssModules.module.scss";
import { useCallback, useEffect, useState } from "react";
import { PopulationList, Pref, YearValueData } from "../types/pref";
import { PrefChart } from "../components/PrefChart";
import { CheckBox } from "../components/CheckBox";
import { Meta } from "../components/Meta";

const Home: NextPage = () => {
  const [prefList, setPrefList] = useState<Pref[]>([]);
  const [populationList, setPopulationList] = useState<PopulationList[]>([]);
  console.log("最初");

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
            pref.prefCode = pref.prefCode - 1; //idを0からに統一
            _prefList.push(pref);
          });
          setPrefList(_prefList);
        });
    }
    console.log("prefリスト完成", prefList);
  }, []);

  //人口データリストの作成
  useEffect(() => {
    const defaultPopulationList: PopulationList[] = [];
    for (var i = 0; i < 47; i++) {
      if (prefList[i]) {
        //意味なし?
        defaultPopulationList.push({
          id: i,
          name: prefList[i].prefName,
          population: [],
          checked: false,
        });
      }
    }
    setPopulationList(defaultPopulationList);
    console.log("population完成",populationList);
  }, [prefList]);

  //チェック済の人口データを取得
  const fetchPopulation =  () => {
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
              populationList[i].population = [];
              res.data.result.data[0].data.forEach((yv: YearValueData) => {
                populationList[i].population.push(yv);
              });
            });
        } else {
          populationList[i].population = [];
        }
      }
    }
  }

  const handleChange = (id: any) => {
    const newPopulationList = [...populationList];
    newPopulationList[id].checked = !newPopulationList[id].checked; //マシな書き方は？
    setPopulationList(newPopulationList);
  }

  return (
    <>
      <Meta />
      <div className={styles.container}>
        <h1 className={styles.title}>都道府県の総人口推移</h1>
        <div className={styles.checkwrap}>
          {populationList.map((p) => (
            <div  key={p.id} className={styles.checklist}>
              <label style={{ display: "inline" }}>
                <CheckBox
                  id={p.id}
                  value={p.name}
                  handleChange={handleChange}
                  checked={p.checked}
                  fetchPopulation={fetchPopulation}
                />
                {p.name}
              </label>
            </div>
          ))}
        </div>
        <PrefChart populationList={populationList} />
      </div>
    </>
  );
};

export default Home;
