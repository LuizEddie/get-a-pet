import styles from './RoundedImage.module.css';

export default function RoundedImage({src, alt, width}){

    return (
        <img src={src} alt={alt} className={`${styles.rounded_image} ${styles[width]}`}/>
    )
}