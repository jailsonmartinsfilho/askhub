const { Router } = require('express');
const router = Router();
const connection = require('../database.js');

router.post('/carregarTopUsuarios', (req, res) => {
    connection.query('SELECT idusuario, nomeusuario, datacadastrousuario, nivelusuario, pontostotalusuario, pronomesusuario, biografiausuario, notificacoesnumerousuario numerorespostasusuario, extensaofotoperfilusuario, extensaofotocapausuario, numeroperguntasusuario FROM dadosusuario ORDER BY pontostotalusuario DESC LIMIT 50', (err, results) => {
        res.send(results);
    });
});

module.exports = router;