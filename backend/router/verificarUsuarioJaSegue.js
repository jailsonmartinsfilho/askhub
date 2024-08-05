const { Router } = require('express');
const router = Router();
const connection = require('../database.js');

const jwt = require('jsonwebtoken');
const jsonkey = '1a6e4d027c15f8b3ea9f81c5720d9c916dfb2549f6ad6d4f2f4a7c07d98e29c1';

router.post('/verificarUsuarioJaSegue', (req, res) => {
    let {token, nomeUsuario} = req.body;
    token = jwt.verify(token, jsonkey);
    let  idusuario = token.idusuario;
    console.log(idusuario)

    connection.query('SELECT idusuario FROM dadosusuario WHERE nomeusuario = ?', [nomeUsuario], (err, results) => {
        if(err) console.log(err)
        const idusuarioseguido = results[0].idusuario
    console.log(idusuarioseguido)

        connection.query('SELECT * FROM seguidores WHERE idusuarioseguidor = ? AND idusuarioseguido = ?', [idusuario, idusuarioseguido], (err, results) => {
            console.log(results)
            if(err) console.log(err)
                console.log(results.length > 0)
            results.length > 0 ? res.send(true) : res.send(false);
        });
    });
});

module.exports = router;