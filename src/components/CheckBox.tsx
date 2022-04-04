export const CheckBox = ({ id, value, onChange,checkedItems,fetchPopulation }: any) => {
    return (
      <input
        id={id}
        type="checkbox"
        checked={checkedItems[id]}
        onChange={() => {
          onChange(id);
          fetchPopulation(id);
        }}
        value={value}
      />
    );
  };