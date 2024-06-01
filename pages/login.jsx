import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/login.module.css';

export default function Login() {
    const [emailusuario, setEmailUsuario] = useState('');
    const [senhausuario, setSenhaUsuario] = useState('');
    const [mensagemErro, setMensagemErro] = useState('');
    
    const logar = async (event) => {
        setMensagemErro('')

        await axios.post('http://localhost:8080/login', {emailusuario, senhausuario})
        .then(response =>{
            if (response.data == 'O endereço informado não está vinculado a uma conta!' || response.data == 'A senha informada está incorreta!') return setMensagemErro(response.data);
        });
    }

    return (
        <section className={styles.mainContainer}>
            <section className={styles.centralContainer}>
            <img className={styles.logotext} src="logotext.png" alt=""/>
                <div className={styles.cadastroContainer}>
                    <h1 className={styles.cadastreseTexto}>Log-in!</h1>

                    <div className={styles.inputsContainer}>
                        <div className={styles.inputContainer}>
                            <input value={emailusuario}  onChange={(event) => setEmailUsuario(event.target.value)} className={styles.input}type="text" id="email" name="email" placeholder='Endereço de email' minLength={8} maxLength={100} pattern="[A-Za-z0-9]+"/>
                        </div>

                        <div className={styles.inputContainer}>
                            <input value={senhausuario} onChange={(event) => setSenhaUsuario(event.target.value)} className={styles.input}type="password" id="password" name="password" placeholder='Senha' minLength={8} maxLength={100} pattern="[A-Za-z0-9]+"/>
                        </div>

                        <div className={styles.mensagemErro}>{mensagemErro}</div>

                        <button onClick={logar} className={styles.buttonCadastrar}>Entrar</button>
                    </div>
                </div>
            </section>
            <img className={styles.albedo} src="albedo1.png" alt=""/>
        </section>
    )
}