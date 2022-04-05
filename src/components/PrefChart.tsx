import "chart.js/auto";
import { ChartData } from "chart.js";
import { useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";
import { Datasets, PopulationList, YVData } from "../types/pref";

export const PrefChart = ({
  populationList,
}: {
  populationList: PopulationList[];
}) => {
  const [labels, setLabels] = useState<any[]>([]);
  const [dataSets, setDataSets] = useState<Datasets[]>([]);

  //ラベルの設定
  useEffect(() => {
    const _labels: any[] = [];
    if (populationList[0] !== undefined) {
      populationList[0].population.forEach((data: any) => {
        _labels.push(data.year);
      });
    }
    setLabels(_labels);
  }, [populationList]);

  //取得済のグラフのデータをセット
  useEffect(() => {
    const checkedPopulationList = populationList.filter((e) => {
      return e.checked === true;
    });
    const _dataSets: Datasets[] = [];
    
    checkedPopulationList.forEach((p: PopulationList) => {
      const valueList: number[] = [];
      p.population.forEach((yv: YVData) => {
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
    console.log(dataSets);
  }, [populationList]);

  const data: ChartData = {
    labels: labels,
    datasets: dataSets,
  };

  return (
    <div>
      <Chart type="line" data={data} />
    </div>
  );
};
