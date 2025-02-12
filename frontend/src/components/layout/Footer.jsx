import styles from './Footer.module.css';

export default function Footer(){
    
    return (
        <footer className={styles.footer}>
            <p><span className="bold">Get A Pet</span> &copy; {new Date().getFullYear()}</p>
        </footer>
    )
}