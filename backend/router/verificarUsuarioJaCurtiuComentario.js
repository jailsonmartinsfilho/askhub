const { Router } = require('express');
const router = Router();
const connection = require('../database.js');

const jwt = require('jsonwebtoken');
const jsonkey = '1a6e4d027c15f8b3ea9f81c5720d9c916dfb2549f6ad6d4f2f4a7c07d98e29c1';

router.post('/verificarUsuarioJaCurtiuComentario', (req, res) => {
    let {token, idperguntarespostacomentario, tipocurtida} = req.body;
    token = jwt.verify(token, jsonkey);
    let idusuario = token.idusuario;

    connection.query('SELECT * FROM curtidas WHERE idcomentario = ? AND idusuario = ? AND tipocurtida = ?', [idperguntarespostacomentario, idusuario, tipocurtida], (err, results) => {
        results.length > 0 ? res.send(true) : res.send(false);
    });
});

module.exports = router;