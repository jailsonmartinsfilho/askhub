import styles from './SeguidorPerfil.module.css';
import Link from 'next/link';
import useCarregarImagens from '../../hooks/carregarImagens';

export default function SeguidorPerfil({ idusuario, nomeusuario, extensaofotoperfilusuario }) {
    console.log('waaaaaa')
    const { fotoPerfilCarregada, fotoCapaCarregada } = useCarregarImagens(idusuario, extensaofotoperfilusuario);
    console.log('waaaaaa')

    return (
        <div className={styles.containerPerguntaPerfil}>
            <a className={styles.containerFotoNome} onClick={() => window.location.href = `/profile/${nomeusuario}`}>       
                <div className={styles.containerIcon} style={{ backgroundImage: `url(${fotoPerfilCarregada})` }}></div>
                <p className={styles.textoNome}>{nomeusuario}</p>         
            </a>
        </div>
    )
}
