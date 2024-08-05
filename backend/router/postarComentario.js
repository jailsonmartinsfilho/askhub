const { Router } = require('express');
const router = Router();
const connection = require('../database.js');

const jwt = require('jsonwebtoken');
const jsonkey = '1a6e4d027c15f8b3ea9f81c5720d9c916dfb2549f6ad6d4f2f4a7c07d98e29c1';

router.post('/postarComentario', (req, res) => {
    let { token, textocomentario, idperguntaresposta, idresposta, urlpergunta } = req.body;
    token = jwt.verify(token, jsonkey);
    const idusuariocomentario = token.idusuario;

    connection.query('SELECT nomeusuario, extensaofotoperfilusuario FROM dadosusuario WHERE idusuario = ?', [idusuariocomentario], (err, results) => {
        const nomeusuariocomentario = results[0].nomeusuario;
        const extensaofotoperfilusuario = results[0].extensaofotoperfilusuario;

        connection.query('SELECT numerocomentariosresposta FROM resposta WHERE idperguntaresposta = ?', [idperguntaresposta], (err, results) => {
            const idcomentario = results[0].numerocomentariosresposta + 1
            const idperguntarespostacomentario = `${idperguntaresposta}-${idcomentario}`;

            let dadosComentario = { idperguntarespostacomentario, idperguntaresposta, idresposta, idcomentario, idusuariocomentario, nomeusuariocomentario, textocomentario, extensaofotoperfilusuario };
            connection.query('INSERT INTO comentario SET ?', [dadosComentario], (err, result) => {
                connection.query('UPDATE resposta SET numerocomentariosresposta = numerocomentariosresposta + 1 WHERE idperguntaresposta = ?', [idperguntaresposta], (err, results) => {
                    connection.query('SELECT * FROM comentario WHERE idperguntarespostacomentario = ?', [idperguntarespostacomentario], (err, results) => {
                        connection.query('SELECT idusuarioresposta FROM resposta WHERE idperguntaresposta = ?', [idperguntaresposta], (err, results) => {
                            const idusuarionotificado = results[0].idusuarioresposta
                            const tiponotificacao = 'Comentário';
                            let dadosNotificacao = { idusuarionotificado, idusuarionotificacao: idusuariocomentario, nomeusuarionotificacao: nomeusuariocomentario, tiponotificacao, extensaofotoperfilusuario, urlpergunta }
                            if (idusuarionotificado != idusuariocomentario) {
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