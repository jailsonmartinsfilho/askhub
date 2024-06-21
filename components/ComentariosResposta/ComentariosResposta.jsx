import styles from './ComentariosResposta.module.css';
import calcularTempo from '../../hooks/calcularTempo';
import Link from 'next/link';
import useCarregarImagens from '../../hooks/carregarImagens';
import { FaHeart } from "react-icons/fa6";
import { MdAccessTimeFilled } from "react-icons/md";
import React, { useState, useEffect} from 'react';
import axios from 'axios';

export default function ComentariosResposta({ tempocomentario, textocomentario, idusuariocomentario, extensaofotoperfilusuario, nomeusuariocomentario, curtidascomentario, idperguntarespostacomentario, token  }) {
    let tempoComentario = calcularTempo(tempocomentario);
    const { fotoPerfilCarregada, fotoCapaCarregada } = useCarregarImagens(idusuariocomentario, extensaofotoperfilusuario);
    const [usuarioJaCurtiuComentario, setUsuarioJaCurtiuComentario] = useState(false);
    const [curtidasComentario, setCurtidasComentario] = useState(curtidascomentario);

    useEffect(() => {
        axios.post('http://localhost:8080/verificarUsuarioJaCurtiuComentario', { token, idperguntarespostacomentario, tipocurtida: 'comentario' })
            .then(response => {
                if (response.data) setUsuarioJaCurtiuComentario(true);
            });
    }, []);

    const handleCurtirComentario = async () => {
        if (usuarioJaCurtiuComentario) {
            await axios.post('http://localhost:8080/curtidaComentario', { token, idcomentario: idperguntarespostacomentario, tipocurtida: 'comentario', operacao: 'remover' })
            .then(response => {
                console.log(response.data)
                setCurtidasComentario(response.data);
                setUsuarioJaCurtiuComentario(false)
            });
        } else {
            await axios.post('http://localhost:8080/curtidaComentario', { token, idcomentario: idperguntarespostacomentario, tipocurtida: 'comentario', operacao: 'adicionar' })
                .then(response => {
                    console.log(response.data)
                    setCurtidasComentario(response.data);
                    setUsuarioJaCurtiuComentario(true)
                });
        }
    }

    return (
        <div className={styles.containerPerguntaPerfil}>
            <Link href={`/profile/${nomeusuariocomentario}`} className={styles.containerFotoNome}>
                <div className={styles.containerIcon} style={{ backgroundImage: `url(${fotoPerfilCarregada})` }}></div>
                <p className={styles.textoNome}>{nomeusuariocomentario}</p>
            </Link>

            <div className={styles.containerTitulo} >
                <p className={styles.textoTituloPergunta}>{textocomentario}</p>
            </div>

            <div className={styles.containerCurtidasVisuaizacoesCategoriaTempo}>
                <div className={styles.containerCurtidaComentario}>
                    <p className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><div></div><FaHeart onClick={handleCurtirComentario} style={{ cursor: 'pointer', fill: usuarioJaCurtiuComentario ? 'red' : 'white' }} /> <p className={styles.subTexto}>{curtidasComentario}</p></p>
                </div>

                <p className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><MdAccessTimeFilled /> <p className={styles.subTexto}>{tempoComentario}</p></p>
            </div>
        </div>
    )
}
