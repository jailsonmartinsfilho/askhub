import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/configuracoes.module.css';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function Profile() {
    const router = useRouter();

    const [nomeUsuario, setNomeUsuario] = useState('');
    const [biografiaUsuario, setBiografiaUsuario] = useState('');

    useEffect(() => {
        const verificarToken = async () => {
            const token = Cookies.get('askhub');
            if (!token) return router.push('/login');

            await axios.post('http://localhost:8080/buscarDadosConfiguracoes', {token})
            .then(response =>{
                setNomeUsuario(response.data.nomeusuario);
                setBiografiaUsuario(response.data.biografiausuario);
                console.log(response.data)
            });
        };
        verificarToken();
    }, []);

    return (
        <section className={styles.mainContainer}>
            <div className={styles.containerProfile}>

                <div className={styles.containerBanner}>
                    <div className={styles.containerIcon}></div>
                </div>

                <div className={styles.containerBiografia}>
                    <p className={styles.textoBiografia}>{biografiaUsuario}</p>
                </div>

                <div className={styles.linhaHorizontal}></div>
            </div>
        </section>
    )
}