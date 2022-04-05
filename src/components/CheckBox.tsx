export const CheckBox = ({
  id,
  value,
  handleChange,
  checked,
  fetchPopulation,
}: any) => {
  return (
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={() => {
        handleChange(id);
        fetchPopulation();
      }}
      value={value}
    />
  );
};
