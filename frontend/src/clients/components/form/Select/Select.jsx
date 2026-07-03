import styles from "./Select.module.css";

/**
 * Componente de Select reutilizável com Label integrado
 *
 * @component
 * @param {object} props
 * @param {string} props.text - O texto do label
 * @param {string} props.name - O atributo name e id do input
 * @param {array} props.options - As opções do select
 * @param {(event: React.ChangeEvent<HTMLSelectElement>) => void} props.handleOnChange - O atributo que evoca a função de atualizar o estado do value
 * @param {string|number} props.value - O valor atual do campo (controlado)
 * @returns {JSX.Element}
 */
export default function Select({ text, name, options, handleOnChange, value }) {
  return (
    <div className={styles.form_control}>

      <select
        id={name}
        name={name}
        onChange={handleOnChange}
        value={value || ""}
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
