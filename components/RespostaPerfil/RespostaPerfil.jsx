import styles from './RespostaPerfil.module.css';
import calcularTempo from '../../hooks/calcularTempo';
import Link from 'next/link';


export default function RespostaPerfil({ temporesposta, textoresposta, numerocomentarios, urlpergunta }) {
    let tempoResposta = calcularTempo(temporesposta);
    
    return (
        <div className={styles.containerPerguntaPerfil}>
            <Link className={styles.textoPergunta} href={`/pergunta/${urlpergunta}`}><p>{textoresposta}</p></Link>
            <div className={styles.tempoResposta}>
                <p>{numerocomentarios} comentários</p>
                <p>{tempoResposta}</p>
            </div>
        </div>
    )
}
