const { Router } = require('express');
const router = Router();
const connection = require('../database.js');

router.post('/carregarMaisSeguidores', (req, res) => {
    let {nomeUsuario, comeco3} = req.body;

    connection.query('SELECT idusuario FROM dadosusuario WHERE nomeusuario = ?', [nomeUsuario], (err, results) => {
        const idusuarioseguido = results[0].idusuario
        connection.query('SELECT * FROM seguidores WHERE idusuarioseguido = ? ORDER BY idusuarioseguidor DESC LIMIT 15 OFFSET ?', [idusuarioseguido, comeco3], (err, results) => {
        });
    });
});

module.exports = router;