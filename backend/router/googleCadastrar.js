const { Router } = require('express');
const router = Router();
const connection = require('../database.js');
const bcrypt = require('bcrypt');
const fs = require('fs');

const jwt = require('jsonwebtoken');
const jsonkey = '1a6e4d027c15f8b3ea9f81c5720d9c916dfb2549f6ad6d4f2f4a7c07d98e29c1';

router.post('/googleCadastrar', async (req, res) => {
    const accessToken = req.body.tokenResponse.access_token;

    const buscarGoogleUserInfo = async (accessToken) => {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { 'Authorization': `Bearer ${accessToken}` } });
        return await response.json();
    };
    const googleUserInfo = await buscarGoogleUserInfo(accessToken);
    const { sub, given_name, family_name, email, picture } = await googleUserInfo;

    console.log(googleUserInfo)

    const idusuario = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)).join('').padStart(20, '0');
    const nomeusuario = (given_name + (family_name ? family_name : '')).trim().toLowerCase() + Math.floor(Math.random() * 1000);
    const emailusuario = email;

    connection.query('SELECT * FROM dadosusuario WHERE emailusuario = ?', [emailusuario], (err, results) => {
        if (results.length > 0) {
            res.send('O endereço de e-mail dessa conta do Google já está vinculado a uma conta no AskHub, faça log-in usando o modo de e-mail e senha padrão!');
            return;
        }else{
            bcrypt.hash(sub, 10, (err, hash) => {
                senhausuario = hash;
        
                let dadosUsuario = {idusuario, nomeusuario, emailusuario, senhausuario};
                connection.query('INSERT INTO dadosusuario SET ?', [dadosUsuario], (err, result) => {
                });
            });
         
             const fileStream = fs.createWriteStream(`../public/icons/${idusuario}.png`);
             require('https').get(picture, response => {response.pipe(fileStream);
                fileStream.on('finish', () => {fileStream.close()});
             });
             
            const token = jwt.sign({ idusuario }, jsonkey);
            res.send({token, nomeusuario});
        }
    });

});

module.exports = router;