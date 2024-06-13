import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import PerguntaInicio from '../components/PerguntaInicio/PerguntaInicio';
import Navbar from '../components/Navbar/Navbar';

import styles from '../styles/index.module.css';
import axios from 'axios';

export default function Index() {
    const router = useRouter();
    const observerRef = useRef();

    const [comeco, setComeco] = useState(0);
    const [perguntas, setPerguntas] = useState([]);

    useEffect(() => {
        const verificarToken = async () => {
            const token = Cookies.get('askhub');
            if (!token) return router.push('/login');
        };
        verificarToken();
    }, []);

    useEffect(() => {
        const carregarMaisPerguntas = async () => {
            await axios.post('http://localhost:8080/buscarPerguntasInicio', {comeco})
            .then(response =>{
                setPerguntas(prevPerguntas => [...prevPerguntas, ...response.data]);
            });
        };
        carregarMaisPerguntas();
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
                {perguntas.map(pergunta => (
                    <PerguntaInicio key={pergunta.idpergunta} extensaofotoperfilusuario={pergunta.extensaofotoperfilusuario} nomeusuariopergunta={pergunta.nomeusuariopergunta} idusuariopergunta={pergunta.idusuariopergunta} tempopergunta={pergunta.tempopergunta} titulopergunta={pergunta.titulopergunta} descricaopergunta={pergunta.descricaopergunta} visualizacoespergunta={pergunta.visualizacoespergunta} numerorespostaspergunta={pergunta.numerorespostaspergunta} categoriapergunta={pergunta.categoriapergunta} curtidaspergunta={pergunta.curtidaspergunta} urlpergunta={pergunta.urlpergunta}/>
                ))}
                <div ref={observerRef}></div>
                </div>
            </section>
        </div>
    )
}