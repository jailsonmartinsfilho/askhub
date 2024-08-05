const { Router } = require('express');
const router = Router();
const connection = require('../database.js');

router.post('/buscarDadosPergunta', (req, res) => {
    const { urlpergunta } = req.body;

    connection.query('SELECT * FROM pergunta WHERE urlpergunta = ?', [urlpergunta], (err, results) => {
        let dadosPergunta = results[0];
        connection.query('SELECT extensaofotoperfilusuario, extensaofotocapausuario FROM dadosusuario WHERE idusuario = ?', [dadosPergunta.idusuariopergunta], (err, results) => {
            if (results[0].extensaofotoperfilusuario) {
                dadosPergunta.extensaofotoperfilusuario = results[0].extensaofotoperfilusuario;
            }
            if (results[0].extensaofotocapausuario) {
                dadosPergunta.extensaofotocapausuario = results[0].extensaofotocapausuario;
            }
            res.send(dadosPergunta);
        });
    });
});

module.exports = router;