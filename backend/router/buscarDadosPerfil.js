const { Router } = require('express');
const router = Router();
const connection = require('../database.js');

const jwt = require('jsonwebtoken');
const jsonkey = '1a6e4d027c15f8b3ea9f81c5720d9c916dfb2549f6ad6d4f2f4a7c07d98e29c1';

router.post('/buscarDadosPerfil', (req, res) => {
    let { nomeusuario, comeco, token } = req.body;
    let dadosPerfil;
    let perguntasUsuario;
    let respostasUsuario;

    token = jwt.verify(token, jsonkey);
    const idusuario = token.idusuario;

    connection.query('SELECT idusuario, nomeusuario, datacadastrousuario, nivelusuario, pontostotalusuario, pontostemporadausuario, pronomesusuario, biografiausuario, notificacoesnumerousuario, numeroperguntasusuario, numerorespostasusuario, extensaofotoperfilusuario, extensaofotocapausuario FROM dadosusuario WHERE nomeusuario = ?', [nomeusuario], (err, results) => {
        dadosPerfil = results[0];

        connection.query('SELECT * FROM pergunta WHERE nomeusuariopergunta = ? ORDER BY tempopergunta DESC LIMIT 15 OFFSET ?', [nomeusuario, comeco], (err, results) => {
            perguntasUsuario = results;
3
            connection.query('SELECT * FROM resposta WHERE nomeusuarioresposta = ? ORDER BY temporesposta DESC LIMIT 15 OFFSET ?', [nomeusuario, comeco], (err, results) => {
                respostasUsuario = results;

                connection.query('SELECT nomeusuario FROM dadosusuario WHERE idusuario = ?', [idusuario], (err, results) => {
                    let nomeUsuario = results[0].nomeusuario;

                    connection.query('SELECT idusuario FROM dadosusuario WHERE nomeusuario = ?', [nomeusuario], (err, results) => {
                        const idusuarioseguido = results[0].idusuario
                        console.log(idusuarioseguido)

                        connection.query('SELECT idusuarioseguidor FROM seguidores WHERE idusuarioseguido = ?', [idusuarioseguido], (err, results) => {
                            let seguidoresUsuario = results[0];
                            const listaIdUsuariosSeguidores = results.map(idusuarioseguidor => idusuarioseguidor.idusuarioseguidor);
                            const placeholders = listaIdUsuariosSeguidores.map(() => '?').join(',');
                            const sql = `SELECT idusuario, nomeusuario, extensaofotoperfilusuario FROM dadosusuario WHERE idusuario IN (${placeholders})`;

                            connection.query(sql, listaIdUsuariosSeguidores, (err, results) => {
                                seguidoresUsuario = results;

                                connection.query('SELECT idusuario FROM dadosusuario WHERE nomeusuario = ?', [nomeusuario], (err, results) => {
                                    const idusuarioseguindo = results[0].idusuario
                                    connection.query('SELECT idusuarioseguido FROM seguidores WHERE idusuarioseguidor = ?', [idusuarioseguindo], (err, results) => {
                                        let seguindosUsuario = results[0];
                                        const listaIdUsuariosSeguindos = results.map(idusuarioseguindo => idusuarioseguindo.idusuarioseguido);
                                        const placeholders = listaIdUsuariosSeguindos.map(() => '?').join(',');
                                        const sql = `SELECT idusuario, nomeusuario, extensaofotoperfilusuario FROM dadosusuario WHERE idusuario IN (${placeholders})`;

                                        connection.query(sql, listaIdUsuariosSeguindos, (err, results) => {
                                            seguindosUsuario = results;
                                            let dados = { dadosPerfil, perguntasUsuario, respostasUsuario, nomeUsuario, seguidoresUsuario, seguindosUsuario }
                                            res.send(dados);
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;