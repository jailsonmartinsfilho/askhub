import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/configuracoes.module.css';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import useCarregarImagens from '../hooks/carregarImagens';

export default function Configuracoes() {
    const router = useRouter();
    
    const [token, setToken] = useState('');
    const [idUsuario, setIdUsuario] = useState('');
    const { fotoPerfilCarregada, fotoCapaCarregada } = useCarregarImagens(idUsuario);
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [pronomesUsuario, setPronomesUsuario] = useState('');
    const [biografiaUsuario, setBiografiaUsuario] = useState('');
    const [fotoPerfil, setFotoPerfil] = useState('');
    const [fotoCapa, setFotoCapa] = useState('');

    const [alteradoNomeUsuario, setAlteradoNomeUsuario] = useState('');
    const [alteradoPronomesUsuario, setAlteradoPronomesUsuario] = useState('');
    const [alteradoBiografiaUsuario, setAlteradoBiografiaUsuario] = useState('');
    const [alteradoFotoPerfil, setAlteradoFotoPerfil] = useState('');
    const [alteradoFotoCapa, setAlteradoFotoCapa] = useState('');

    const [dadosAlterados, setDadosAlterados] = useState({});

    useEffect(() => {
        const verificarToken = async () => {
            const token = Cookies.get('askhub');
            if (!token) return router.push('/login');

            await axios.post('http://localhost:8080/buscarDadosConfiguracoes', { token })
                .then(response => {
                    setIdUsuario(response.data.idusuario);
                    setNomeUsuario(response.data.nomeusuario);
                    setPronomesUsuario(response.data.pronomesusuario || '');
                    setBiografiaUsuario(response.data.biografiausuario);

                    setAlteradoNomeUsuario(response.data.nomeusuario);
                    setAlteradoPronomesUsuario(response.data.pronomesusuario || '');
                    setAlteradoBiografiaUsuario(response.data.biografiausuario);
                    setToken(token);
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
            dadosAlterados.token = token
            setDadosAlterados(dadosAlterados);
        };
        atualizarDados();
    }, [alteradoNomeUsuario, alteradoPronomesUsuario, alteradoBiografiaUsuario]);

    const salvarDados = async () => {
        if (Object.keys(dadosAlterados).length > 1 || alteradoFotoPerfil != '' || alteradoFotoCapa != '') {
            const formData = new FormData();
            if (alteradoFotoPerfil != '') formData.append('fotoperfil', fotoPerfil);
            if (alteradoFotoCapa != '') formData.append('fotocapa', fotoCapa);

            for (const key in dadosAlterados) {
                formData.append(key, dadosAlterados[key]);
            }

            await axios.post('http://localhost:8080/atualizarDados', formData)
                .then(response => {
                    // window.location.reload();
                    return router.push(`/profile/${alteradoNomeUsuario}`);
                });

        }
    };

    const mudarFotoPerfil = (event, setAlteradoFotoPerfil, setFotoPerfil) => {
        const file = event.target.files[0];
        if (file) {
            setFotoPerfil(file)
            setAlteradoFotoPerfil(URL.createObjectURL(file));
        }
    };

    const mudarFotoCapa = (event, setAlteradoFotoCapa, setFotoCapa) => {
        const file = event.target.files[0];
        if (file) {
            setFotoCapa(file)
            setAlteradoFotoCapa(URL.createObjectURL(file));
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
                        <div className={styles.containerFotoPerfil} style={{ backgroundImage: `url(${fotoPerfilCarregada})` }}></div>
                    </div>
                    <input type="file" onChange={(event) => mudarFotoPerfil(event, setAlteradoFotoPerfil, setFotoPerfil)} />
                </div>

                <div className={styles.particaoConfiguracao}>
                    <h2 className={styles.subTitulos}>Foto da capa</h2>
                    <div className={styles.containerContainerFotoCapa}>
                        <div className={styles.containerFotoCapa} style={{ backgroundImage: `url(${fotoCapaCarregada})` }}></div>
                    </div>
                    <input type="file" onChange={(event) => mudarFotoCapa(event, setAlteradoFotoCapa, setFotoCapa)} />
                </div>
                <button onClick={salvarDados} className={Object.keys(dadosAlterados).length > 1 || alteradoFotoPerfil != '' || alteradoFotoCapa != '' ? styles.buttonCadastrar : styles.buttonCadastrarOff}>Salvar</button>
            </div>
        </section>
    )
}