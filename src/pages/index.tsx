import { NextPage } from "next";
import axios from "axios";
import styles from "../styles/CssModules.module.scss";
import { useContext, useEffect, useState } from "react";
import { PopulationList, Pref, YearValueData } from "../types/pref";
import { PrefChart } from "../components/PrefChart";
import { CheckBox } from "../components/CheckBox";
import { Meta } from "../components/Meta";
import { PopulationContext } from "../providers/PopulationProvider";

const Home: NextPage = () => {
  const [prefList, setPrefList] = useState<Pref[]>([]);
  const { populationList, setPopulationList } = useContext(PopulationContext);

  // 都道府県リストの作成
  useEffect(() => {
    console.log("都道府県");
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
  }, []);

  //人口データリストの作成
  useEffect(() => {
    console.log("人口リスト");
    const defaultPopulationList: PopulationList[] = [];
    if (prefList[0]) {
      for (var i = 0; i < 47; i++) {
        defaultPopulationList.push({
          id: i,
          name: prefList[i].prefName,
          population: [],
          checked: false,
        });
      }
    }
    setPopulationList(defaultPopulationList);
  }, [prefList]);

  //チェック済の人口データを取得する関数
  const fetchPopulation = () => {
    if (process.env.NEXT_PUBLIC_API_KEY) {
      const headers = { "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY };
      const _populationList = [...populationList];
      for (var i = 0; i < 47; i++) {
        if (_populationList[i].checked) {
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
              _populationList[i].population = [];
              res.data.result.data[0].data.forEach((yv: YearValueData) => {
                _populationList[i].population.push(yv);
              });
            });
        } else {
          _populationList[i].population = [];
        }
      }
      setPopulationList(_populationList);
    }
  };

  const handleChange = (id: number) => {
    const newPopulationList = [...populationList];
    newPopulationList[id].checked = !newPopulationList[id].checked; //マシな書き方は？
    setPopulationList(newPopulationList);
  };

  const onClickReset = () => {
    console.log("リセット");
    const _populationList: PopulationList[] = [];
    populationList.map((p: PopulationList) => {
      p.checked = false;
      _populationList.push(p);
    });
    setPopulationList(_populationList);
  };

  return (
    <>
      <Meta />
      <div className={styles.container}>
        <div className={styles.mainbox}>
          <h1 className={styles.title}>都道府県の総人口推移</h1>
          <div className={styles.checkwrap}>
            {populationList.map((p: PopulationList) => (
              <div key={p.id} className={styles.checklist}>
                <label style={{ display: "inline" }}>
                  <CheckBox
                    id={p.id}
                    value={p.name}
                    handleChange={() => handleChange(p.id)}
                    checked={p.checked}
                    fetchPopulation={fetchPopulation}
                  />
                  {p.name}
                </label>
              </div>
            ))}
            <button className={styles.checklist} onClick={onClickReset}>
              選択をリセット
            </button>
          </div>
          <PrefChart />
        </div>
      </div>
    </>
  );
};

export default Home;
