const { Router } = require('express');
const router = Router();
const connection = require('../database.js');

const jwt = require('jsonwebtoken');
const jsonkey = '1a6e4d027c15f8b3ea9f81c5720d9c916dfb2549f6ad6d4f2f4a7c07d98e29c1';

router.post('/curtidaResposta', (req, res) => {
    let { token, idresposta, tipocurtida, operacao } = req.body;
    token = jwt.verify(token, jsonkey);
    const idusuario = token.idusuario;

    let dadosCurtida = { idusuario, idresposta, tipocurtida }
    console.log(idresposta)

    if (operacao == 'adicionar') {
        connection.query('INSERT INTO curtidas SET ?', [dadosCurtida], (err, results) => {
            connection.query('UPDATE resposta SET curtidasresposta = curtidasresposta + 1 WHERE idperguntaresposta = ?', [idresposta], (err, results) => {
                connection.query('SELECT curtidasresposta FROM resposta WHERE idperguntaresposta = ?', [idresposta], (err, results) => {
                    res.send(`${results[0].curtidasresposta}`)
                });
            });
        });
    }

    if (operacao == 'remover') {
        connection.query('DELETE FROM curtidas WHERE idresposta = ? AND idusuario = ?', [idresposta, idusuario], (err, results) => {
            connection.query('UPDATE resposta SET curtidasresposta = curtidasresposta - 1 WHERE idperguntaresposta = ?', [idresposta], (err, results) => {
                connection.query('SELECT curtidasresposta FROM resposta WHERE idperguntaresposta = ?', [idresposta], (err, results) => {
                    res.send(`${results[0].curtidasresposta}`)
                });
            });
        });
    }
});

module.exports = router;