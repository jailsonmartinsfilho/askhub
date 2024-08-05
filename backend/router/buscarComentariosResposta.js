const { Router } = require('express');
const router = Router();
const connection = require('../database.js');

router.post('/buscarComentariosResposta', (req, res) => {
    let { comeco, idperguntaresposta } = req.body;
    
    connection.query('SELECT * FROM comentario WHERE idperguntaresposta = ? ORDER BY tempocomentario DESC LIMIT 15 OFFSET ?', [idperguntaresposta, comeco], (err, results) => {
        res.send(results);
    });
});

module.exports = router;