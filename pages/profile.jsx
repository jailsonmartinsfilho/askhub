import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/profile.module.css';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

import { FaMedal } from "react-icons/fa";
import { GrConfigure } from "react-icons/gr";

import PerguntaPerfil from '../components/PerguntaPerfil/PerguntaPerfil';

export default function Profile() {
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
    const [guiaAtivaNome, setGuiaAtivaNome] = useState('Perguntas');

    const validarFormulario = ({ recaptchaToken }) => {
        if (!recaptchaToken) return setMensagemErro('Complete a verificação ReCaptcha!');
        setMensagemErro('')
        return '';
    };

    useEffect(() => {
        validarFormulario({ recaptchaToken });
    }, [recaptchaToken]);

    const logar = async (event) => {
        await axios.post('http://localhost:8080/login', { emailusuario, senhausuario })
            .then(response => {
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
                    <FaMedal className={styles.medalha} />
                    <FaMedal className={styles.medalha} />
                    <GrConfigure className={styles.medalha} />
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
                    <div onClick={() => setGuiaAtivaNome('Perguntas')} className={guiaAtivaNome === 'Perguntas' ? styles.guiaSelecionada : styles.guiaPerguntas}>Perguntas</div>
                    <div onClick={() => setGuiaAtivaNome('Respostas')} className={guiaAtivaNome === 'Respostas' ? styles.guiaSelecionada : styles.guiaPerguntas}>Respostas</div>
                    <div onClick={() => setGuiaAtivaNome('Seguidores')} className={guiaAtivaNome === 'Seguidores' ? styles.guiaSelecionada : styles.guiaPerguntas}>Seguidores</div>
                    <div onClick={() => setGuiaAtivaNome('Seguindo')} className={guiaAtivaNome === 'Seguindo' ? styles.guiaSelecionada : styles.guiaPerguntas}>Seguindo</div>
                </div>

                <div className={styles.containerAtividades}>
                    <PerguntaPerfil />
                    <PerguntaPerfil />
                </div>
            </div>
        </section>
    )
}