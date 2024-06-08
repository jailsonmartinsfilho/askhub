import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/login.module.css';
import ReCAPTCHA from 'react-google-recaptcha';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function Login() {
    const router = useRouter();

    useEffect(() => {
        const verificarToken = async () => {
            const token = Cookies.get('askhub');
            if (token) return router.push('/');
        };
        verificarToken();
    }, []);

    const [emailusuario, setEmailUsuario] = useState('');
    const [senhausuario, setSenhaUsuario] = useState('');
    const [mensagemErro, setMensagemErro] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState(null);

    const validarFormulario = ({ recaptchaToken }) => {
        if (!recaptchaToken) return setMensagemErro('Complete a verificação ReCaptcha!');
        setMensagemErro('')
        return '';
    };

    useEffect(() => {
        validarFormulario({recaptchaToken}); 
      }, [recaptchaToken]);
    
    const logar = async (event) => {
        await axios.post('http://localhost:8080/login', {emailusuario, senhausuario})
        .then(response =>{
            if (response.data == 'O endereço informado não está vinculado a uma conta!' || response.data == 'A senha informada está incorreta!') return setMensagemErro(response.data);
            Cookies.set('askhub', response.data, { expires: 3650, secure: false });
            return router.push('/');
        });
    }

    return (
        <section className={styles.mainContainer}>
            <section className={styles.centralContainer}>
            <img className={styles.logotext} src="logotext.png" alt=""/>
                <div className={styles.cadastroContainer}>
                    <h1 className={styles.cadastreseTexto}>Log-in!</h1>

                    <Link href="/cadastro" legacyBehavior><a className={styles.link}>Não tem uma conta? Cadastre-se clicando aqui!</a></Link>

                    <div className={styles.inputsContainer}>
                        <div className={styles.inputContainer}>
                            <input value={emailusuario}  onChange={(event) => setEmailUsuario(event.target.value)} className={styles.input}type="text" id="email" name="email" placeholder='Endereço de email' minLength={8} maxLength={100} pattern="[A-Za-z0-9]+"/>
                        </div>

                        <div className={styles.inputContainer}>
                            <input value={senhausuario} onChange={(event) => setSenhaUsuario(event.target.value)} className={styles.input}type="password" id="password" name="password" placeholder='Senha' minLength={8} maxLength={100} pattern="[A-Za-z0-9]+"/>
                        </div>

                        <ReCAPTCHA onChange={(token) => {setRecaptchaToken(token)}} className={styles.recaptcha} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}/>
                        <div className={styles.mensagemErro}>{mensagemErro}</div>
                        <button onClick={logar} className={recaptchaToken ? styles.buttonCadastrar : styles.buttonCadastrarOff}>Entrar</button>
                    </div>
                </div>
            </section>
            <img className={styles.albedo} src="albedo1.png" alt=""/>
        </section>
    )
}