import styles from './PerguntaPerfil.module.css';

export default function PerguntaPerfil() {
    return (
        <div className={styles.containerPerguntaPerfil}>
            <p className={styles.textoPergunta}>No frio você dorme de dddddddddddddddddddddroupa ou igual no calor ou clima mais ou menos?</p>
            <div className={styles.tempoResposta}>
                <p>1 hora atrás</p>
                <p>0 respostas</p>
            </div>
        </div>
    )
}