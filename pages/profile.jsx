import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/profile.module.css';
import { useRouter } from 'next/router';
import { FaMedal } from "react-icons/fa";
import { GrConfigure } from "react-icons/gr";


export default function Profile() {
    const router = useRouter();
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
            if (response.data == 'A senha informada está correta!') return router.push('/profile');
        });
    }

    return (
        <section className={styles.mainContainer}>
            <div className={styles.containerProfile}>

                <div className={styles.containerBanner}>
                    <div className={styles.containerIcon}></div>
                </div>

                <div className={styles.containerInformacoes}>
                    <p className={styles.textoNome}>Nome</p>
                    <p className={styles.textoPronome}>Ele/dele</p>
                    <FaMedal className={styles.medalha}/>
                    <FaMedal className={styles.medalha}/>
                    <GrConfigure className={styles.medalha}/>
                </div>

                <div className={styles.containerInformacoes2}>
                    <div className={styles.containerBarraExperiencia}>
                    <div className={styles.barraExperiencia}></div>
                        
                    </div>
                    <p className={styles.textoExperiencia}>0/100 | 0%</p>
                </div>



                <div className={styles.containerBiografia}>
                    <p className={styles.textoBiografia}>the cocaine is not good for u</p>
                </div>

                <div className={styles.linhaHorizontal}></div>

                <div className={styles.containerGuias}>
                    <div className={styles.guiaPerguntas}>Perguntas</div>
                    <div className={styles.guiaPerguntas}>Respostas</div>
                    <div className={styles.guiaPerguntas}>Seguidores</div>
                    <div className={styles.guiaPerguntas}>Seguindo</div>
                </div>
            </div>
        </section>
    )
}