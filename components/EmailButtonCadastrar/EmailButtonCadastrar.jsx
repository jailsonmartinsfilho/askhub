import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import styles from './EmailButtonCadastrar.module.css';
import { MdOutlineEmail } from "react-icons/md";


export default function EmailButtonCadastrar({ onClick, botaoEmailClicado }) {

    return (
        <button style={botaoEmailClicado ? {display: 'none'} : {}} onClick={onClick}className={styles.googleButton}><MdOutlineEmail style={{ width: 30, height: 30}}/>Cadastrar usando seu e-mail e senha</button>
    )
}