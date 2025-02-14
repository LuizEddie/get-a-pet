import formStyles from '../../form/Form.module.css';
import styles from './Profile.module.css';
import Input from '../../form/Input';
import { useEffect, useState } from 'react';

import api from '../../../utils/api';
import useFlashMessage from '../../../hooks/useFlashMessage';
import If from '../../layout/If';
import RoundedImage from '../../layout/RoundedImage';

export default function Profile() {
    const [user, setUser] = useState({});
    const [preview, setPreview] = useState('');
    const [token] = useState(localStorage.getItem('token') || '');
    const {setFlashMessage} = useFlashMessage();

    function onFileChange(e) {
        setPreview(e.target.files[0]);
        setUser(p => ({...p, [e.target.name]: e.target.files[0]}));
    }

    function handleChange(e) {
        setUser(p => ({...p, [e.target.name]: e.target.value}));
    }

    async function handleSubmit(e){
        e.preventDefault();

        let msgType = 'success';
        let msg = '';

        const formData = new FormData();

        await Object.keys(user).forEach(key => formData.append(key, user[key]))

        const data = await api.patch(`/users/edit/${user._id}`, formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then((response)=>{
            msg = response.data.message;
        }).catch(e => {
            msgType = 'error';
            msg = e.response.data.message.join(' | ')
        });

        setFlashMessage(msg, msgType);
    }

    useEffect(()=>{
        api.get('/users/checkuser', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}` 
            }
        }).then((response) => setUser(response.data));
    }, [token]);

    return (
        <section>
            <div className={styles.profile_header}>
                <h1>Perfil</h1>
                <If condition={user.image || preview}>
                    <RoundedImage src={preview ? URL.createObjectURL(preview) : `${import.meta.env.VITE_APP_API}images/users/${user.image}`} alt={user.name} />
                </If>
            </div>
            <div className={formStyles.form_container}>
                <form onSubmit={handleSubmit}>
                    <Input
                        text="Imagem"
                        type="file"
                        name="image"
                        handleOnChange={onFileChange}
                    ></Input>
                    <Input
                        text={"E-mail"}
                        type="email"
                        name="email"
                        placeholder={"Digite o seu e-mail"}
                        handleOnChange={handleChange}
                        value={user.email || ''}
                    ></Input>
                    <Input
                        text={"Nome"}
                        type="text"
                        name="name"
                        placeholder={"Digite o seu nome"}
                        handleOnChange={handleChange}
                        value={user.name || ''}
                    ></Input>
                    <Input
                        text={"Telefone"}
                        type="text"
                        name="phone"
                        placeholder={"Digite o seu telefone"}
                        handleOnChange={handleChange}
                        value={user.phone || ''}
                    ></Input>
                    <Input
                        text={"Senha"}
                        type="password"
                        name="password"
                        placeholder={"Digite a nova senha"}
                        handleOnChange={handleChange}
                    ></Input>
                    <Input
                        text={"Confirmação de Senha"}
                        type="passoword"
                        name="confirmpassword"
                        placeholder={"Digite a confirmação da nova senha"}
                        handleOnChange={handleChange}
                    ></Input>
                    <input type="submit" value={'Salvar'} />
                </form>
            </div>
        </section>
    )
}