import styles from "./Select.module.css";

export default function Select({ text, name, options, handleOnChange, value }) {
  return (
    <div className={styles.form_control}>
      {text && <label htmlFor={name}>{text}</label>}

      <select
        id={name}
        name={name}
        onChange={handleOnChange}
        value={value || ""}
      >
        <option value="">Selecione uma opção</option>

        {options?.map((option, index) => {
          const isObj = option && typeof option === "object";
          const optionId = isObj ? option.id : option;
          const optionName = isObj ? option.label || option.name : option;

          return (
            <option key={isObj ? optionId : index} value={optionId}>
              {optionName}
            </option>
          );
        })}
      </select>
    </div>
  );
}
