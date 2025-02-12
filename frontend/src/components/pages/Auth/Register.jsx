import Input from "../../form/Input";
import styles from '../../form/Form.module.css';
import { Link } from 'react-router-dom';
import { useContext, useState } from "react";

import {Context} from '../../../context/UserContext';

export default function Register(){

    const [user, setUser] = useState({});
    const {register} = useContext(Context);

    function handleChange(e){
        setUser(p => ({...p, [e.target.name]: e.target.value}));
    }

    function handleSubmit(e){
        e.preventDefault();

        register(user);
    }

    return (
        <section className={styles.form_container}>
            <h1>Registrar</h1>
            <form onSubmit={handleSubmit}>
                <Input text={"Nome"} type={"text"} name={"name"} placeholder={"Digite o seu nome"} handleOnChange={handleChange}></Input>
                <Input text={"Telefone"} type={"text"} name={"phone"} placeholder={"Digite o seu telefone"} handleOnChange={handleChange}></Input>
                <Input text={"E-mail"} type={"email"} name={"email"} placeholder={"Digite o seu email"} handleOnChange={handleChange}></Input>
                <Input text={"Senha"} type={"password"} name={"password"} placeholder={"Digite a sua senha"} handleOnChange={handleChange}></Input>
                <Input text={"Confirmação de Senha"} type={"password"} name={"confirmpassword"} placeholder={"Digite a confirmação da sua senha"} handleOnChange={handleChange}></Input>
                <input type="submit" value="Cadastrar" />
            </form>
            <p>
                Já tem conta? <Link to="/login">Clique aqui</Link>
            </p>
        </section>
    )
}