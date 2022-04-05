import "chart.js/auto";
import { ChartData } from "chart.js";
import { memo, useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";
import { Datasets, PopulationList, YearValueData } from "../types/pref";
import styles from "../styles/CssModules.module.scss";

export const PrefChart = memo(
  ({ populationList }: { populationList: PopulationList[] }) => {
    const [labels, setLabels] = useState<number[]>([]);
    const [dataSets, setDataSets] = useState<Datasets[]>([]);
    
    console.log("チャート");
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
    useEffect(() => {
      const checkedPopulationList = populationList.filter((e) => {
        return e.checked === true;
      });
      console.log("checked:", checkedPopulationList);
      
      //ラベルの設定
      const _labels: any[] = [];
      if (checkedPopulationList[0] !== undefined) {
        checkedPopulationList[0].population.forEach((yv: YearValueData) => {
          _labels.push(yv.year);
        });
      }
      setLabels(_labels);
      console.log("ラベル",labels);

      const _dataSets: Datasets[] = [];

      checkedPopulationList.forEach((p: PopulationList) => {
        const valueList: number[] = [];
        p.population.forEach((yv: YearValueData) => {
          valueList.push(yv.value);
        });
        const dataSet: Datasets = {
          label: p.name,
          data: valueList,
          pointHoverRadius: 12,
          tension: 0.2,
        };
        _dataSets.push(dataSet);
      });
      setDataSets(_dataSets);
      console.log("dataSets:", dataSets);
    }, [populationList]);


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
  }
);
