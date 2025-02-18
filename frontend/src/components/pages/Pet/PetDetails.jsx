import styles from './PetDetails.module.css';
import api from '../../../utils/api';
import {useState, useEffect} from 'react';
import {useParams, Link} from 'react-router-dom';
import useFlashMessage from '../../../hooks/useFlashMessage';
import If from '../../layout/If';

export default function PetDetails(){
    const [pet, setPet] = useState({});
    const {id} = useParams();
    const {setFlashMessage} = useFlashMessage();
    const [token] = useState(localStorage.getItem('token') || '');

    useEffect(()=>{
        api.get(`pets/${id}`).then((response) => {
            setPet(response.data.pet);
        });
    },[id]);

    return (
        <>
            <If condition={pet.name}>
                <section className={styles.pet_details_container}>
                    <div className={styles.pet_details_header}>
                        <h1>Conhecendo o Pet {pet.name}</h1>
                        <p>Se tiver interesse, marque uma visita para conhecê-lo!</p>
                    </div>
                    <div className={styles.pet_images}>
                        {
                            pet?.images?.map((item, idx) => (
                                <img src={`${import.meta.env.VITE_APP_API}images/pets/${item}`} alt={`${pet.name}_${idx}`} key={idx}/>
                            ))
                        }
                    </div>
                    <p>
                        <span className='bold'>Peso:</span> {pet.weight}kg
                    </p>
                    <p>
                        <span className='bold'>Idade: </span> {pet.age} anos
                    </p>
                    <If condition={!token}>
                        <p>Você precisa <Link to='/register'>criar uma conta</Link> ou <Link to='/login'>estar logado</Link> para solicitar uma visita</p>
                    </If>
                    <If condition={token}>
                        <button>Solicitar uma visita</button>
                    </If>
                </section>
            </If>
        </>
    )
}