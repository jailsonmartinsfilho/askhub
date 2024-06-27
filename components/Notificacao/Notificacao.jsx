import styles from './Notificacao.module.css';
import calcularTempo from '../../hooks/calcularTempo';
import useCarregarImagens from '../../hooks/carregarImagens';
import Link from 'next/link';
import { FaHeart } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";
import { MdAccessTimeFilled } from "react-icons/md";
import { FaEye } from "react-icons/fa";

export default function Notificacao({ extensaofotoperfilusuario, nomeusuarionotificacao, idusuarionotificado, idusuarionotificacao, temponotificacao, urlpergunta, tiponotificacao }) {
    let tempoNotificacao = calcularTempo(temponotificacao);
    const { fotoPerfilCarregada, fotoCapaCarregada } = useCarregarImagens(idusuarionotificacao, extensaofotoperfilusuario);

    let textonotificacao;
    if (tiponotificacao == 'Resposta') textonotificacao = 'Respondeu a sua pergunta';
    if (tiponotificacao == 'Comentário') textonotificacao = 'Comentou na sua resposta';

    return (
        <div className={styles.containerPerguntaPerfil}>
            <Link  href={`/profile/${nomeusuarionotificacao}`} className={styles.containerFotoNome}>
                <div className={styles.containerIcon} style={{ backgroundImage: `url(${fotoPerfilCarregada})` }}></div>
                <p className={styles.textoNome}>{nomeusuarionotificacao}</p>
            </Link>

            <div className={styles.containerTitulo} >
                <Link style={{ textDecoration: 'none' }} href={`/pergunta/${urlpergunta}`} >
                    <p className={styles.textoTituloPergunta}>{textonotificacao}</p>
                </Link>
            </div>


            <div className={styles.containerCurtidasVisuaizacoesCategoriaTempo}>
                <p className={styles.textoCurtidasVisuaizacoesCategoriaTempo}><MdAccessTimeFilled /> <p className={styles.subTexto}>{tempoNotificacao}</p></p>
            </div>
        </div>
    )
}
