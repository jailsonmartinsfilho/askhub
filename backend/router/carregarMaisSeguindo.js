const { Router } = require('express');
const router = Router();
const connection = require('../database.js');

router.post('/carregarMaisSeguindo', (req, res) => {
    let {nomeUsuario, comeco4} = req.body;

    connection.query('SELECT idusuario FROM dadosusuario WHERE nomeusuario = ?', [nomeUsuario], (err, results) => {
        const idusuarioseguindo = results[0].idusuario
        connection.query('SELECT * FROM seguidores WHERE idusuarioseguido = ? ORDER BY idusuarioseguidor DESC LIMIT 15 OFFSET ?', [idusuarioseguindo, comeco4], (err, results) => {
        });
    });
});

module.exports = router;