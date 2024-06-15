import styles from './RespostaPergunta.module.css';
import calcularTempo from '../../hooks/calcularTempo';
import useCarregarImagens from '../../hooks/carregarImagens';
import Link from 'next/link';
import { FaHeart } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";
import { MdAccessTimeFilled } from "react-icons/md";
import { FaEye } from "react-icons/fa";

export default function RespostaPergunta({ idperguntaresposta, extensaofotoperfilusuario, nomeusuarioresposta, idusuarioresposta, temporesposta, textoresposta, numerocomentariosresposta, curtidasresposta}) {
    let tempoResposta = calcularTempo(temporesposta);
    const { fotoPerfilCarregada, fotoCapaCarregada } = useCarregarImagens(idusuarioresposta, extensaofotoperfilusuario);

    return (
        <div className={styles.containerPerguntaPerfil}>
            <Link  href={`/profile/${nomeusuarioresposta}`} className={styles.containerFotoNome}>
                <div className={styles.containerIcon} style={{ backgroundImage: `url(${fotoPerfilCarregada})` }}></div>
                <p className={styles.textoNome}>{nomeusuarioresposta}</p>
            </Link>

            <div className={styles.containerTitulo} >
                <p className={styles.textoTituloPergunta}>{textoresposta}</p>
            </div>

            <div className={styles.containerCurtidasVisuaizacoesCategoriaTempo}>
                <p className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><FaHeart /> <p className={styles.subTexto}>{curtidasresposta}</p></p>
                <p className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><MdAccessTimeFilled /> <p className={styles.subTexto}>{tempoResposta}</p></p>
            </div>
        </div>
    )
}
