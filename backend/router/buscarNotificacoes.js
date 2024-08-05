const { Router } = require('express');
const router = Router();
const connection = require('../database.js');

const jwt = require('jsonwebtoken');
const jsonkey = '1a6e4d027c15f8b3ea9f81c5720d9c916dfb2549f6ad6d4f2f4a7c07d98e29c1';

router.post('/buscarNotificacoes', (req, res) => {
    let {token, comeco} = req.body;
    token = jwt.verify(token, jsonkey);
    const idusuario = token.idusuario;

    connection.query('UPDATE dadosusuario SET notificacoesnumerousuario = 0 WHERE idusuario = ?', [idusuario], (err, results) => {});
    connection.query('SELECT * FROM notificacoes WHERE idusuarionotificado = ? ORDER BY temponotificacao DESC LIMIT 15 OFFSET ?', [idusuario, comeco], (err, results) => {
        if(err) console.log(Err)
        res.send(results);
    });
});

module.exports = router;