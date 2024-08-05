const { Router } = require('express');
const router = Router();
const connection = require('../database.js');

const jwt = require('jsonwebtoken');
const jsonkey = '1a6e4d027c15f8b3ea9f81c5720d9c916dfb2549f6ad6d4f2f4a7c07d98e29c1';

router.post('/postarResposta', (req, res) => {
    let { token, textoresposta, idpergunta, urlpergunta } = req.body;
    token = jwt.verify(token, jsonkey);
    const idusuarioresposta = token.idusuario;

    connection.query('SELECT nomeusuario, extensaofotoperfilusuario FROM dadosusuario WHERE idusuario = ?', [idusuarioresposta], (err, results) => {
        const nomeusuarioresposta = results[0].nomeusuario;
        const extensaofotoperfilusuario = results[0].extensaofotoperfilusuario;

        connection.query('SELECT numerorespostaspergunta FROM pergunta WHERE idpergunta = ?', [idpergunta], (err, results) => {
            const idresposta = results[0].numerorespostaspergunta + 1
            const idperguntaresposta = `${idresposta}-${idpergunta}`;

            let dadosResposta = { idperguntaresposta, idpergunta, idresposta, idusuarioresposta, nomeusuarioresposta, textoresposta, extensaofotoperfilusuario, urlpergunta };
            connection.query('INSERT INTO resposta SET ?', [dadosResposta], (err, result) => {
                connection.query('UPDATE pergunta SET numerorespostaspergunta = numerorespostaspergunta + 1 WHERE idpergunta = ?', [idpergunta], (err, results) => {
                    connection.query('SELECT * FROM resposta WHERE idresposta = ? AND idpergunta = ?', [idresposta, idpergunta], (err, results) => {

                        connection.query('SELECT idusuariopergunta FROM pergunta WHERE idpergunta = ?', [idpergunta], (err, results) => {
                            const idusuarionotificado = results[0].idusuariopergunta
                            const tiponotificacao = 'Resposta';
                            let dadosNotificacao = { idusuarionotificado, idusuarionotificacao: idusuarioresposta, nomeusuarionotificacao: nomeusuarioresposta, tiponotificacao, extensaofotoperfilusuario, urlpergunta }
                            if (idusuarionotificado != idusuarioresposta) {
                                connection.query('INSERT INTO notificacoes SET ?', [dadosNotificacao], (err, result) => {
                                    connection.query('UPDATE dadosusuario SET notificacoesnumerousuario = notificacoesnumerousuario + 1 WHERE idusuario = ?', [idusuarionotificado], (err, results) => {
                                    });
                                });
                            }
                        });
                        
                        res.send(results[0]);
                    });
                });
            });
        });
    });
});

module.exports = router;