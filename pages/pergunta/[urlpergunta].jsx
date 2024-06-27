import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from '../../styles/pergunta.module.css';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import useCarregarImagens from '../../hooks/carregarImagens';
import { FaHeart } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";
import { MdAccessTimeFilled } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import Link from 'next/link';
import calcularTempo from '../../hooks/calcularTempo';
import Navbar from '../../components/Navbar/Navbar';
import RespostaPergunta from '../../components/RespostaPergunta/RespostaPergunta';

export default function Pergunta() {
    const router = useRouter();
    const observerRef = useRef();

    const [idUsuario, setIdUsuario] = useState('');
    const [extensaoFotoPerfilUsuario, setExtensaoFotoPerfilUsuario] = useState(undefined);
    const [extensaoFotoCapaUsuario, setExtensaoFotoCapaUsuario] = useState(undefined);
    const [nomeUsuario, setNomeUsuario] = useState('');
    const { fotoPerfilCarregada, fotoCapaCarregada } = useCarregarImagens(idUsuario, extensaoFotoPerfilUsuario, extensaoFotoCapaUsuario);
    const [tempoPergunta, setTempoPergunta] = useState('');
    const [tituloPergunta, setTituloPergunta] = useState('');
    const [descricaoPergunta, setDescricaoPergunta] = useState('');
    const [visualizacoesPergunta, setVisualizacoesPergunta] = useState('');
    const [curtidasPergunta, setCurtidasPergunta] = useState(0);
    const [numeroRespostasPergunta, setNumeroRespostasPergunta] = useState('');
    const [categoriaPergunta, setCategoriaPergunta] = useState('');
    const [textoResposta, setTextoResposta] = useState('');
    const [mensagemErro, setMensagemErro] = useState('');
    const [token, setToken] = useState('');
    const [usuarioJaRespondeu, setUsuarioJaRespondeu] = useState(false);
    const [usuarioJaCurtiu, setUsuarioJaCurtiu] = useState(false);

    const [comeco, setComeco] = useState(0);
    const [respostas, setRespostas] = useState([]);

    const validarResposta = ({ textoResposta }) => {
        if (textoResposta.length < 4) return setMensagemErro('A resposta é muito curta!');
        setMensagemErro('')
        return '';
    };

    useEffect(() => {
        validarResposta({ textoResposta });
    }, [textoResposta]);

    useEffect(() => {
        const verificarToken = async () => {
            const token = Cookies.get('askhub');
            if (!token) return router.push('/login');
            setToken(token);

            const urlpergunta = window.location.pathname.split('/')[2];

            await axios.post('http://localhost:8080/buscarDadosPergunta', { urlpergunta })
                .then(response => {
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
                });
        };
        verificarToken();
    }, []);

    useEffect(() => {
        const idpergunta = window.location.pathname.match(/\/(\d+)/)?.[1] || null;
        if (token == '') return;

        axios.post('http://localhost:8080/verificarUsuarioJaRespondeu', { token, idpergunta })
            .then(response => {
                if (response.data) setUsuarioJaRespondeu(true);
            });

        console.log(token)
        axios.post('http://localhost:8080/verificarUsuarioJaCurtiuPergunta', { token, idpergunta, tipocurtida: 'pergunta' })
            .then(response => {
                if (response.data) setUsuarioJaCurtiu(true);
            });
    }, [token]);

    let idpergunta2;
    const carregarMaisRespostas = async () => {
        idpergunta2 = window.location.pathname.match(/\/(\d+)/)?.[1] || null;
        await axios.post('http://localhost:8080/buscarRespostasPergunta', { comeco, idpergunta2 })
            .then(response => {
                setRespostas(prevRespostas => [...prevRespostas, ...response.data]);
            });
    };

    useEffect(() => {
        carregarMaisRespostas();
    }, [comeco]);

    let idpergunta;
    let urlpergunta2;
    const postarResposta = async (event) => {
        const errorMessage = validarResposta({ textoResposta });
        if (errorMessage != '') return;

        idpergunta = window.location.pathname.match(/\/(\d+)/)?.[1] || null;
        urlpergunta2 = window.location.pathname.split('/')[2];

        await axios.post('http://localhost:8080/postarResposta', { token, textoresposta: textoResposta, idpergunta, urlpergunta: urlpergunta2 })
            .then(response => {
                setRespostas(prevRespostas => [response.data, ...prevRespostas]);
                console.log(response.data)
                setNumeroRespostasPergunta(response.data.idresposta)
                setUsuarioJaRespondeu(true)
            });
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => { if (entries[0].isIntersecting) setComeco(prevComeco => prevComeco + 15); }, { threshold: 1 });
        if (observerRef.current) observer.observe(observerRef.current);
        return () => { if (observerRef.current) observer.unobserve(observerRef.current) };
    }, []);

    const handleCurtirPergunta = async () => {
        const idpergunta = window.location.pathname.match(/\/(\d+)/)?.[1] || null;

        if (usuarioJaCurtiu) {
            await axios.post('http://localhost:8080/curtidaPergunta', { token, idpergunta, tipocurtida: 'pergunta', operacao: 'remover' })
            .then(response => {
                console.log(response.data)
                setCurtidasPergunta(response.data);
                setUsuarioJaCurtiu(false)
            });
        } else {
            await axios.post('http://localhost:8080/curtidaPergunta', { token, idpergunta, tipocurtida: 'pergunta', operacao: 'adicionar' })
                .then(response => {
                    console.log(response.data)
                    setCurtidasPergunta(response.data);
                    setUsuarioJaCurtiu(true)
                });
        }
    }

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
                        <div className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><FaHeart onClick={handleCurtirPergunta} style={{ cursor: 'pointer', fill: usuarioJaCurtiu ? 'red' : 'white' }} /> <div className={styles.subTexto}>{curtidasPergunta}</div></div>
                        <div className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><FaEye /> <div className={styles.subTexto}>{visualizacoesPergunta}</div></div>
                        <div className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><MdCategory /> <div className={styles.subTexto}>{categoriaPergunta}</div></div>
                        <div className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><MdAccessTimeFilled /> <div className={styles.subTexto}>{tempoPergunta}</div></div>
                    </div>
                </div>

                <div className={styles.containerNumeroRespostas}>
                    <div className={styles.textoNumeroRespostas}>{numeroRespostasPergunta}<div style={{ color: 'white', marginLeft: 5 }}>Respostas</div></div>
                </div>

                <textarea value={textoResposta} onChange={(event) => { setTextoResposta(event.target.value) }} className={styles.textarea} style={usuarioJaRespondeu ? { display: 'none' } : {}} placeholder="Insira sua resposta aqui..." maxLength={2000} />

                <div className={styles.containerBotoesResposta}>
                    <button onClick={postarResposta} className={mensagemErro == '' ? styles.buttonCadastrar : styles.buttonCadastrarOff} style={usuarioJaRespondeu ? { display: 'none' } : {}}>Postar</button>
                </div>

                <div className={styles.containerInformacoes}>
                    {respostas.map(resposta => (
                        <RespostaPergunta key={resposta.idperguntaresposta} idperguntaresposta={resposta.idperguntaresposta} token={token} idresposta={resposta.idresposta} extensaofotoperfilusuario={resposta.extensaofotoperfilusuario} nomeusuarioresposta={resposta.nomeusuarioresposta} idusuarioresposta={resposta.idusuarioresposta} temporesposta={resposta.temporesposta} textoresposta={resposta.textoresposta} numerocomentariosresposta={resposta.numerocomentariosresposta} curtidasresposta={resposta.curtidasresposta} />
                    ))}
                </div>
                <div ref={observerRef}></div>

            </div>
        </section>
    )
}