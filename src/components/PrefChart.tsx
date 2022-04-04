import "chart.js/auto";
import { ChartData, ChartDataset } from "chart.js";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { Chart } from "react-chartjs-2";
import { Datasets } from "../types/pref";

export const PrefChart = ({ populationList }: any) => {
  const [labels, setLabels] = useState<any[]>([]);
  const [prefData, setPrefData] = useState<any[]>([]);

  useEffect(() => {
    const _prefData: Datasets[] = [
      {
        label: "",
        data: [],
        pointHoverRadius: 12,
        tension: 0.2,
      },
    ];
    if (populationList[0] !== undefined) {
      _prefData[0].label = populationList[0].name;
      populationList[0].population.forEach((data: any) => {
        _prefData[0].data.push(data.value);
      });
    }
    setPrefData(_prefData);
  }, [populationList]);

  
  useEffect(() => {
    const _labels: any[] = [];
    if (populationList[0] !== undefined) {
      populationList[0].population.forEach((data: any) => {
        _labels.push(data.year);
      });
    }
    setLabels(_labels);
  }, [populationList]);

  const data: ChartData = {
    labels: labels,
    datasets: prefData,
  };

  return (
    <div>
      <Chart type="line" data={data} />
    </div>
  );
};
