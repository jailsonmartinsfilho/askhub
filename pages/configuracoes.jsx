import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/configuracoes.module.css';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function Profile() {
    const router = useRouter();

    const [nomeUsuario, setNomeUsuario] = useState('');
    const [pronomesUsuario, setPronomesUsuario] = useState('');
    const [biografiaUsuario, setBiografiaUsuario] = useState('');

    const [alteradoNomeUsuario, setAlteradoNomeUsuario] = useState('');
    const [alteradoPronomesUsuario, setAlteradoPronomesUsuario] = useState('');
    const [alteradoBiografiaUsuario, setAlteradoBiografiaUsuario] = useState('');

    const [dadosAlterados, setDadosAlterados] = useState('');

    useEffect(() => {
        const verificarToken = async () => {
            const token = Cookies.get('askhub');
            if (!token) return router.push('/login');

            await axios.post('http://localhost:8080/buscarDadosConfiguracoes', { token })
                .then(response => {
                    setNomeUsuario(response.data.nomeusuario);
                    setPronomesUsuario(response.data.pronomesusuario || '');
                    setBiografiaUsuario(response.data.biografiausuario);

                    setAlteradoNomeUsuario(response.data.nomeusuario);
                    setAlteradoPronomesUsuario(response.data.pronomesusuario || '');
                    setAlteradoBiografiaUsuario(response.data.biografiausuario);
                });
        };
        verificarToken();
    }, []);

    useEffect(() => {
        const atualizarDados = async () => {
            const dadosAlterados = {};
            if (alteradoNomeUsuario !== nomeUsuario) dadosAlterados.nomeusuario = alteradoNomeUsuario;
            if (alteradoPronomesUsuario !== pronomesUsuario) dadosAlterados.pronomesusuario = alteradoPronomesUsuario;
            if (alteradoBiografiaUsuario !== biografiaUsuario) dadosAlterados.biografiausuario = alteradoBiografiaUsuario;
            setDadosAlterados(dadosAlterados);
        };
        atualizarDados();
    }, [alteradoNomeUsuario, alteradoPronomesUsuario, alteradoBiografiaUsuario]);

    const salvarDados = async () => {
        if (Object.keys(dadosAlterados).length > 0) {
            await axios.post('http://localhost:8080/atualizarDados', dadosAlterados);
        }
    };

    return (
        <section className={styles.mainContainer}>
            <div className={styles.containerProfile}>
                <h1 className={styles.tituloConfiguracoes}>Configurações da conta</h1>

                <div className={styles.linhaHorizontal}></div>

                <div className={styles.particaoConfiguracao}>
                    <h2 className={styles.subTitulos}>Nome de usuário</h2>
                    <div>
                        <input className={styles.informacoes} value={alteradoNomeUsuario} onChange={(event) => { setAlteradoNomeUsuario(event.target.value) }} maxLength={20} />
                    </div>
                </div>

                <div className={styles.particaoConfiguracao}>
                    <h2 className={styles.subTitulos}>Pronomes</h2>
                    <div>
                        <input className={styles.informacoes} value={alteradoPronomesUsuario} onChange={(event) => { setAlteradoPronomesUsuario(event.target.value) }} maxLength={20} />
                    </div>
                </div>


                <div className={styles.particaoConfiguracao}>
                    <h2 className={styles.subTitulos}>Biografia</h2>
                    <div>
                        <textarea className={styles.informacoesBiografia} autoFocus={false} value={alteradoBiografiaUsuario} onChange={(event) => { setAlteradoBiografiaUsuario(event.target.value) }} maxLength={4000} />
                    </div>
                </div>

                <div className={styles.particaoConfiguracao}>
                    <h2 className={styles.subTitulos}>Foto do perfil</h2>
                    <div className={styles.containerContainerFotoPerfil}>
                        <div className={styles.containerFotoPerfil}></div>
                    </div>
                </div>

                <div className={styles.particaoConfiguracao}>
                    <h2 className={styles.subTitulos}>Foto da capa</h2>
                    <div className={styles.containerContainerFotoCapa}>
                        <div className={styles.containerFotoCapa}></div>
                    </div>
                </div>
                <button onClick={salvarDados} className={Object.keys(dadosAlterados).length > 0 ? styles.buttonCadastrar : styles.buttonCadastrarOff}>Salvar</button>
            </div>
        </section>
    )
}