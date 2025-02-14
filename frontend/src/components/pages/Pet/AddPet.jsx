import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

import styles from './AddPet.module.css';
import useFlashMessage from '../../../hooks/useFlashMessage';
import PetForm from '../../form/PetForm';

export default function AddPet(){
    const navigate = useNavigate();
    const {setFlashMessage} = useFlashMessage();


    return (
        <section className={styles.addpet_header}>
            <div>
                <h1>Cadastre um Pet</h1>
                <p>Depois ele ficará disponível para adoção</p>
            </div>
            <PetForm btnText={'Cadastrar Pet'}></PetForm>
        </section>
    )
}