import styles from './Select.module.css';

export default function Select({
  text,
  name,
  options,
  handleOnChange,
  value,
}) {
  return (
    <div className={styles.form_control}>
      <label htmlFor={name}>{text}</label>
      
      <select
        id={name}
        name={name}
        onChange={handleOnChange}
        value={value||''}
      >
        <option value="">Selecione uma opção</option>

        {options?.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}

      </select>
    </div>
  );
}