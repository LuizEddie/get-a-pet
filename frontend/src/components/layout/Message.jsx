import { useEffect, useState } from 'react';
import bus from '../../utils/bus';
import styles from './Message.module.css';
import If from './If';

export default function Message() {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState("");

    useEffect(()=>{
        bus.addListener('flash', ({message, type}) => {
            setVisible(true);
            setMessage(message);
            setType(type);

            setTimeout(()=>{
                setVisible(false);
            }, 3000);
        })
    },[]);

    return (
        <If condition={visible}>
            <div className={`${styles.message} ${styles[type]}`}>
                {message}
            </div>
        </If>
    )
}