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
import Navbar from '../../components/Navbar/Navbar';

export default function Pergunta() {
    const router = useRouter();

    const [idUsuario, setIdUsuario] = useState('');
    const [extensaoFotoPerfilUsuario, setExtensaoFotoPerfilUsuario] = useState(undefined);
    const [extensaoFotoCapaUsuario, setExtensaoFotoCapaUsuario] = useState(undefined);
    const [nomeUsuario, setNomeUsuario] = useState('');
    const { fotoPerfilCarregada, fotoCapaCarregada } = useCarregarImagens(idUsuario, extensaoFotoPerfilUsuario, extensaoFotoCapaUsuario);
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
                    setExtensaoFotoPerfilUsuario(response.data.extensaofotoperfilusuario);
                    setExtensaoFotoCapaUsuario(response.data.extensaofotocapausuario);
                    console.log(response.data)
                });
        };
        verificarToken();
    }, []);

    return (
        <section className={styles.mainContainer}>
            <Navbar />
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
                        <div className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><FaEye /> <div className={styles.subTexto}>{visualizacoesPergunta}</div></div>
                        <div className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><FaHeart /> <div className={styles.subTexto}>{curtidasPergunta}</div></div>
                        <div className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><MdCategory /> <div className={styles.subTexto}>{categoriaPergunta}</div></div>
                        <div className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><MdAccessTimeFilled /> <div className={styles.subTexto}>{tempoPergunta}</div></div>
                    </div>
                </div>

                <div className={styles.containerNumeroRespostas}>
                    <div className={styles.textoNumeroRespostas}>{numeroRespostasPergunta}<div style={{ color: 'white', marginLeft: 5 }}>Respostas</div></div>
                </div>
                <div className={styles.containerInformacoes}></div>

            </div>
        </section>
    )
}