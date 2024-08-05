const { Router } = require('express');
const router = Router();
const connection = require('../database.js');

router.post('/buscarRespostasPergunta', (req, res) => {
    let { comeco, idpergunta2 } = req.body;
    
    connection.query('SELECT * FROM resposta WHERE idpergunta = ? ORDER BY idresposta DESC LIMIT 15 OFFSET ?', [idpergunta2, comeco], (err, results) => {
        res.send(results);
    });
});

module.exports = router;