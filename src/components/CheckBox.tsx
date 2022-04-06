import { memo } from "react";

export const CheckBox = memo(function CheckBox({
  id,
  value,
  handleChange,
  checked,
  fetchPopulation,
}: any) {

  return (
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={() => {
        handleChange();
        fetchPopulation();
      }}
      value={value}
      style={{ display: "inline" }}
    />
  );
});
