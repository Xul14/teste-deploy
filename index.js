/***********************************************************************
 * Objetivo: API Back-End funções
 * Versão: 1.0
 ***********************************************************************/

//Imports dos recursos baixados
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

//Const que recebe o documento que contém a função getNomeCursos
const jsonDados = require('./modulo/main.js')

const app = express()

//Cria um objeto com as caracteristicas do express.
app.use((request, response, next) => {

    //Define se a API vai ser pública ou privada.
    response.header('Access-Control-Allow-Origin', '*')

    //Quais métodos poderão ser utilizados nas requisições da API.
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    //Envia para o cors as regras de permissões
    app.use(cors())

    next()

})

//EndPoints

//EndPoint para teste de deploy
app.get("/", (req, res) => {
    return res.json("hello world");
  })

//EndPoint da função getNomeCursos que lista os cursos
app.get('/v1/lion-school/cursos', cors(), async function (request, response, next) {
    let cursos = jsonDados.getNomeCursos()
    let statusCode
    let dadosCurso = {}

    if (cursos) {
        statusCode = 200
        dadosCurso = cursos
    } else {
        statusCode = 404
    }

    response.status(statusCode)
    response.json(dadosCurso)

})

//EndPoint da função getListaAlunos que lista todos os alunos da escola
app.get('/v1/lion-school/alunos', cors(), async function (request, response, next) {
    let getFuncao
    let curso = request.query.curso
    let status = request.query.status
    let statusCode
    let dadosAlunos = {}

    if (status != undefined && curso == undefined) {

        if (status != '' || isNaN(status)) {
            getFuncao = jsonDados.getStatusAlunos(status)
            statusCode = 200
            dadosAlunos = getFuncao
        } else {
            statusCode = 404
        }

    } else if (curso != undefined && status == undefined) {

        if (curso != '' || isNaN(curso)) {
            getFuncao = jsonDados.getAlunosCurso(curso)
            statusCode = 200
            dadosAlunos = getFuncao
        } else {
            statusCode = 404

        }
    } else {
        getFuncao = jsonDados.getListaAlunos()

        if (getFuncao) {
            statusCode = 200
            dadosAlunos = getFuncao
        } else {
            statusCode = 404
        }
    }


    response.status(statusCode)
    response.json(dadosAlunos)

})


//EndPoint da função getMatriculaAlunos que traz os dados do aluno com base no número da matricula
app.get('/v1/lion-school/alunos/:numeroMatricula', cors(), async function (request, response, next) {
    let numeroMatricula = request.params.numeroMatricula
    let statusCode
    let dadosMatricula = {}

    if (numeroMatricula == '' || numeroMatricula == undefined || numeroMatricula.length != 11 || isNaN(numeroMatricula)) {
        statusCode = 400
        dadosMatricula.message = 'Não foi possível processar pois os dados de entrada que foi enviado não corresponde ao exigido.'
    } else {
        let matricula = jsonDados.getMatriculaAlunos(numeroMatricula)

        if (matricula) {
            statusCode = 200
            dadosMatricula = matricula
        } else {
            statusCode = 404
        }
    }

    response.status(statusCode)
    response.json(dadosMatricula)

})

const port = process.env.PORT || 8080;


app.listen(port, function () {
    console.log(`Servidor aguardando requisições na porta ${port}`)
})