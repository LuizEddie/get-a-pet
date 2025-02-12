import api from '../utils/api';

import {useState, useEffect} from 'react';
import useFlashMessage from './useFlashMessage';
import { useNavigate } from 'react-router-dom';

export default function useAuth(){
    const [authenticated, setAuthenticated] = useState(false);
    const {setFlashMessage} = useFlashMessage();
    const navigate = useNavigate();

    useEffect(()=>{

        const token = localStorage.getItem('token');

        if(token){
            api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
            setAuthenticated(true);
        }

    }, []);

    async function register(user){

        let msg = 'Cadastro realizado com sucesso!';
        let type = 'success';

        try{
            const data = await api.post('/users/register', user)
            .then(resp => resp.data);

            await authUser(data);
        }catch(e){
            msg = e.response.data.message.join(' | ');
            type = 'error';
        }

        setFlashMessage(msg, type);
    }

    async function authUser(data){
        setAuthenticated(true);
        localStorage.setItem('token', JSON.stringify(data.token));
        navigate('/');
    }

    async function logout(){
        const msg = 'Logou realizado com sucesso!';
        const msgType = 'success';

        setAuthenticated(false);
        localStorage.removeItem('token');
        api.defaults.headers.Authorization = undefined;
        navigate('/');

        setFlashMessage(msg, msgType);
    }

    async function login(user){
        let msg = 'Login realizado com sucesso!';
        let type = 'success';

        try{
            console.log(user);
            const data = await api.post('/users/login', user).then((response)=>{
                return response.data;
            });

            await authUser(data);
        }catch(e){
            msg = e.response.data.message.join(' | ');
            type = 'error';
        }

        setFlashMessage(msg, type);
    }

    return { register, authenticated, logout, login }

}