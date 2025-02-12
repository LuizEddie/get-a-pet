import { Link } from 'react-router-dom';
import styles from '../../form/Form.module.css';
import Input from '../../form/Input';
import { useContext, useState } from 'react';
import { Context } from '../../../context/UserContext';

export default function Login(){

    const [user, setUser] = useState({});
    const {login} = useContext(Context);

    function handleChange(e){
        setUser(p => ({...p, [e.target.name]: e.target.value}));
    }

    function handleSubmit(e){
        e.preventDefault();
        login(user);
    }

    return (
        <section className={styles.form_container}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <Input
                    text='E-mail'
                    type='email'
                    name='email'
                    placeholder='Digite o seu e-mail'
                    handleOnChange={handleChange}
                    required
                ></Input>
                <Input
                    text='Senha'
                    type='password'
                    name='password'
                    placeholder='Digite a sua senha'
                    handleOnChange={handleChange}
                    required
                ></Input>
                <input type="submit" value="Entrar" />
            </form>
            <p>
                Não tem conta? <Link to='/register'>Clique Aqui</Link>
            </p>
        </section>
    )
}