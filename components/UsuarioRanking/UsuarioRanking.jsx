import styles from './UsuarioRanking.module.css';
import useCarregarImagens from '../../hooks/carregarImagens';
import React, { useEffect } from 'react';
import Link from 'next/link';

import { VscActivateBreakpoints } from "react-icons/vsc";
import { FaQuestion } from "react-icons/fa";
import { FaReply } from "react-icons/fa";
import { SiOpslevel } from "react-icons/si";
import { FaRankingStar } from "react-icons/fa6";

export default function UsuarioRanking({ idusuario, posicaoRank, extensaofotoperfilusuario, nivelusuario, extensaofotocapausuario, numeroperguntasusuario, numerorespostasusuario, nomeusuario, pontostotalusuario }) {
    const { fotoPerfilCarregada, fotoCapaCarregada } = useCarregarImagens(idusuario, extensaofotoperfilusuario, extensaofotocapausuario);

    return (
        <div className={styles.containerPerguntaPerfil} style={{ backgroundImage: `url(${fotoCapaCarregada})` }}>
            <div className={styles.containerPosicao}><FaRankingStar /> {posicaoRank}</div>
            <Link  href={`/profile/${nomeusuario}`}  className={styles.containerFotoNome}>
                <div className={styles.containerIcon} style={{ backgroundImage: `url(${fotoPerfilCarregada})` }}></div>
                <p className={styles.textoNome}>{nomeusuario}</p>
            </Link>

            <div className={styles.containerNivel}><SiOpslevel /> Nível {nivelusuario}</div>
            <div className={styles.containerNivel}><VscActivateBreakpoints />Pontos {pontostotalusuario}</div>
            <div className={styles.containerNivel}><FaQuestion />Perguntas {numeroperguntasusuario}</div>
            <div className={styles.containerNivel}><FaReply />Respostas {numerorespostasusuario}</div>

            {/* <div className={styles.containerTitulo} >
                <Link style={{ textDecoration: 'none' }} href={`/pergunta/${urlpergunta}`} >
                    <p className={styles.textoTituloPergunta}>{titulopergunta}</p>
                </Link>
            </div>

            <div className={styles.containerCurtidasVisuaizacoesCategoriaTempo}>
                <p className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><FaHeart /> <p className={styles.subTexto}>{curtidaspergunta}</p></p>
                <p className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><FaEye /> <p className={styles.subTexto}>{visualizacoespergunta}</p></p>
                <p className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><MdCategory /> <p className={styles.subTexto}>{categoriapergunta}</p></p>
                <p className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><MdAccessTimeFilled /> <p className={styles.subTexto}>{tempoPergunta}</p></p>
            </div> */}
        </div>
    )
}
