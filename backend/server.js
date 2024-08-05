const express = require('express');
const cors = require('cors');
const server = express();
const bodyParser = require('body-parser');
const path = require('path');

const connection = require('./database.js');

server.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER,Content-Type,Authorization");
    server.use(cors());
    next();
});

server.use(bodyParser.json()); 

const cadastrar = require('./router/cadastrar.js');
const login = require('./router/login.js');
const buscarDadosPerfil = require('./router/buscarDadosPerfil.js');
const buscarDadosConfiguracoes = require('./router/buscarDadosConfiguracoes.js');
const atualizarDados = require('./router/atualizarDados.js');
const postarPergunta = require('./router/postarPergunta.js');
const buscarDadosPergunta = require('./router/buscarDadosPergunta.js');

const buscarMaisPerguntas = require('./router/buscarMaisPerguntas.js');
const buscarMaisRespostas = require('./router/buscarMaisRespostas.js');

const buscarPerguntasInicio = require('./router/buscarPerguntasInicio.js');
const googleCadastrar = require('./router/googleCadastrar.js');
const googleLogar = require('./router/googleLogar.js');
const postarResposta = require('./router/postarResposta.js');
const buscarRespostasPergunta = require('./router/buscarRespostasPergunta.js');
const verificarUsuarioJaRespondeu = require('./router/verificarUsuarioJaRespondeu.js');
const postarComentario = require('./router/postarComentario.js');
const buscarComentariosResposta = require('./router/buscarComentariosResposta.js');
const carregarTopUsuarios = require('./router/carregarTopUsuarios.js');

const curtidaPergunta = require('./router/curtidaPergunta.js');
const curtidaResposta = require('./router/curtidaResposta.js');
const curtidaComentario = require('./router/curtidaComentario.js');
const verificarUsuarioJaCurtiuPergunta = require('./router/verificarUsuarioJaCurtiuPergunta.js');
const verificarUsuarioJaCurtiuResposta = require('./router/verificarUsuarioJaCurtiuResposta.js');
const verificarUsuarioJaCurtiuComentario = require('./router/verificarUsuarioJaCurtiuComentario.js');
const adicionarSeguida = require('./router/adicionarSeguida.js');
const verificarUsuarioJaSegue = require('./router/verificarUsuarioJaSegue.js');
const carregarMaisSeguidores = require('./router/carregarMaisSeguidores.js');
const removerSeguida = require('./router/removerSeguida.js');
const buscarNotificacoes = require('./router/buscarNotificacoes.js');
const buscarNumeroNotificacoes = require('./router/buscarNumeroNotificacoes.js');

server.use('/', cadastrar, login, buscarDadosPerfil, buscarDadosConfiguracoes, atualizarDados, postarPergunta, buscarDadosPergunta, buscarMaisPerguntas, buscarPerguntasInicio, googleCadastrar, buscarNumeroNotificacoes, buscarNotificacoes, googleLogar, postarResposta, buscarRespostasPergunta, verificarUsuarioJaRespondeu, postarComentario, buscarComentariosResposta, carregarTopUsuarios, curtidaPergunta, verificarUsuarioJaCurtiuPergunta, curtidaResposta, verificarUsuarioJaCurtiuResposta, curtidaComentario, verificarUsuarioJaCurtiuComentario, adicionarSeguida, verificarUsuarioJaSegue, buscarMaisRespostas, carregarMaisSeguidores, removerSeguida);
server.use(express.static(path.join(__dirname, 'public')));

server.listen(8080, () =>{
    console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});