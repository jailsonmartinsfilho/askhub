const { Router } = require('express');
const router = Router();
const connection = require('../database.js');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const jsonkey = '1a6e4d027c15f8b3ea9f81c5720d9c916dfb2549f6ad6d4f2f4a7c07d98e29c1';

router.post('/cadastrar', (req, res) => {
    let { nomeusuario, emailusuario, senhausuario } = req.body;

    connection.query('SELECT * FROM dadosusuario WHERE nomeusuario = ? OR emailusuario = ?', [nomeusuario, emailusuario], (err, results) => {
        if (results.length > 0) {
            const mensagemErro = (results[0].nomeusuario === nomeusuario) ? 'O nome já está sendo usado!' : 'O email já está sendo usado!';
            return res.send(mensagemErro);
        }

        const idusuario = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)).join('').padStart(20, '0');

        bcrypt.hash(senhausuario, 10, (err, hash) => {
            senhausuario = hash;

            let dadosUsuario = {idusuario, nomeusuario, emailusuario, senhausuario};
            connection.query('INSERT INTO dadosusuario SET ?', [dadosUsuario], (err, result) => {
                const token = jwt.sign({ idusuario }, jsonkey);
                res.send(token);
            });
        });
    });
});

module.exports = router;