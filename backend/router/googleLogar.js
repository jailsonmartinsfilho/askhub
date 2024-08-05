const { Router } = require('express');
const router = Router();
const connection = require('../database.js');
const bcrypt = require('bcrypt');
const fs = require('fs');

const jwt = require('jsonwebtoken');
const jsonkey = '1a6e4d027c15f8b3ea9f81c5720d9c916dfb2549f6ad6d4f2f4a7c07d98e29c1';

router.post('/googleLogar', async (req, res) => {
    const accessToken = req.body.tokenResponse.access_token;

    const buscarGoogleUserInfo = async (accessToken) => {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { 'Authorization': `Bearer ${accessToken}` } });
        return await response.json();
    };
    const googleUserInfo = await buscarGoogleUserInfo(accessToken);
    const { sub, email } = await googleUserInfo;

    console.log(googleUserInfo)
    const emailusuario = email;

    connection.query('SELECT nomeusuario, senhausuario, idusuario FROM dadosusuario WHERE emailusuario = ?', [emailusuario], (err, results) => {
        if (err) console.log(err)
        if (results.length < 1) {
            return res.send('Nenhuma conta do AskHub está associada a essa conta do Google!');
        };

        bcrypt.compare(sub, results[0].senhausuario, (err, result) => {
            if (!result) return res.send('A senha informada está incorreta!');
            const nomeusuario = results[0].nomeusuario
            const idusuario = results[0].idusuario
            const token = jwt.sign({ idusuario }, jsonkey);
            res.send({ token, nomeusuario });
        });
    });
});

module.exports = router;