const { Router } = require('express');
const router = Router();
const connection = require('../database.js');

const jwt = require('jsonwebtoken');
const jsonkey = '1a6e4d027c15f8b3ea9f81c5720d9c916dfb2549f6ad6d4f2f4a7c07d98e29c1';

router.post('/buscarDadosConfiguracoes', (req, res) => {
    const token = jwt.verify(req.body.token, jsonkey);
    const idusuario = token.idusuario;

    connection.query('SELECT idusuario, nomeusuario, pronomesusuario, biografiausuario, notificacoesnumerousuario FROM dadosusuario WHERE idusuario = ?', [idusuario], (err, results) => {
        res.send(results[0]);
    });
});

module.exports = router;