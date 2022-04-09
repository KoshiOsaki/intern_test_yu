import "chart.js/auto";
import { ChartData } from "chart.js";
import { memo, useContext, useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";
import { Datasets, Population, YearValueData } from "../types/pref";
import styles from "../styles/CssModules.module.scss";
import { PopulationContext } from "../providers/PopulationProvider";

export const PrefChart = memo(function PrefChart() {
  const { populationList } = useContext(PopulationContext);
  const [labels, setLabels] = useState<number[]>([]);
  const [dataSets, setDataSets] = useState<Datasets[]>([]);

  const colorList = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
  ];
  const bgColorList = [
    "rgba(255, 99, 132, 100)",
    "rgba(54, 162, 235, 100)",
    "rgba(255, 206, 86, 100)",
    "rgba(75, 192, 192, 100)",
    "rgba(153, 102, 255, 100)",
    "rgba(255, 159, 64, 100)",
  ];

  useEffect(() => {
    const checkedPopulationList = populationList.filter((e: Population) => {
      return e.checked === true;
    });

    //ラベルの設定
    const _labels: number[] = [];
    if (checkedPopulationList[0] !== undefined) {
      checkedPopulationList[0].population.forEach((yv: YearValueData) => {
        _labels.push(yv.year);
      });
    }
    setLabels(_labels);

    //描画用のデータをセット
    const _dataSets: Datasets[] = [];
    checkedPopulationList.forEach((checked: Population, index: number) => {
      const valueList: number[] = [];
      checked.population.forEach((yv: YearValueData) => {
        valueList.push(yv.value);
      });
      const dataSet: Datasets = {
        label: checked.name,
        data: valueList,
        pointHoverRadius: 12,
        tension: 0.2,
        borderColor: colorList[index % 6],
        backgroundColor: bgColorList[index % 6],
      };
      _dataSets.push(dataSet);
    });
    setDataSets(_dataSets);
  }, [populationList]);

  const data: ChartData = {
    labels: labels,
    datasets: dataSets,
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "年度",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "人口",
        },
      },
    },
  };

  return (
    <div
      className={styles.chart}
      style={{ marginTop: "40px", padding: "20px" }}
    >
      <Chart type="line" data={data} color="black" options={options} />
    </div>
  );
});
