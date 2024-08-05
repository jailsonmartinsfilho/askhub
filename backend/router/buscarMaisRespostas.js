const { Router } = require('express');
const router = Router();
const connection = require('../database.js');

router.post('/buscarMaisRespostas', (req, res) => {
    let {nomeUsuario, comeco2} = req.body;
    console.log(comeco2)
    console.log('req chegou buscar mais resposta')
    
    connection.query('SELECT * FROM resposta WHERE nomeusuarioresposta = ? ORDER BY temporesposta DESC LIMIT 15 OFFSET ?', [nomeUsuario, comeco2], (err, results) => {
        res.send(results);
    });
});

module.exports = router;