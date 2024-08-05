const { Router } = require('express');
const router = Router();
const connection = require('../database.js');
const jwt = require('jsonwebtoken');
const jsonkey = '1a6e4d027c15f8b3ea9f81c5720d9c916dfb2549f6ad6d4f2f4a7c07d98e29c1';
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const randomNumber = Math.floor(Math.random() * 100000).toString().padStart(5, '0');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let caminho = '';
        if (file.fieldname === 'fotoperfil') {
            caminho = '../public/icons';
        } else if (file.fieldname === 'fotocapa') {
            caminho = '../public/capas';
        }
        cb(null, caminho);
    },
    filename: (req, file, cb) => {
        const extensao = path.extname(file.originalname);
        cb(null, `rename${randomNumber}${extensao}`);
    }
});

const upload = multer({ storage: storage });

router.post('/atualizarDados', upload.fields([{ name: 'fotoperfil' }, { name: 'fotocapa' }]), async (req, res) => {
    const token = jwt.verify(req.body.token, jsonkey);
    const idusuario = token.idusuario;
    delete req.body.token;

    if (req.files['fotoperfil']) {
        const extensoesPossiveis = ['.jpg', '.jpeg', '.png', '.gif'];
        const extensao = path.extname(req.files['fotoperfil'][0].originalname);
        req.body.extensaofotoperfilusuario = extensao;
        extensoesPossiveis.forEach((extensao) => {
            fs.unlink(`../public/icons/${idusuario}${extensao}`, (err) => {
            });
        });

        fs.rename(`../public/icons/rename${randomNumber}${extensao}`, `../public/icons/${idusuario}${extensao}`, (err) => {});
    }

    if (req.files['fotocapa']) {
        const extensoesPossiveis = ['.jpg', '.jpeg', '.png', '.gif'];
        const extensao = path.extname(req.files['fotocapa'][0].originalname);
        req.body.extensaofotocapausuario = extensao;
        extensoesPossiveis.forEach((extensao) => {
            fs.unlink(`../public/capas/${idusuario}${extensao}`, (err) => {
            });
        });

        fs.rename(`../public/capas/rename${randomNumber}${extensao}`, `../public/capas/${idusuario}${extensao}`, (err) => {});
    }
    if (Object.keys(req.body).length > 0) {
        connection.query('UPDATE dadosusuario SET ? WHERE idusuario = ?', [req.body, idusuario], (err, result) => {
            const nomeusuariopergunta = req.body.nomeusuario
            console.log(nomeusuariopergunta)
            connection.query('UPDATE pergunta SET nomeusuariopergunta = ? WHERE idusuariopergunta = ?', [nomeusuariopergunta, idusuario], (err, result) => {
                if (err) console.log(err)
                res.send(true);
            });
        });
    } else {
        res.send(true);
    }
});

module.exports = router;
