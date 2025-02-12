import { Link } from "react-router-dom";
import Logo from '../../assets/img/logo.png';
import styles from './Navbar.module.css';
import { useContext } from "react";
import { Context } from "../../context/UserContext";
import If from './If';

export default function NavBar() {

    const { authenticated, logout } = useContext(Context);

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbar_logo}>
                <img src={Logo} alt="Get a Pet" />
                <h2>Get A Pet</h2>
            </div>
            <ul>
                <li>
                    <Link to="/">Adotar</Link>
                </li>
                <If condition={authenticated}>
                    <li>
                        <Link to="/user/profile">Perfil</Link>
                    </li>
                    <li onClick={logout}>Sair</li>
                </If>
                <If condition={!authenticated}>
                    <li>
                        <Link to="/login">Entrar</Link>
                    </li>
                    <li>
                        <Link to="/register">Cadastrar</Link>
                    </li>
                </If>
            </ul>
        </nav>
    )
}