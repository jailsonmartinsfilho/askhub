import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/cadastro.module.css';
import ReCAPTCHA from 'react-google-recaptcha';
import { useRouter } from 'next/router';

export default function Cadastro() {
    const router = useRouter();
    const [nomeusuario, setNomeUsuario] = useState('');
    const [emailusuario, setEmailUsuario] = useState('');
    const [senhausuario, setSenhaUsuario] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mensagemErro, setMensagemErro] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState(null);

    const validarFormulario = ({ nomeusuario, emailusuario, senhausuario, confirmarSenha, recaptchaToken }) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (nomeusuario.length < 3) return setMensagemErro('O nome de usuário é muito curto!');
        if (emailusuario.length < 8 || !emailRegex.test(emailusuario)) return setMensagemErro('O email é inválido ou muito curto!');
        if (senhausuario.length < 8) return setMensagemErro('A senha é muito curta!');
        if (senhausuario !== confirmarSenha) return setMensagemErro('As senhas não são iguais!');
        if (!recaptchaToken) return setMensagemErro('Complete a verificação ReCaptcha!');

        setMensagemErro('')
        return '';
    };

    useEffect(() => {
        validarFormulario({nomeusuario, emailusuario, senhausuario, confirmarSenha, recaptchaToken}); 
      }, [nomeusuario, emailusuario, senhausuario, confirmarSenha, recaptchaToken]);

    const cadastrar = async (event) => {
        const errorMessage = validarFormulario({nomeusuario,emailusuario,senhausuario,confirmarSenha,recaptchaToken});
        if (errorMessage != '') return;

        await axios.post('http://localhost:8080/cadastrar', {nomeusuario, emailusuario, senhausuario})
        .then(response =>{
            console.log(response.data)
            if (response.data == 'O nome já está sendo usado!' || response.data == 'O email já está sendo usado!') return setMensagemErro(response.data);
            if (response.data == 'Cadastro realizado com sucesso!') return router.push('/profile');
        });
    }

    return (
        <section className={styles.mainContainer}>
            <section className={styles.centralContainer}>
            <img className={styles.logotext} src="logotext.png" alt=""/>
                <div className={styles.cadastroContainer}>
                    <h1 className={styles.cadastreseTexto}>Cadastre-se!</h1>

                    <div className={styles.inputsContainer}>
                        <div className={styles.inputContainer}>
                            <input value={nomeusuario} onChange={(event) => {setNomeUsuario(event.target.value)}} className={styles.input}type="text" id="nome" name="nome" placeholder='Nome de usuário' maxLength={20} pattern="[A-Za-z0-9]+"/>
                        </div>

                        <div className={styles.inputContainer}>
                            <input value={emailusuario}  onChange={(event) => {setEmailUsuario(event.target.value)}} className={styles.input}type="text" id="email" name="email" placeholder='Endereço de email' maxLength={100} pattern="[A-Za-z0-9]+"/>
                        </div>

                        <div className={styles.inputContainer}>
                            <input onChange={(event) => {setSenhaUsuario(event.target.value)}} value={senhausuario} className={styles.input}type="password" id="password" name="password" placeholder='Senha' mmaxLength={100} pattern="[A-Za-z0-9]+"/>
                        </div>

                        <div className={styles.inputContainer}>
                            <input value={confirmarSenha} onChange={(event) => {setConfirmarSenha(event.target.value) }} className={styles.input}type="password" id="confirmpassword" name="confirmpassword" placeholder='Confirmar senha' maxLength={100} pattern="[A-Za-z0-9]+"/>
                        </div>

                        <ReCAPTCHA onChange={(token) => {setRecaptchaToken(token)}} className={styles.recaptcha} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}/>

                        <div className={styles.mensagemErro}>{mensagemErro}</div>

                        <button onClick={cadastrar} className={mensagemErro == '' ? styles.buttonCadastrar : styles.buttonCadastrarOff}>Cadastrar</button>
                    </div>
                </div>
            </section>
            <img className={styles.albedo} src="albedo1.png" alt=""/>
        </section>
    )
}