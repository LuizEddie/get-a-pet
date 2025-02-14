import styles from './Select.module.css';

export default function Select({text, name, options, handleOnChange, value}){
    return (
        <div className={styles.form_control}>
            <label htmlFor={name}>{text}:</label>
            <select name={name} id={name} onChange={handleOnChange} value={value || ''}>
                <option value="">Selecione uma opção...</option>
                {options.map((item)=>(<option value={item} key={item}>{item}</option>))}
            </select>
        </div>
    )
}

