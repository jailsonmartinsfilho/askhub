import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/pergunta.module.css';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import useCarregarImagens from '../../hooks/carregarImagens';
import { FaHeart } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";
import { MdAccessTimeFilled } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import Link from 'next/link';
import calcularTempo from '../../hooks/calcularTempo';

export default function Pergunta() {
    const router = useRouter();

    const [idUsuario, setIdUsuario] = useState('');
    const [nomeUsuario, setNomeUsuario] = useState('');
    const { fotoPerfilCarregada, fotoCapaCarregada } = useCarregarImagens(idUsuario);
    const [tempoPergunta, setTempoPergunta] = useState('');
    const [tituloPergunta, setTituloPergunta] = useState('');
    const [descricaoPergunta, setDescricaoPergunta] = useState('');
    const [visualizacoesPergunta, setVisualizacoesPergunta] = useState('');
    const [curtidasPergunta, setCurtidasPergunta] = useState('');
    const [numeroRespostasPergunta, setNumeroRespostasPergunta] = useState('');
    const [categoriaPergunta, setCategoriaPergunta] = useState('');


    useEffect(() => {
        const verificarToken = async () => {
            const token = Cookies.get('askhub');
            if (!token) return router.push('/login');

            const urlpergunta = window.location.pathname.split('/')[2];
            console.log(urlpergunta);

            await axios.post('http://localhost:8080/buscarDadosPergunta', { urlpergunta })
                .then(response => {
                    console.log(response.data)
                    setIdUsuario(response.data.idusuariopergunta);
                    setNomeUsuario(response.data.nomeusuariopergunta);
                    setTempoPergunta(calcularTempo(response.data.tempopergunta));
                    setTituloPergunta(response.data.titulopergunta);
                    setDescricaoPergunta(response.data.descricaopergunta);
                    setCurtidasPergunta(response.data.curtidaspergunta);
                    setVisualizacoesPergunta(response.data.visualizacoespergunta);
                    setNumeroRespostasPergunta(response.data.numerorespostaspergunta);
                    setCategoriaPergunta(response.data.categoriapergunta);
                });
        };
        verificarToken();
    }, []);

    return (
        <section className={styles.mainContainer}>
            <div className={styles.containerProfile}>
                <div className={styles.containerInformacoes}>
                    <Link href={`/profile/${nomeUsuario}`} className={styles.containerFotoNome}>
                        <div className={styles.containerIcon} style={{ backgroundImage: `url(${fotoPerfilCarregada})` }}></div>
                        <p className={styles.textoNome}>{nomeUsuario}</p>
                    </Link>

                    <div className={styles.containerTituloDescricao}>
                        <p className={styles.textoTituloPergunta}>{tituloPergunta}</p>
                        <div className={styles.linhaHorizontal}></div>
                        <p className={styles.textoDescricaoPergunta}>{descricaoPergunta}</p>
                    </div>

                    <div className={styles.containerCurtidasVisuaizacoesCategoriaTempo}>
                        <p className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><FaHeart /> <p className={styles.subTexto}>{curtidasPergunta}</p></p>
                        <p className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><FaEye /> <p className={styles.subTexto}>{visualizacoesPergunta}</p></p>
                        <p className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><MdCategory /> <p className={styles.subTexto}>{categoriaPergunta}</p></p>
                        <p className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><MdAccessTimeFilled /> <p className={styles.subTexto}>{tempoPergunta}</p></p>
                    </div>
                </div>

                <div className={styles.containerNumeroRespostas}>
                    <p className={styles.textoNumeroRespostas}>{numeroRespostasPergunta}<p style={{ color: 'white', marginLeft: 5 }}>Respostas</p></p>
                </div>

                <div className={styles.containerInformacoes}>
                    
                </div>
            </div>
        </section>
    )
}