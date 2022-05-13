import axios from "axios";
import { memo, useContext } from "react";
import styles from "../styles/CssModules.module.scss";
import { PopulationContext } from "../providers/PopulationProvider";
import { YearValueData } from "../types/pref";

interface Props {
  id: number;
}

export const CheckBox = memo(function CheckBox({ id }: Props) {
  const { populationList, setPopulationList } = useContext(PopulationContext);

  //チェック済の人口データを取得する関数
  const fetchPopulation = async () => {
    try {
      const headers = {
        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY as string,
      };
      const _populationList = [...populationList];
      if (_populationList[id].checked) {
        const result = await axios.get(
          `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${
            id + 1
          }`,
          {
            headers: headers,
          }
        );
        _populationList[id].population = [];
        result.data.result.data[0].data.forEach((yv: YearValueData) => {
          _populationList[id].population.push(yv);
        });
      }
      setPopulationList(_populationList);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = () => {
    const _populationList = [...populationList];
    _populationList[id].checked = !_populationList[id].checked;
    setPopulationList(_populationList);
  };

  return (
    <div
      key={id}
      className={styles.checklist}
      onClick={() => {
        handleChange();
        fetchPopulation();
      }}
    >
      <input
        id={`${id}`}
        type="checkbox"
        checked={populationList[id].checked}
        value={populationList[id].name}
        className={styles.input}
        onChange={() => {}}
      />
      <p className={styles.label}>{populationList[id].name}</p>
    </div>
  );
});
