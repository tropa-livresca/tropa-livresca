import { useState } from "react";
import styles from "./Select.module.css";

export default function Select({
  text,
  name,
  options,
  handleOnChange,
  value,
  className,
  onToggle,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const definirAberto = (novoValor) => {
    setIsOpen(novoValor);
    onToggle?.(novoValor);
  };

  return (
    <div className={`${styles.form_control} ${className || ""}`}>
      {text && <label htmlFor={name}>{text}</label>}

      <select
        id={name}
        name={name}
        onMouseDown={() => definirAberto(!isOpen)}
        onChange={(e) => {
          definirAberto(false);
          handleOnChange?.(e);
        }}
        onBlur={() => definirAberto(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") definirAberto(false);
        }}
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