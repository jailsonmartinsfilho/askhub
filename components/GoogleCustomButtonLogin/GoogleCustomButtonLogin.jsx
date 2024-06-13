import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import styles from './GoogleCustomButtonLogin.module.css';


export default function GoogleCustomButtonLogin({ botaoEmailClicado }) {
    const router = useRouter();

    const googleLogar = useGoogleLogin({
        onSuccess: tokenResponse => {
            axios.post('http://localhost:8080/googleLogar', { tokenResponse })
            .then(response => {
                if (response.data == 'Nenhuma conta do AskHub está associada a essa conta do Google!') {
                    console.log(response.data);
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
        <button style={botaoEmailClicado ? {display: 'none'} : {}} className={styles.googleButton} onClick={() => {googleLogar()}}><img style={{ height: 30, width: 30}} src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png" alt="" />Fazer Log-in com sua conta do Google</button>
    )
}