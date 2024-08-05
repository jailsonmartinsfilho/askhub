const { Router } = require('express');
const router = Router();
const connection = require('../database.js');

router.post('/buscarPerguntasInicio', (req, res) => {
    let {comeco} = req.body;
    
    connection.query('SELECT * FROM pergunta ORDER BY idpergunta DESC LIMIT 15 OFFSET ?', [comeco], (err, results) => {
        res.send(results);
    });
});

module.exports = router;