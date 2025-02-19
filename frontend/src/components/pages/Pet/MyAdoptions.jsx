import styles from './Dashboard.module.css';
import api from '../../../utils/api';
import { useEffect, useState } from 'react';
import If from '../../layout/If';
import RoundedImage from '../../layout/RoundedImage';
import { Link } from 'react-router-dom';

export default function MyAdoptions() {
    const [pets, setPets] = useState([]);
    const [token] = useState(localStorage.getItem('token') || '');

    useEffect(() => {
        api.get('/pets/myadoptions', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        })
            .then(resp => setPets(resp.data.pets));
    }, [token]);

    return (
        <section>
            <div className={styles.petlist_header}>
                <h1>Minhas Adoções</h1>
            </div>
            <div className={styles.petlist_container}>
                <If condition={pets.length > 0}>
                    {
                        pets.map(item => (
                            <div key={item._id} className={styles.petlist_row}>
                                <RoundedImage
                                    src={`${import.meta.env.VITE_APP_API}images/pets/${item.images[0]}`}
                                    alt={item.name}
                                    width={"px75"}
                                ></RoundedImage>
                                <span className="bold">{item.name}</span>
                                <div className={styles.contacts}>
                                    <p>
                                        <span className='bold'>Envie um e-mail para:</span> {item.user.email}
                                    </p>
                                    <p>
                                        <span className='bold'>Ligue para:</span> {item.user.phone}
                                    </p>
                                    <p>
                                        <span className='bold'>Fale com:</span> {item.user.name}
                                    </p>
                                </div>
                                <div className={styles.actions}>
                                    <If condition={item.available}>
                                        <p>Adoção em processo</p>
                                    </If>
                                    <If condition={!item.available}>
                                        <p>Parabéns por concluir a adoção</p>
                                    </If>
                                </div>
                            </div>
                        ))
                    }
                </If>
                <If condition={pets.length === 0}>
                    <p>Ainda não há adoções de pets.</p>
                </If>
            </div>
        </section>
    )
}