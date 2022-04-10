import { NextPage } from "next";
import axios from "axios";
import styles from "../styles/CssModules.module.scss";
import { useContext, useEffect } from "react";
import { Population, Pref } from "../types/pref";
import { PrefChart } from "../components/PrefChart";
import { CheckBox } from "../components/CheckBox";
import { Meta } from "../components/Meta";
import { PopulationContext } from "../providers/PopulationProvider";

export const getStaticProps = async () => {
  try {
    //　都道府県リストの作成
    const prefList: Pref[] = [];
    if (process.env.NEXT_PUBLIC_API_KEY) {
      const headers = { "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY };
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
    }

    // 空の人口データリストの作成
    const defaultPopulationList: Population[] = [];
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
    return {
      props: {
        prefList: prefList,
        defaultPopulationList: defaultPopulationList,
      },
    };
  } catch (error) {
    console.log(error);
  }
};

interface Props {
  defaultPopulationList: Population[];
}

const Home: NextPage<Props> = ({ defaultPopulationList }: Props) => {
  const { populationList, setPopulationList } = useContext(PopulationContext);

  useEffect(() => {
    setPopulationList(defaultPopulationList);
  }, []);

  const onClickReset = () => {
    const _populationList: Population[] = [];
    populationList.map((p: Population) => {
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
            {populationList.map((p: Population) => (
              <CheckBox id={p.id} key={p.id}/>
            ))}
            <button className={styles.button} onClick={onClickReset}>
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
