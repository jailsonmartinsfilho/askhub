const { Router } = require('express');
const router = Router();
const connection = require('../database.js');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const jsonkey = '1a6e4d027c15f8b3ea9f81c5720d9c916dfb2549f6ad6d4f2f4a7c07d98e29c1';

router.post('/login', (req, res) => {
    let { emailusuario, senhausuario } = req.body;

    connection.query('SELECT senhausuario, idusuario FROM dadosusuario WHERE emailusuario = ?', [emailusuario], (err, results) => {
        if (results.length < 1) {
            return res.send('O endereço informado não está vinculado a uma conta!');
        };

        bcrypt.compare(senhausuario, results[0].senhausuario, (err, result) => {
            if (!result) return res.send('A senha informada está incorreta!');
            const idusuario = results[0].idusuario
            const token = jwt.sign({ idusuario }, jsonkey);
            res.send(token);
        });
    });
});

module.exports = router;