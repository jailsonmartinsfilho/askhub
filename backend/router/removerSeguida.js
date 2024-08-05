const { Router } = require('express');
const router = Router();
const connection = require('../database.js');

const jwt = require('jsonwebtoken');
const jsonkey = '1a6e4d027c15f8b3ea9f81c5720d9c916dfb2549f6ad6d4f2f4a7c07d98e29c1';

router.post('/removerSeguida', (req, res) => {
    let { token, nomeUsuario } = req.body;
    token = jwt.verify(token, jsonkey);
    const idusuario = token.idusuario;

    let idusuarioseguidor;
    let idusuarioseguido;

    connection.query('SELECT idusuario FROM dadosusuario WHERE nomeusuario = ?', [nomeUsuario], (err, results) => {
        idusuarioseguido = results[0].idusuario;
        idusuarioseguidor = idusuario;
        connection.query('DELETE FROM seguidores WHERE idusuarioseguidor = ? AND idusuarioseguido = ?', [idusuarioseguidor, idusuarioseguido], (err, results) => {
            res.send('foi');
        });
    });
});

module.exports = router;