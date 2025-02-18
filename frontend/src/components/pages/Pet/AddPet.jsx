import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

import styles from './AddPet.module.css';
import useFlashMessage from '../../../hooks/useFlashMessage';
import PetForm from '../../form/PetForm';
import { useState } from 'react';

export default function AddPet() {
    const navigate = useNavigate();
    const { setFlashMessage } = useFlashMessage();
    const [token] = useState(localStorage.getItem('token') || '');

    async function registerPet(pet) {
        let msgType = 'success';
        let msg = '';
        const formData = new FormData();

        await Object.keys(pet).forEach((key) => {
            if (key === 'images') {
                for (let i = 0; i < pet[key].length; i++) {
                    formData.append('images', pet[key][i]);
                }
            } else {
                formData.append(key, pet[key]);
            }
        });

        const dataReturn = await api.post(`pets/create`, formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                msg = response.data.message;
            })
            .catch(e => {
                msgType = 'error';
                msg = e.response.data.message.join(' | ');
            });

        setFlashMessage(msg, msgType);

        if (msgType === 'success') {
            navigate('/pet/mypets');
        }
    }

    return (
        <section className={styles.addpet_header}>
            <div>
                <h1>Cadastre um Pet</h1>
                <p>Depois ele ficará disponível para adoção</p>
            </div>
            <PetForm btnText={'Cadastrar Pet'} handleSubmit={registerPet}></PetForm>
        </section>
    )
}