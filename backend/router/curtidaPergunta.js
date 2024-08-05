const { Router } = require('express');
const router = Router();
const connection = require('../database.js');

const jwt = require('jsonwebtoken');
const jsonkey = '1a6e4d027c15f8b3ea9f81c5720d9c916dfb2549f6ad6d4f2f4a7c07d98e29c1';

router.post('/curtidaPergunta', (req, res) => {
    let { token, idpergunta, tipocurtida, operacao } = req.body;
    token = jwt.verify(token, jsonkey);
    const idusuario = token.idusuario;

    let dadosCurtida = { idusuario, idpergunta, tipocurtida }

    if (operacao == 'adicionar') {
        connection.query('INSERT INTO curtidas SET ?', [dadosCurtida], (err, results) => {
            connection.query('UPDATE pergunta SET curtidaspergunta = curtidaspergunta + 1 WHERE idpergunta = ?', [idpergunta], (err, results) => {
                connection.query('SELECT curtidaspergunta FROM pergunta WHERE idpergunta = ?', [idpergunta], (err, results) => {
                    res.send(`${results[0].curtidaspergunta}`)
                });
            });
        });
    }

    if (operacao == 'remover') {
        connection.query('DELETE FROM curtidas WHERE idpergunta = ? AND idusuario = ?', [idpergunta, idusuario], (err, results) => {
            connection.query('UPDATE pergunta SET curtidaspergunta = curtidaspergunta - 1 WHERE idpergunta = ?', [idpergunta], (err, results) => {
                connection.query('SELECT curtidaspergunta FROM pergunta WHERE idpergunta = ?', [idpergunta], (err, results) => {
                    res.send(`${results[0].curtidaspergunta}`)
                });
            });
        });
    }
});

module.exports = router;