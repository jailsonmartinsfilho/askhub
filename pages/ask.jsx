import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/ask.module.css';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Link from 'next/link';

const categorias = ['Culinária', 'Música', 'Filosofia', 'Saúde e bem-estar', 'Relacionamentos', 'Jogos, Séries, Filmes, Animes', 'Política', 'Curiosidades e Fatos Interessantes', 'Empreendedorismo e Economia', 'Estudos', 'Dia a dia'];

export default function Cadastro() {
    const router = useRouter();

    useEffect(() => {
        const verificarToken = async () => {
            const token = Cookies.get('askhub');
            if (!token) return router.push('/login');
            setToken(token)
        };
        verificarToken();
    }, []);

    const [mensagemErro, setMensagemErro] = useState('');
    const [tituloPergunta, setTituloPergunta] = useState('');
    const [descricaoPergunta, setDescricaoPergunta] = useState('');
    const [categoriaPergunta, setCategoriaPergunta] = useState('Geral');
    const [token, setToken] = useState('');

    const validarPostagem = ({ tituloPergunta }) => {
        if (tituloPergunta.length < 6) return setMensagemErro('O título da pergunta é muito curto!');
        setMensagemErro('')
        return '';
    };

    useEffect(() => {
        validarPostagem({ tituloPergunta });
    }, [tituloPergunta]);

    const postarPergunta = async (event) => {
        const errorMessage = validarPostagem({ tituloPergunta });
        if (errorMessage != '') return;
        
        await axios.post('http://localhost:8080/postarPergunta', { token, tituloPergunta, descricaoPergunta, categoriaPergunta })
            .then(response => {
                console.log(response.data)
                // return router.push('/profile');
            });
    }

    return (
        <section className={styles.mainContainer}>
            <section className={styles.centralContainer}>
                <div className={styles.cadastroContainer}>
                    <h1 className={styles.tituloPergunta}>Postar uma pergunta</h1>
                    <div className={styles.inputsContainer}>

                        <div className={styles.inputContainer}>
                            <input value={tituloPergunta} onChange={(event) => { setTituloPergunta(event.target.value) }} className={styles.input} type="text" id="nome" name="nome" placeholder='Faça uma pergunta ou diga algo que está pensando...' maxLength={150} pattern="[A-Za-z0-9]+" />

                            <textarea value={descricaoPergunta} onChange={(event) => { setDescricaoPergunta(event.target.value) }} className={styles.textarea} placeholder="Detalhe sobre o assunto aqui, caso seja necessário..." maxLength={2000} />
                        </div>

                        <div className={styles.mensagemErro}>{mensagemErro}</div>

                        <div className={styles.selectContainer}>
                            <label className={styles.categoriaTexto} htmlFor="categorias">Categoria</label>
                            <select className={styles.select} id="categorias" onChange={(event) => { setCategoriaPergunta(event.target.value)}} value={categoriaPergunta}>
                                <option value="">Geral</option>
                                {categorias.map((categoria, index) => (
                                    <option key={index} value={categoria}>{categoria}</option>
                                ))}
                            </select>
                        </div>

                        <button onClick={postarPergunta} className={mensagemErro == '' ? styles.buttonCadastrar : styles.buttonCadastrarOff}>Postar</button>
                    </div>
                </div>
            </section>
        </section>
    )
}