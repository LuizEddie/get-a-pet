import { useEffect, useState } from "react";
import If from "../../layout/If";
import { Link } from "react-router-dom";
import useFlashMessage from '../../../hooks/useFlashMessage';
import api from '../../../utils/api';
import RoundedImage from "../../layout/RoundedImage";

import styles from './Dashboard.module.css';

export default function MyPets() {

    const [pets, setPets] = useState([]);
    const [token] = useState(localStorage.getItem('token') || '');
    const { setFlashMessage } = useFlashMessage();

    async function removePet(id){
        let msgType = 'success';
        let msg = '';
        const data = await api.delete(`/pets/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then(response => {
            const updatedPets = pets.filter(pet => pet._id !== id);
            setPets(updatedPets); 
            msg = response.data.message;
        }).catch(e => {
            msgType = 'error';
            msg = e.response.data.message.join(' | ');
        });

        setFlashMessage(msg, msgType);
    }

    useEffect(() => {
        api.get(`/pets/mypets`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then(response => setPets(response.data.pets))
    }, [token]);

    return (
        <section>
            <div className={styles.petlist_header}>
                <h1>Meus Pets</h1>
                <Link to="/pet/add">Cadastrar Pet</Link>
            </div>
            <div className={styles.petlist_container}>
                <If condition={pets.length === 0}>
                    <p>Não há pets cadastrados</p>
                </If>
                <If condition={pets.length > 0}>
                    {
                        pets.map((item, idx) => (
                            <div key={item._id} className={styles.petlist_row}>
                                <RoundedImage
                                    src={`${import.meta.env.VITE_APP_API}images/pets/${item.images[0]}`}
                                    alt={item.name}
                                    width={"px75"}
                                ></RoundedImage>
                                <span className="bold">{item.name}</span>
                                <div className={styles.actions}>
                                    <If condition={item.available}>
                                        <If condition={pets.adopter}>
                                            <button className={styles.conclude_btn}>Concluir Adoção</button>
                                        </If>
                                        <Link to={`/pet/edit/${item._id}`}>Editar</Link>
                                        <button onClick={()=>removePet(item._id)}>Excluir</button>
                                    </If>
                                    <If condition={!item.available}>
                                        <p>Pet já adotado</p>
                                    </If>
                                </div>
                            </div>
                        ))
                    }
                </If>
            </div>
        </section>
    );
}