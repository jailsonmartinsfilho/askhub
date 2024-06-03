import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/ask.module.css';
import ReCAPTCHA from 'react-google-recaptcha';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function Cadastro() {
    const router = useRouter();

    useEffect(() => {
        const verificarToken = async () => {
            const token = Cookies.get('askhub');
            if (token) return router.push('/');
        };
        verificarToken();
    }, []);

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
            console.log(response.data)
            if (response.data == 'Cadastro realizado com sucesso!') return router.push('/profile');
        });
    }

    return (
        <section className={styles.mainContainer}>
            <section className={styles.centralContainer}>
                <div className={styles.cadastroContainer}>
                    <div className={styles.inputsContainer}>

                        <div className={styles.inputContainer}>
                            <input value={nomeusuario} onChange={(event) => {setNomeUsuario(event.target.value)}} className={styles.input}type="text" id="nome" name="nome" placeholder='Faça uma pergunta ou diga algo que está pensando...' maxLength={150} pattern="[A-Za-z0-9]+"/>

                            <textarea className={styles.textarea} placeholder="Detalhe sobre o assunto aqui, caso seja necessário..." maxLength={2000}/>
                        </div>

                        <div className={styles.mensagemErro}>{mensagemErro}</div>

                        <button onClick={cadastrar} className={styles.buttonCadastrar}>Ok!</button>
                    </div>
                </div>
            </section>
        </section>
    )
}