const { Router } = require('express');
const router = Router();
const connection = require('../database.js');

router.post('/buscarMaisPerguntas', (req, res) => {
    let {nomeUsuario, comeco} = req.body;
    
    connection.query('SELECT * FROM pergunta WHERE nomeusuariopergunta = ? ORDER BY idpergunta DESC LIMIT 15 OFFSET ?', [nomeUsuario, comeco], (err, results) => {
        res.send(results);
    });
});

module.exports = router;