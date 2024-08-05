const { Router } = require('express');
const router = Router();
const connection = require('../database.js');

const jwt = require('jsonwebtoken');
const jsonkey = '1a6e4d027c15f8b3ea9f81c5720d9c916dfb2549f6ad6d4f2f4a7c07d98e29c1';

const niveis = require('./niveis.json');

function removerAcentos(texto) {
    return texto
        .normalize('NFD') // Normaliza caracteres Unicode com decomposição
        .replace(/[\u0300-\u036f]/g, '') // Remove caracteres de acentuação
        .replace(/[^\w\s]|_/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/ç/g, 'c'); // Substitui "ç" por "c"
}

router.post('/postarPergunta', (req, res) => {
    let { token, tituloPergunta, descricaoPergunta, categoriaPergunta } = req.body;
    token = jwt.verify(token, jsonkey);
    const idusuario = token.idusuario;
    let nomeusuariopergunta;
    let extensaofotoperfilusuario;
    let extensaofotocapausuario;

    connection.query('SELECT nomeusuario, extensaofotoperfilusuario, extensaofotocapausuario FROM dadosusuario WHERE idusuario = ?', [idusuario], (err, results) => {
        nomeusuariopergunta = results[0].nomeusuario;
        extensaofotoperfilusuario = results[0].extensaofotoperfilusuario;
        extensaofotocapausuario = results[0].extensaofotocapausuario;
    });

    connection.query('SELECT COUNT(*) AS contagemPerguntas FROM pergunta', (error, results) => {
        const idpergunta = results[0].contagemPerguntas + 1;
        const tituloSemAcentos = removerAcentos(tituloPergunta.toLowerCase());
        const urlpergunta = `${idpergunta}-${tituloSemAcentos}`;
        const idusuariopergunta = idusuario;
        const titulopergunta = tituloPergunta;
        const descricaopergunta = descricaoPergunta;
        const categoriapergunta = categoriaPergunta

        let dadosPergunta = { idpergunta, idusuariopergunta, nomeusuariopergunta, titulopergunta, descricaopergunta, categoriapergunta, urlpergunta, extensaofotoperfilusuario, extensaofotocapausuario };
        connection.query('INSERT INTO pergunta SET ?', [dadosPergunta], (err, result) => {
            connection.query('UPDATE dadosusuario SET pontostotalusuario = pontostotalusuario + 20 WHERE idusuario = ?', [idusuario], (err, results) => {
                connection.query('SELECT pontostotalusuario, nivelusuario FROM dadosusuario WHERE idusuario = ?', [idusuario], (err, results) => {
                    pontostotalusuario = results[0].pontostotalusuario;
                    nivelusuario = results[0].nivelusuario;

                    for (let nivel in niveis) {
                        if (pontostotalusuario >= niveis[nivel]) {
                            nivelusuario = parseInt(nivel);
                            connection.query('UPDATE dadosusuario SET nivelusuario = ? WHERE idusuario = ?', [nivelusuario, idusuario], (err, results) => {});
                        }
                    }
                })
            });
        });

        res.send(urlpergunta);
    });
});

module.exports = router;