import React, { useState, useEffect, useRef} from 'react';
import axios from 'axios';
import styles from '../../styles/profile.module.css';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import calcularTempo from '../../hooks/calcularTempo';
import calcularPontos from '../../hooks/calcularPontos';
import Error from '../../components/error/error';
import useCarregarImagens from '../../hooks/carregarImagens';
import { FaHammer } from "react-icons/fa";

import PerguntaPerfil from '../../components/PerguntaPerfil/PerguntaPerfil';
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
    const [perguntas, setPerguntas] = useState([]);

    useEffect(() => {
        const verificarToken = async () => {
            const token = Cookies.get('askhub');
            if (!token) return router.push('/login');

            const nomeusuario = window.location.pathname.split('/')[2];
            await axios.post('http://localhost:8080/buscarDadosPerfil', {nomeusuario, comeco})
            .then(response =>{
                if (!response.data.dadosPerfil){
                    setNomeUsuario('Usuário não encontrado!');
                }else {
                    setNomeUsuario(response.data.dadosPerfil.nomeusuario);
                    setPontosProximoNivel(calcularPontos(response.data.dadosPerfil.nivelusuario));
                    setPontosTotalUsuario(response.data.dadosPerfil.pontostotalusuario);
                    setDataCadastro(new Date(response.data.dadosPerfil.datacadastrousuario).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }));
                    setBiografiaUsuario(response.data.dadosPerfil.biografiausuario);
                    setPerguntas(response.data.perguntasUsuario);
                    setExtensaoFotoPerfilUsuario(response.data.dadosPerfil.extensaofotoperfilusuario);
                    setExtensaoFotoCapaUsuario(response.data.dadosPerfil.extensaofotocapausuario);
                    setIdUsuario(response.data.dadosPerfil.idusuario);
                } 
            });
        };
        verificarToken();
    }, []);

    useEffect(() => {
        const carregarMaisPerguntas = async () => {
            console.log(comeco);
            await axios.post('http://localhost:8080/buscarMaisPerguntas', {nomeUsuario, comeco})
            .then(response =>{
                setPerguntas(prevPerguntas => [...prevPerguntas, ...response.data]);
            });
        };
        if (comeco != 0) carregarMaisPerguntas();
    }, [comeco]); 

    useEffect(() => {
        const observer = new IntersectionObserver(
          entries => {if (entries[0].isIntersecting) setComeco(prevComeco => prevComeco + 15);}, { threshold: 1 });
        if (observerRef.current) observer.observe(observerRef.current);
        return () => {if (observerRef.current)  observer.unobserve(observerRef.current)};
      }, []);

    const [guiaAtivaNome, setGuiaAtivaNome] = useState('Perguntas');

    return (
        nomeUsuario != 'Usuário não encontrado!' ? (
        <section className={styles.mainContainer}>
            <Navbar />
            <div className={styles.containerProfile}>

                <div className={styles.containerBanner} style={{ backgroundImage: `url(${fotoCapaCarregada})`}}>
                    <div className={styles.containerIcon} style={{ backgroundImage: `url(${fotoPerfilCarregada})`}}></div>
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
                    <p className={styles.textoDataCadastro}>Membro desde {dataCadastro}</p>
                </div>

                <div className={styles.containerGuias}>
                    <div onClick={() => setGuiaAtivaNome('Perguntas')} className={guiaAtivaNome === 'Perguntas' ? styles.guiaSelecionada : styles.guiaPerguntas}>Perguntas</div>
                    <div onClick={() => setGuiaAtivaNome('Respostas')} className={guiaAtivaNome === 'Respostas' ? styles.guiaSelecionada : styles.guiaPerguntas}>Respostas</div>
                    <div onClick={() => setGuiaAtivaNome('Seguidores')} className={guiaAtivaNome === 'Seguidores' ? styles.guiaSelecionada : styles.guiaPerguntas}>Seguidores</div>
                    <div onClick={() => setGuiaAtivaNome('Seguindo')} className={guiaAtivaNome === 'Seguindo' ? styles.guiaSelecionada : styles.guiaPerguntas}>Seguindo</div>
                </div>

                <div className={styles.containerAtividades}>
                {perguntas.map(pergunta => (
                    <PerguntaPerfil key={pergunta.idpergunta} tempopergunta={pergunta.tempopergunta} titulopergunta={pergunta.titulopergunta} numerorespostas={pergunta.numerorespostaspergunta} urlpergunta={pergunta.urlpergunta}/>
                ))}
                </div>
                <div ref={observerRef}></div>
            </div>
        </section>
        ) : (<Error />)
    )
}