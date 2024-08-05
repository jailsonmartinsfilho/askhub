const { Router } = require('express');
const router = Router();
const connection = require('../database.js');

const jwt = require('jsonwebtoken');
const jsonkey = '1a6e4d027c15f8b3ea9f81c5720d9c916dfb2549f6ad6d4f2f4a7c07d98e29c1';

router.post('/adicionarSeguida', (req, res) => {
    let { token, nomeUsuario } = req.body;
    token = jwt.verify(token, jsonkey);
    const idusuario = token.idusuario;

    let idusuarioseguidor;
    let idusuarioseguido;

    connection.query('SELECT idusuario FROM dadosusuario WHERE nomeusuario = ?', [nomeUsuario], (err, results) => {
        idusuarioseguido = results[0].idusuario;
        idusuarioseguidor = idusuario;
        let dadosSeguida = {idusuarioseguidor, idusuarioseguido}
        connection.query('INSERT INTO seguidores SET ?', [dadosSeguida], (err, results) => {
            res.send('foi');
        });
    });
});

module.exports = router;