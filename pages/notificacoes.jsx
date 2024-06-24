import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Notificacao from '../components/Notificacao/Notificacao';
import Navbar from '../components/Navbar/Navbar';

import styles from '../styles/index.module.css';
import axios from 'axios';

export default function Notificacoes() {
    const router = useRouter();
    const observerRef = useRef();

    const [comeco, setComeco] = useState(0);
    const [notificacoes, setNotificacoes] = useState([]);

    useEffect(() => {
        const verificarToken = async () => {
            const token = Cookies.get('askhub');
            if (!token) return router.push('/login');
        };
        verificarToken();
    }, []);

    useEffect(() => {
        const buscarNotificacoes = async () => {
            await axios.post('http://localhost:8080/buscarNotificacoes', {comeco})
            .then(response =>{
                setNotificacoes(prevNotificacoes => [...prevNotificacoes, ...response.data]);
            });
        };
        buscarNotificacoes();
    }, [comeco]); 

    useEffect(() => {
        const observer = new IntersectionObserver(
          entries => {if (entries[0].isIntersecting) setComeco(prevComeco => prevComeco + 15);}, { threshold: 1 });
        if (observerRef.current) observer.observe(observerRef.current);
        return () => {if (observerRef.current)  observer.unobserve(observerRef.current)};
      }, []);

    return (
        <div>
            <Head>
                <title>AskHub</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar />

            <section className={styles.mainContainer}>
                <div className={styles.containerPergunta}>
                {notificacoes.map(notificacao => (
                    <Notificacao key={notificacao.idnotificacao} extensaofotoperfilusuario={notificacao.extensaofotoperfilusuario} nomeusuarionotificacao={notificacao.nomeusuarionotificacao} idusuarionotificacao={notificacao.idusuarionotificacao} temponotificacao={notificacao.temponotificacao} titulonotificacao={notificacao.titulonotificacao} descricaonotificacao={notificacao.descricaonotificacao} visualizacoespergunta={pergunta.visualizacoespergunta} numerorespostaspergunta={pergunta.numerorespostaspergunta} categoriapergunta={pergunta.categoriapergunta} curtidaspergunta={pergunta.curtidaspergunta} urlpergunta={pergunta.urlpergunta}/>
                ))}
                <div ref={observerRef}></div>
                </div>
            </section>
        </div>
    )
}