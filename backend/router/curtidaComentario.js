const { Router } = require('express');
const router = Router();
const connection = require('../database.js');

const jwt = require('jsonwebtoken');
const jsonkey = '1a6e4d027c15f8b3ea9f81c5720d9c916dfb2549f6ad6d4f2f4a7c07d98e29c1';

router.post('/curtidaComentario', (req, res) => {
    let { token, idcomentario, tipocurtida, operacao } = req.body;
    token = jwt.verify(token, jsonkey);
    const idusuario = token.idusuario;

    let dadosCurtida = { idusuario, idcomentario, tipocurtida }

    if (operacao == 'adicionar') {
        connection.query('INSERT INTO curtidas SET ?', [dadosCurtida], (err, results) => {
            connection.query('UPDATE comentario SET curtidascomentario = curtidascomentario + 1 WHERE idperguntarespostacomentario = ?', [idcomentario], (err, results) => {
                connection.query('SELECT curtidascomentario FROM comentario WHERE idperguntarespostacomentario = ?', [idcomentario], (err, results) => {
                    res.send(`${results[0].curtidascomentario}`)
                });
            });
        });
    }

    if (operacao == 'remover') {
        connection.query('DELETE FROM curtidas WHERE idcomentario = ? AND idusuario = ?', [idcomentario, idusuario], (err, results) => {
            connection.query('UPDATE comentario SET curtidascomentario = curtidascomentario - 1 WHERE idperguntarespostacomentario = ?', [idcomentario], (err, results) => {
                connection.query('SELECT curtidascomentario FROM comentario WHERE idperguntarespostacomentario = ?', [idcomentario], (err, results) => {
                    res.send(`${results[0].curtidascomentario}`)
                });
            });
        });
    }
});

module.exports = router;