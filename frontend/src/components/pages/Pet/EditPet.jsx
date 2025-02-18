import { useEffect, useState } from 'react';
import useFlashMessage from '../../../hooks/useFlashMessage';
import api from '../../../utils/api';
import styles from './AddPet.module.css';
import {useParams} from 'react-router-dom';
import If from '../../layout/If';
import PetForm from '../../form/PetForm';

export default function EditPet({}){
    const [pet, setPet] = useState({});
    const [token] = useState(localStorage.getItem('token') || '');
    const {id} = useParams();
    const {setFlashMessage} = useFlashMessage();

    async function handleSubmit(pet){
        let msgType = 'success';
        let msg = '';
        const formData = new FormData();

        await Object.keys(pet).forEach(key => {
            if(key === 'images'){
                for(let i = 0; i < pet[key].length; i++){
                    formData.append('images', pet[key][i]);
                }
            }else{
                formData.append(key, pet[key]);
            }
        });

        const dataReturn = await api.patch(`pets/${pet._id}`, formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            msg = response.data.message;
        }).catch(e => {
            msgType = 'error';
            msg = e.response.data.message.join(' | ')
        });

        setFlashMessage(msg, msgType);
    }

    useEffect(()=>{
        api.get(`/pets/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            setPet(response.data.pet);
        });
    }, [token, id]);

    return (
        <section>
            <div className={styles.addpet_header}>
                <h1>Editando o Pet: {pet.name}</h1>
                <p>Após a edição os dados serão atualizados no sistema!</p>
            </div>
            <If condition={pet.name}>
                <PetForm handleSubmit={handleSubmit} btnText={'Atualizar'} petData={pet}></PetForm>            
            </If>
        </section>
    )
}