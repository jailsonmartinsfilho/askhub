import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import UsuarioRanking from '../components/UsuarioRanking/UsuarioRanking';
import Navbar from '../components/Navbar/Navbar';

import styles from '../styles/ranking.module.css';
import axios from 'axios';

export default function Ranking() {
    const router = useRouter();

    const [topUsuarios, setTopUsuarios] = useState([]);

    useEffect(() => {
        const verificarToken = async () => {
            const token = Cookies.get('askhub');
            if (!token) return router.push('/login');
        };
        verificarToken();
    }, []);

    useEffect(() => {
        const carregarTopUsuarios = async () => {
            await axios.post('http://localhost:8080/carregarTopUsuarios')
                .then(response => {
                    setTopUsuarios(response.data);
                });
        };
        carregarTopUsuarios();
    }, []);

    return (
        <div>
            <Navbar />

            <section className={styles.mainContainer}>
                <div className={styles.containerPergunta}>
                    {topUsuarios.map((usuario, index) => (
                        <UsuarioRanking key={usuario.idusuario} posicaoRank={index + 1} nomeusuario={usuario.nomeusuario} pontostotalusuario={usuario.pontostotalusuario} idusuario={usuario.idusuario} extensaofotoperfilusuario={usuario.extensaofotoperfilusuario} nivelusuario={usuario.nivelusuario} extensaofotocapausuario={usuario.extensaofotocapausuario} numeroperguntasusuario={usuario.numeroperguntasusuario} numerorespostasusuario={usuario.numerorespostasusuario}/>
                    ))}
                </div>
            </section>
        </div>
    )
}