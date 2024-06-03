import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/profile.module.css';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import calcularTempo from '../../hooks/calcularTempo';
import calcularPontos from '../../hooks/calcularPontos';

import { FaMedal } from "react-icons/fa";
import { GrConfigure } from "react-icons/gr";
import { FaHammer } from "react-icons/fa";

import PerguntaPerfil from '../../components/PerguntaPerfil/PerguntaPerfil';

export default function Profile() {
    const router = useRouter();

    const [nomeUsuario, setNomeUsuario] = useState('');
    const [biografiaUsuario, setBiografiaUsuario] = useState('');
    const [dataCadastro, setDataCadastro] = useState('');
    const [pontosTotalUsuario, setPontosTotalUsuario] = useState(0);
    const [pontosProximoNivel, setPontosProximoNivel] = useState(0);

    useEffect(() => {
        const verificarToken = async () => {
            const token = Cookies.get('askhub');
            if (!token) return router.push('/login');

            const username = window.location.pathname.split('/')[2];
            await axios.post('http://localhost:8080/buscarDadosPerfil', {username})
            .then(response =>{
                setPontosProximoNivel(calcularPontos(response.data.nivelusuario))
                setNomeUsuario(response.data.nomeusuario);
                setDataCadastro(new Date(response.data.datacadastrousuario).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }));
                setBiografiaUsuario(response.data.biografiausuario);
                setPontosTotalUsuario(response.data.pontostotalusuario);
            });
        };
        verificarToken();
    }, []);

    const [guiaAtivaNome, setGuiaAtivaNome] = useState('Perguntas');

    return (
        <section className={styles.mainContainer}>
            <div className={styles.containerProfile}>

                <div className={styles.containerBanner}>
                    <div className={styles.containerIcon}></div>
                </div>

                <div className={styles.containerInformacoes}>
                    <p className={styles.textoNome}>{nomeUsuario}</p>
      

                    <div className={styles.containerMedalha}>
                        <FaHammer  className={styles.medalha} />
                        <p>Desenvolvedor</p>
                    </div>

                </div>

                <div className={styles.containerInformacoes2}>
                    <div className={styles.containerBarraExperiencia}>
                        <div className={styles.barraExperiencia}></div>

                    </div>
                    <p className={styles.textoExperiencia}>{pontosTotalUsuario}/{pontosProximoNivel} | 0%</p>
                </div>

                <div className={styles.containerBiografia}>
                    <p className={styles.textoBiografia}>{biografiaUsuario}</p>
                </div>

                <div className={styles.containerBiografia}>
                    <p className={styles.textoBiografia}>Membro desde {dataCadastro}</p>
                </div>


                <div className={styles.linhaHorizontal}></div>

                <div className={styles.containerGuias}>
                    <div onClick={() => setGuiaAtivaNome('Perguntas')} className={guiaAtivaNome === 'Perguntas' ? styles.guiaSelecionada : styles.guiaPerguntas}>Perguntas</div>
                    <div onClick={() => setGuiaAtivaNome('Respostas')} className={guiaAtivaNome === 'Respostas' ? styles.guiaSelecionada : styles.guiaPerguntas}>Respostas</div>
                    <div onClick={() => setGuiaAtivaNome('Seguidores')} className={guiaAtivaNome === 'Seguidores' ? styles.guiaSelecionada : styles.guiaPerguntas}>Seguidores</div>
                    <div onClick={() => setGuiaAtivaNome('Seguindo')} className={guiaAtivaNome === 'Seguindo' ? styles.guiaSelecionada : styles.guiaPerguntas}>Seguindo</div>
                </div>

                <div className={styles.containerAtividades}>
                    <PerguntaPerfil />
                    <PerguntaPerfil />
                </div>
            </div>
        </section>
    )
}