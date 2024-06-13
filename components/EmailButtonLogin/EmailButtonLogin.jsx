import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import styles from './EmailButtonLogin.module.css';
import { MdOutlineEmail } from "react-icons/md";


export default function EmailButtonLogin({ onClick, botaoEmailClicado }) {

    return (
        <button style={botaoEmailClicado ? {display: 'none'} : {}} onClick={onClick}className={styles.googleButton}><MdOutlineEmail style={{ width: 30, height: 30}}/>Fazer log-in com endereço de e-mail</button>
    )
}