import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from '../../styles/profile.module.css';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import calcularTempo from '../../hooks/calcularTempo';
import calcularPontos from '../../hooks/calcularPontos';
import Error from '../../components/error/error';
import useCarregarImagens from '../../hooks/carregarImagens';
import { FaHammer } from "react-icons/fa";
import { SlUserFollow } from "react-icons/sl";
import { SlUserFollowing } from "react-icons/sl";

import PerguntaPerfil from '../../components/PerguntaPerfil/PerguntaPerfil';
import RespostaPerfil from '../../components/RespostaPerfil/RespostaPerfil';
import SeguidorPerfil from '../../components/SeguidorPerfil/SeguidorPerfil';
import Navbar from '../../components/Navbar/Navbar';

export default function Profile() {
    const router = useRouter();
    const observerRef = useRef();

    const [idUsuario, setIdUsuario] = useState('');
    const [extensaoFotoPerfilUsuario, setExtensaoFotoPerfilUsuario] = useState(undefined);
    const [extensaoFotoCapaUsuario, setExtensaoFotoCapaUsuario] = useState(undefined);
    const { fotoPerfilCarregada, fotoCapaCarregada } = useCarregarImagens(idUsuario, extensaoFotoPerfilUsuario, extensaoFotoCapaUsuario);
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [biografiaUsuario, setBiografiaUsuario] = useState('');
    const [dataCadastro, setDataCadastro] = useState('');
    const [pontosTotalUsuario, setPontosTotalUsuario] = useState(0);
    const [pontosProximoNivel, setPontosProximoNivel] = useState(0);

    const [comeco, setComeco] = useState(0);
    const [comeco2, setComeco2] = useState(0);
    const [comeco3, setComeco3] = useState(0);
    const [comeco4, setComeco4] = useState(0);

    const [perguntas, setPerguntas] = useState([]);
    const [respostas, setRespostas] = useState([]);
    const [seguidores, setSeguidores] = useState([]);
    const [seguindo, setSeguindo] = useState([]);
    const [guiaAtivaNome, setGuiaAtivaNome] = useState('Perguntas');
    const [usuarioJaSegue, setUsuarioJaSegue] = useState(false);
    const [donoDoPerfil, setDonoDoPerfil] = useState(false);
    const [nomeUsuario2, setNomeUsuario2] = useState(false);

    const [token, setToken] = useState('');

    useEffect(() => {
        const verificarToken = async () => {
            const token = Cookies.get('askhub');
            if (!token) return router.push('/login');

            const nomeusuario = window.location.pathname.split('/')[2];
            await axios.post('http://localhost:8080/buscarDadosPerfil', { nomeusuario, comeco, token })
                .then(response => {
                    if (!response.data.dadosPerfil) {
                        setNomeUsuario('Usuário não encontrado!');
                    } else {
                        setToken(token)
                        setNomeUsuario(response.data.dadosPerfil.nomeusuario);
                        setPontosProximoNivel(calcularPontos(response.data.dadosPerfil.nivelusuario));
                        setPontosTotalUsuario(response.data.dadosPerfil.pontostotalusuario);
                        setDataCadastro(new Date(response.data.dadosPerfil.datacadastrousuario).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }));
                        setBiografiaUsuario(response.data.dadosPerfil.biografiausuario);
                        setPerguntas(response.data.perguntasUsuario);
                        setRespostas(response.data.respostasUsuario);
                        setSeguidores(response.data.seguidoresUsuario);
                        setSeguindo(response.data.seguindosUsuario);
                        setExtensaoFotoPerfilUsuario(response.data.dadosPerfil.extensaofotoperfilusuario);
                        setExtensaoFotoCapaUsuario(response.data.dadosPerfil.extensaofotocapausuario);
                        setIdUsuario(response.data.dadosPerfil.idusuario);
                        setNomeUsuario2(response.data.nomeUsuario);
                    }
                });
        };
        verificarToken();
    }, []);

    useEffect(() => {
        const verificarDonoPerfil = async () => {
            console.log(seguidores)
            const nomeusuariourl = window.location.pathname.split('/')[2];
            if (nomeusuariourl == nomeUsuario2) setDonoDoPerfil(true);
        };
        if (nomeUsuario2 != '') verificarDonoPerfil();
    }, [nomeUsuario2]);

    useEffect(() => {
        const carregarMaisPerguntas = async () => {
            setComeco2(0);
            setComeco3(0);
            setComeco4(0);
            await axios.post('http://localhost:8080/buscarMaisPerguntas', { nomeUsuario, comeco })
                .then(response => {
                    setPerguntas(prevPerguntas => [...prevPerguntas, ...response.data]);
                });
        };
        if (comeco != 0) carregarMaisPerguntas();
    }, [comeco]);

    useEffect(() => {
        const carregarMaisRespostas = async () => {
            setComeco(0);
            setComeco3(0);
            setComeco4(0);
            console.log('comeco2' + comeco2)
            await axios.post('http://localhost:8080/buscarMaisRespostas', { nomeUsuario, comeco2 })
                .then(response => {
                    console.log(response.data)
                    setRespostas(prevRespostas => [...prevRespostas, ...response.data]);
                });
        };
        if (comeco2 != 0) carregarMaisRespostas();
    }, [comeco2]);

    useEffect(() => {
        const carregarMaisSeguidores = async () => {
            setComeco(0);
            setComeco2(0);
            setComeco4(0);
            await axios.post('http://localhost:8080/carregarMaisSeguidores', { nomeUsuario, comeco3 })
                .then(response => {
                    setRespostas(prevRespostas => [...prevRespostas, ...response.data]);
                });
        };
        if (comeco3 != 0) carregarMaisSeguidores();
    }, [comeco3]);

    useEffect(() => {
        const carregarMaisSeguindo = async () => {
            setComeco(0);
            setComeco2(0);
            setComeco3(0);
            await axios.post('http://localhost:8080/carregarMaisSeguindo', { nomeUsuario, comeco4 })
                .then(response => {
                    setRespostas(prevRespostas => [...prevRespostas, ...response.data]);
                });
        };
        if (comeco4 != 0) carregarMaisSeguindo();
    }, [comeco4]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                console.log(guiaAtivaNome)
                if (entries[0].isIntersecting && guiaAtivaNome == 'Perguntas') {
                    setComeco(prevComeco => prevComeco + 15);
                    console.log(usuarioJaSegue)
                }
                if (entries[0].isIntersecting && guiaAtivaNome == 'Respostas') {
                    setComeco2(prevComeco2 => prevComeco2 + 15);
                }
                if (entries[0].isIntersecting && guiaAtivaNome == 'Seguidores') {
                    setComeco3(prevComeco3 => prevComeco3 + 15);
                }
                if (entries[0].isIntersecting && guiaAtivaNome == 'Seguindo') {
                    setComeco3(prevComeco4 => prevComeco4 + 15);
                }
            }, { threshold: 1 });
        if (observerRef.current) observer.observe(observerRef.current);
        return () => { if (observerRef.current) observer.unobserve(observerRef.current) };
    }, [guiaAtivaNome]);

    useEffect(() => {
        const verficarUsuarioJaSegue = async () => {
            await axios.post('http://localhost:8080/verificarUsuarioJaSegue', { token, nomeUsuario })
                .then(response => { response.data ? setUsuarioJaSegue(true) : setUsuarioJaSegue(false) })
        };
        if (nomeUsuario != '') verficarUsuarioJaSegue();
    }, [nomeUsuario]);

    const handleSeguir = async () => {
        if (usuarioJaSegue){
            await axios.post('http://localhost:8080/removerSeguida', { token, nomeUsuario })
            .then(response => {
                setUsuarioJaSegue(false);
            });
        }else{
            await axios.post('http://localhost:8080/adicionarSeguida', { token, nomeUsuario })
            .then(response => {
                setUsuarioJaSegue(true);
            });
        }
    };

    return (
        nomeUsuario != 'Usuário não encontrado!' ? (
            <section className={styles.mainContainer}>
                <Navbar />
                <div className={styles.containerProfile}>

                    <div className={styles.containerBanner} style={{ backgroundImage: `url(${fotoCapaCarregada})` }}>
                        <div className={styles.containerIcon} style={{ backgroundImage: `url(${fotoPerfilCarregada})` }}></div>
                    </div>

                    <div className={styles.containerInformacoes}>
                        <p className={styles.textoNome}>{nomeUsuario}</p>


                        <div className={styles.containerMedalha}>
                            <FaHammer className={styles.medalha} />
                            <p>Desenvolvedor</p>
                        </div>

                        {donoDoPerfil ? (
                            null
                        ) : <div className={styles.containerMedalha} onClick={handleSeguir}>
                            {usuarioJaSegue ? (
                                <>
                                    <SlUserFollowing className={styles.medalha} />
                                    <p>Seguindo</p>
                                </>
                            ) :
                                <>
                                    <SlUserFollow className={styles.medalha} />
                                    <p>Seguir</p>
                                </>
                            }
                        </div>
                        }
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
                        <p className={styles.textoDataCadastro}>Membro desde {dataCadastro}</p>
                    </div>

                    <div className={styles.containerGuias}>
                        <div onClick={() => setGuiaAtivaNome('Perguntas')} className={guiaAtivaNome === 'Perguntas' ? styles.guiaSelecionada : styles.guiaPerguntas}>Perguntas</div>
                        <div onClick={() => setGuiaAtivaNome('Respostas')} className={guiaAtivaNome === 'Respostas' ? styles.guiaSelecionada : styles.guiaPerguntas}>Respostas</div>
                        <div onClick={() => setGuiaAtivaNome('Seguidores')} className={guiaAtivaNome === 'Seguidores' ? styles.guiaSelecionada : styles.guiaPerguntas}>Seguidores</div>
                        <div onClick={() => setGuiaAtivaNome('Seguindo')} className={guiaAtivaNome === 'Seguindo' ? styles.guiaSelecionada : styles.guiaPerguntas}>Seguindo</div>
                    </div>

                    <div className={styles.containerAtividades}>
                        {guiaAtivaNome === 'Perguntas' && (
                            perguntas.map(pergunta => (
                                <PerguntaPerfil key={pergunta.idpergunta} tempopergunta={pergunta.tempopergunta} titulopergunta={pergunta.titulopergunta} numerorespostas={pergunta.numerorespostaspergunta} urlpergunta={pergunta.urlpergunta} />
                            ))
                        )}

                        {guiaAtivaNome === 'Respostas' && (
                            respostas.map(resposta => (
                                <RespostaPerfil key={resposta.idresposta} temporesposta={resposta.temporesposta} textoresposta={resposta.textoresposta} numerocomentarios={resposta.numerocomentariosresposta} urlpergunta={resposta.urlpergunta} />
                            ))
                        )}

                        {guiaAtivaNome === 'Seguidores' && seguidores && (
                            seguidores.map(seguidor => (
                                <SeguidorPerfil key={seguidor.idusuarioseguidor} idusuario={seguidor.idusuario} nomeusuario={seguidor.nomeusuario} extensaofotoperfilusuario={seguidor.extensaofotoperfilusuario} />
                            ))
                        )}
                        {guiaAtivaNome === 'Seguindo' && seguindo && (
                            seguindo.map(seguinddor => (
                                <SeguidorPerfil key={seguinddor.idusuarioseguidor} idusuario={seguinddor.idusuario} nomeusuario={seguinddor.nomeusuario} extensaofotoperfilusuario={seguinddor.extensaofotoperfilusuario} />
                            ))
                        )}
                    </div>
                    <div ref={observerRef}></div>
                </div>
            </section>
        ) : (<Error />)
    )
}