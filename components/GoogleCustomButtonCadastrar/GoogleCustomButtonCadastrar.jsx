import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import styles from './GoogleCustomButtonCadastrar.module.css';


export default function GoogleCustomButtonCadastrar({ botaoEmailClicado }) {
    const router = useRouter();

    const googleCadastrar = useGoogleLogin({
        onSuccess: tokenResponse => {
            axios.post('http://localhost:8080/googleCadastrar', { tokenResponse })
            .then(response => {
                if (response.data == 'O endereço de e-mail dessa conta do Google já está vinculado a uma conta, faça log-in usando o modo de e-mail e senha padrão!') {
                    return;
                }else{
                    Cookies.set('askhub', response.data.token, { expires: 3650, secure: false });
                    return router.push(`profile/${response.data.nomeusuario}`)
                }
            });
        },
        onError: () => {
            console.log('Login Failed');
        }
    })

    return (
        <button style={botaoEmailClicado ? {display: 'none'} : {}} className={styles.googleButton} onClick={() => {googleCadastrar()}}><img style={{ height: 30, width: 30}} src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png" alt="" />Cadastrar usando sua conta do Google</button>
    )
}