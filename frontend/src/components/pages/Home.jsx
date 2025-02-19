import api from '../../utils/api';

import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';

import styles from './Home.module.css';
import If from '../layout/If';

export default function Home(){
    const [pets, setPets] = useState([]);

    useEffect(()=>{

        api.get('/pets').then(response => setPets(response.data.pets));

    }, []);

    return (
        <section>
            <div className={styles.pet_home_header}>
                <h1>Adote um Pet</h1>
                <p>Veja os detalhes de cada um e conheça o tutor deles</p>
            </div>
            <div className={styles.pet_container}>
                <If condition={pets.length > 0}>
                    {pets.map(item => (
                        <div className={styles.pet_card} key={item._id}>
                            <div style={{backgroundImage: `url(${import.meta.env.VITE_APP_API}/images/pets/${item.images[0]})`}} className={styles.pet_card_image}>

                            </div>
                            <h3>{item.name}</h3>
                            <p>
                                <span className="bold">Peso:</span> {item.weight}kg
                            </p>
                            <If condition={item.available}>
                                <Link to={`pet/${item._id}`}>Mais detalhes</Link>
                            </If>
                            <If condition={!item.available}>
                                <p className={styles.adopted_text}>Pet já adotado</p>
                            </If>
                        </div>
                    ))}
                </If>
                <If condition={pets.length === 0}>
                    <p>Não há pets disponíveis para adoção no momento</p>
                </If>
            </div>
        </section>
    );
}   