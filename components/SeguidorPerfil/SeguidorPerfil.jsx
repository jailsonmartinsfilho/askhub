import styles from './SeguidorPerfil.module.css';
import useCarregarImagens from '../../hooks/carregarImagens';

export default function SeguidorPerfil({ idusuario, nomeusuario, extensaofotoperfilusuario }) {
    const { fotoPerfilCarregada, fotoCapaCarregada } = useCarregarImagens(idusuario, extensaofotoperfilusuario);

    return (
        <div className={styles.containerPerguntaPerfil}>
            <a className={styles.containerFotoNome} onClick={() => window.location.href = `/profile/${nomeusuario}`}>       
                <div className={styles.containerIcon} style={{ backgroundImage: `url(${fotoPerfilCarregada})` }}></div>
                <p className={styles.textoNome}>{nomeusuario}</p>         
            </a>
        </div>
    )
}
