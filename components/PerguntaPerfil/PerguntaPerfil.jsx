import styles from './PerguntaPerfil.module.css';
import calcularTempo from '../../hooks/calcularTempo';
import Link from 'next/link';


export default function PerguntaPerfil({ tempopergunta, titulopergunta, numerorespostas, urlpergunta }) {
    let tempoPergunta = calcularTempo(tempopergunta);
    
    return (
        <div className={styles.containerPerguntaPerfil}>
            <Link className={styles.textoPergunta} href={`/pergunta/${urlpergunta}`}><p>{titulopergunta}</p></Link>
            <div className={styles.tempoResposta}>
                <p>{numerorespostas} respostas</p>
                <p>{tempoPergunta}</p>
            </div>
        </div>
    )
}
