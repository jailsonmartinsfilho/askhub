import styles from './RespostaPergunta.module.css';
import calcularTempo from '../../hooks/calcularTempo';
import Link from 'next/link';
import { FaHeart } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";
import { MdAccessTimeFilled } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { IoChatbubble } from "react-icons/io5";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ComentariosResposta from '../../components/ComentariosResposta/ComentariosResposta';
import useCarregarImagens from '../../hooks/carregarImagens';
import { FaArrowDown } from "react-icons/fa";

export default function RespostaPergunta({ token, idperguntaresposta, idresposta, extensaofotoperfilusuario, nomeusuarioresposta, idusuarioresposta, temporesposta, textoresposta, numerocomentariosresposta, curtidasresposta }) {
    let tempoResposta = calcularTempo(temporesposta);
    const { fotoPerfilCarregada, fotoCapaCarregada } = useCarregarImagens(idusuarioresposta, extensaofotoperfilusuario);
    const [textoComentario, setTextoComentario] = useState('');
    const [botaoComentarioAtivado, setBotaoComentarioAtivado] = useState(false);
    const [mensagemErro, setMensagemErro] = useState('');
    const [comeco, setComeco] = useState(0);
    const [comentarios, setComentarios] = useState([]);
    const [numeroComentariosRespostas, setNumeroComentariosRespostas] = useState(numerocomentariosresposta);
    const [curtidasResposta, setCurtidasResposta] = useState(curtidasresposta);
    const [naoTemMaisComentario, setNaoTemMaisComentario] = useState(false);
    const [usuarioJaCurtiuResposta, setUsuarioJaCurtiuResposta] = useState(false);

    useEffect(() => {
        axios.post('http://localhost:8080/verificarUsuarioJaCurtiuResposta', { token, idperguntaresposta, tipocurtida: 'resposta' })
            .then(response => {
                if (response.data) setUsuarioJaCurtiuResposta(true);
            });
    }, []);
    
    const validarComentario = ({ textoComentario }) => {
        if (textoComentario.length < 2) return setMensagemErro('O comentário é muito curto!');
        setMensagemErro('')
        return '';
    };

    useEffect(() => {
        validarComentario({ textoComentario });
    }, [textoComentario]);

    const handleClickComentario = () => {
        if (!botaoComentarioAtivado) {
            setBotaoComentarioAtivado(true);
            carregarComentarios();
        } else {
            setBotaoComentarioAtivado(false);
            setComeco(0);
            setComentarios([]);
            setNaoTemMaisComentario(false);
        }
    };

    const postarComentario = async (event) => {
        const errorMessage = validarComentario({ textoComentario });
        if (errorMessage != '') return;
        const urlpergunta = window.location.pathname.split('/')[2];

        await axios.post('http://localhost:8080/postarComentario', { token, textocomentario: textoComentario, idperguntaresposta, idresposta, urlpergunta })
            .then(response => {
                setNumeroComentariosRespostas(response.data.idcomentario)
                setComentarios(prevComentarios => [response.data, ...prevComentarios]);
                setTextoComentario('');
            });
    }

    const carregarComentarios = async () => {
        await axios.post('http://localhost:8080/buscarComentariosResposta', { comeco, idperguntaresposta })
            .then(response => {
                setComentarios(prevComentarios => [...prevComentarios, ...response.data]);
                if (response.data.length == 0) setNaoTemMaisComentario(true);
            });
    };

    const handleCarregarMais = async () => {
        setComeco(comeco + 15);
    };

    useEffect(() => {
        if (comeco != 0) carregarComentarios();
    }, [comeco]);

    const handleCurtirResposta = async () => {
        if (usuarioJaCurtiuResposta) {
            await axios.post('http://localhost:8080/curtidaResposta', { token, idresposta: idperguntaresposta, tipocurtida: 'resposta', operacao: 'remover' })
            .then(response => {
                setCurtidasResposta(response.data);
                setUsuarioJaCurtiuResposta(false)
            });
        } else {
            await axios.post('http://localhost:8080/curtidaResposta', { token, idresposta: idperguntaresposta, tipocurtida: 'resposta', operacao: 'adicionar' })
                .then(response => {
                    setCurtidasResposta(response.data);
                    setUsuarioJaCurtiuResposta(true)
                });
        }
    }

    return (
        <div className={styles.containerPerguntaPerfil}>
            <Link href={`/profile/${nomeusuarioresposta}`} className={styles.containerFotoNome}>
                <div className={styles.containerIcon} style={{ backgroundImage: `url(${fotoPerfilCarregada})` }}></div>
                <p className={styles.textoNome}>{nomeusuarioresposta}</p>
            </Link>

            <div className={styles.containerTitulo} >
                <p className={styles.textoTituloPergunta}>{textoresposta}</p>
            </div>

            <div className={styles.containerCurtidasVisuaizacoesCategoriaTempo}>
                <div className={styles.containerCurtidaComentario}>
                    <p className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><div></div><FaHeart onClick={handleCurtirResposta} style={{ cursor: 'pointer', fill: usuarioJaCurtiuResposta ? 'red' : 'white' }} /> <p className={styles.subTexto}>{curtidasResposta}</p></p>
                    <p className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><IoChatbubble style={{ cursor: 'pointer' }} onClick={handleClickComentario} /><p className={styles.subTexto}>{numeroComentariosRespostas}</p></p>
                </div>

                <p className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><MdAccessTimeFilled /> <p className={styles.subTexto}>{tempoResposta}</p></p>
            </div>

            <textarea value={textoComentario} onChange={(event) => { setTextoComentario(event.target.value) }} className={styles.textarea} style={botaoComentarioAtivado ? {} : { display: 'none' }} placeholder="Insira seu comentário aqui..." maxLength={2000} />
            <div className={styles.containerBotoesResposta}>
                <button onClick={postarComentario} className={mensagemErro == '' ? styles.buttonCadastrar : styles.buttonCadastrarOff} style={botaoComentarioAtivado ? {} : { display: 'none' }}>Postar</button>
            </div>

            <div className={styles.containerInformacoes} style={botaoComentarioAtivado ? {} : { display: 'none' }}>
                {comentarios.map(comentario => (
                    <ComentariosResposta key={comentario.idperguntarespostacomentario} token={token} idperguntarespostacomentario={comentario.idperguntarespostacomentario} idusuariocomentario={comentario.idusuariocomentario} textocomentario={comentario.textocomentario} tempocomentario={comentario.tempocomentario} numerocomentarios={comentario.numerocomentarios} extensaofotoperfilusuario={comentario.extensaofotoperfilusuario} nomeusuariocomentario={comentario.nomeusuariocomentario} curtidascomentario={comentario.curtidascomentario} />
                ))}
                <div className={styles.containerCarregarMais} style={naoTemMaisComentario ? {display: 'none' } : {  }}><div onClick={handleCarregarMais} className={styles.textoCarregarMais}>Carregar mais comentários +</div></div>
            </div>
        </div>
    )
}
