import "chart.js/auto";
import { ChartData } from "chart.js";
import { memo, useContext, useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";
import { Datasets, PopulationList, YearValueData } from "../types/pref";
import styles from "../styles/CssModules.module.scss";
import { PopulationContext } from "../providers/PopulationProvider";

export const PrefChart = memo(function PrefChart() {
  const { populationList, setPopulationList } = useContext(PopulationContext);
  const [labels, setLabels] = useState<number[]>([]);
  const [dataSets, setDataSets] = useState<Datasets[]>([]);
  // const [checkedPopulationList, setCheckedPopulationList] = useState<
  //   PopulationList[]
  // >([]);

  // console.log("チャート");
  //ラベルの設定
  // useEffect(() => {
  //   const _labels: any[] = [];
  //   if (populationList[0] !== undefined) {
  //     populationList[0].population.forEach((yv: YearValueData) => {
  //       _labels.push(yv.year);
  //     });
  //   }
  //   setLabels(_labels);
  //   console.log("ラベル",labels);
  // }, [populationList]);

  //取得済のグラフのデータをセット
  // useEffect(() => {
  //   const _checkedPopulationList = populationList.filter((e) => {
  //     return e.checked === true;
  //   });
  //   console.log("checked:", _checkedPopulationList);
  //   setCheckedPopulationList(_checkedPopulationList);
  // }, [populationList]);

  const makeData = () => {
    const checkedPopulationList = populationList.filter((e: PopulationList) => {
      return e.checked === true;
    });

    //ラベルの設定
    const _labels: any[] = [];
    if (checkedPopulationList[0] !== undefined) {
      checkedPopulationList[0].population.forEach((yv: YearValueData) => {
        _labels.push(yv.year);
      });
    }
    

    setLabels(_labels);
    console.log("ラベル", labels);

    const _dataSets: Datasets[] = [];

    //データセット
    checkedPopulationList.forEach((c: PopulationList) => {
      const valueList: number[] = [];
      console.log("value入れるよ", c.population);

      c.population.forEach((yv: YearValueData) => {
        valueList.push(yv.value);
      });
      console.log("valueある？", valueList);

      const dataSet: Datasets = {
        label: c.name,
        data: valueList,
        pointHoverRadius: 12,
        tension: 0.2,
      };
      // console.log(valueList);
      _dataSets.push(dataSet);
    });

    // console.log("dataSets:", _dataSets);
    setDataSets(_dataSets);
  };
  useEffect(makeData, [populationList]);


  const data: ChartData = {
    labels: labels,
    datasets: dataSets,
  };

  return (
    <div
      className={styles.chart}
      style={{ marginTop: "40px", padding: "20px" }}
    >
      <Chart type="line" data={data} color="black" />
    </div>
  );
});
