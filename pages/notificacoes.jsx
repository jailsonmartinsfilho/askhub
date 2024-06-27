import Head from 'next/head';
import Cookies from 'js-cookie';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Notificacao from '../components/Notificacao/Notificacao';
import Navbar from '../components/Navbar/Navbar';

import styles from '../styles/index.module.css';


export default function Notificacoes() {
    const router = useRouter();
    const observerRef = useRef();

    const [comeco, setComeco] = useState(0);
    const [notificacoes, setNotificacoes] = useState([]);
    const [token, setToken] = useState(''); 
    const [podeBuscar, setPodeBuscar] = useState(false); 

    useEffect(() => {
        const verificarToken = async () => {
            const token = Cookies.get('askhub');
            if (!token) return router.push('/login');
            setToken(token)
        };
        verificarToken();
    }, []);

    useEffect(() => {
        const buscarNotificacoes = async () => {
            await axios.post('http://localhost:8080/buscarNotificacoes', {token, comeco})
            .then(response =>{
                setNotificacoes(prevNotificacoes => [...prevNotificacoes, ...response.data]);
                setPodeBuscar(true)
            });
        };
        if (token != '') buscarNotificacoes();
    }, [token]); 

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
                    <Notificacao key={notificacao.idusuarionotificacao} podeBuscar={podeBuscar} extensaofotoperfilusuario={notificacao.extensaofotoperfilusuario} idusuarionotificado={notificacao.idusuarionotificado} nomeusuarionotificacao={notificacao.nomeusuarionotificacao} idusuarionotificacao={notificacao.idusuarionotificacao} temponotificacao={notificacao.temponotificacao} tiponotificacao={notificacao.tiponotificacao} urlpergunta={notificacao.urlpergunta}/>
                ))}
                <div ref={observerRef}></div>
                </div>
            </section>
        </div>
    )
}