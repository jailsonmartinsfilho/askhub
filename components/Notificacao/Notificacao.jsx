import styles from './Notificacao.module.css';
import calcularTempo from '../../hooks/calcularTempo';
import useCarregarImagens from '../../hooks/carregarImagens';
import Link from 'next/link';
import { FaHeart } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";
import { MdAccessTimeFilled } from "react-icons/md";
import { FaEye } from "react-icons/fa";

export default function Notificacao({ tempopergunta, titulonotificacao, numerorespostasnotificacao, urlnotificacao, nomeusuarionotificacao, idusuarionotificacao, descricaonotificacao, visualizacoesnotificacao, categorianotificacao, curtidasnotificacao, extensaofotoperfilusuario }) {
    let temponotificacao = calcularTempo(temponotificacao);
    const { fotoPerfilCarregada, fotoCapaCarregada } = useCarregarImagens(idusuarionotificacao, extensaofotoperfilusuario);

    return (
        <div className={styles.containerPerguntaPerfil}>
            <Link  href={`/profile/${nomeusuariopergunta}`} className={styles.containerFotoNome}>
                <div className={styles.containerIcon} style={{ backgroundImage: `url(${fotoPerfilCarregada})` }}></div>
                <p className={styles.textoNome}>{nomeusuariopergunta}</p>
            </Link>

            <div className={styles.containerTitulo} >
                <Link style={{ textDecoration: 'none' }} href={`/pergunta/${urlpergunta}`} >
                    <p className={styles.textoTituloPergunta}>{titulopergunta}</p>
                </Link>
            </div>


            <div className={styles.containerCurtidasVisuaizacoesCategoriaTempo}>
                <p className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><FaHeart /> <p className={styles.subTexto}>{curtidaspergunta}</p></p>
                <p className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><FaEye /> <p className={styles.subTexto}>{visualizacoespergunta}</p></p>
                <p className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><MdCategory /> <p className={styles.subTexto}>{categoriapergunta}</p></p>
                <p className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><MdAccessTimeFilled /> <p className={styles.subTexto}>{tempoPergunta}</p></p>
            </div>
        </div>
    )
}
