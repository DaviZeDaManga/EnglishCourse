import { Router } from "express";
const server = Router()

import Joi from "Joi"
import multer from "multer";
import bcrypt from "bcrypt"
import { inserirResposta, inserirFeitoConteudo, dadosAluno, loginAluno, verificarLoginAluno, cadastroAluno, entrarSala, verificarCodigoSala, sairSala, dadosAtividadeAluno, dadosPalavrasAluno, dadosAtividadesAluno, dadosLicoesAluno, verificarFeitoAluno, verificarRespostaAluno, dadosTrilhasAluno, dadosTrilhaAluno, dadosAvisosAluno, dadosAvisoAluno, dadosTransmissoesAluno, dadosTransmissaoAluno, alterarDadosAluno, solicitarEntrarSala, dadosMinhaSalaAluno, dadosSalasAluno } from "../repository/alunoRepository.js";

const uploadPerfil = multer({
    dest: "uploads/images/alunos/perfil"
})

//cadastro aluno
server.post("/aluno/cadastro", uploadPerfil.single("imagem"), async (req, resp)=> {
    try {
        const schema = Joi.object({
            nome: Joi.string().required().min(3).max(30),
            email: Joi.string().email().required(),
            senha: Joi.string().required().min(6).max(20),
            numero: Joi.string().required().min(8).max(15),
            tipo: Joi.string().valid("Iniciante", "Intermediário", "Avançado").required(),
            nascimento: Joi.string().required()
        })
        const {error, value} = schema.validate(req.body)
        if (error) { return resp.status(400).send({ erro: 'Os parâmetros da resposta estão incorretos.', detalhes: error.details });}

        const alunoExistente = await verificarLoginAluno(value.email);
        if (alunoExistente) {return resp.status(400).send({ erro: "Esse email já está sendo usado." });}

        const imagemPath = req.file ? req.file.path : null
        if (!imagemPath) { return resp.status(400).send({ erro: 'Imagem é obrigatória.'})}

        const dados = {...value, imagem: imagemPath}
        const resposta = await cadastroAluno(dados)
        if (!resposta) { return resp.status(400).send({ erro: 'Cadastro não efetuado.'})}
        else { return resp.send({ message: "aluno adicionado!"})}
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})

//login aluno
server.post("/aluno/login", async (req, resp)=> {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            senha: Joi.string().required()
        })
        const {error, value} = schema.validate(req.body)
        if (error) { return resp.status(400).send({ erro: 'O parâmetro "email" e "senha" do aluno é obrigatório.'})}

        const aluno = await verificarLoginAluno(value.email)
        if (!aluno) { return resp.status(400).send({ erro: "Nenhum aluno encontrado."})}
        
        const senhaCorreta = await bcrypt.compare(value.senha, aluno.senha)
        if (!senhaCorreta) { return resp.status(400).send({ erro: "Senha incorreta."})}

        const resposta = await loginAluno(value.email)
        if (!resposta) { return resp.status(400).send({ erro: 'Nada foi retornado.'})}
        else if (resposta.length == 0) { return resp.status(400).send({ erro: 'Nenhum dado foi retornado.'})}
        else { return resp.send(resposta)}
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})

//dados aluno
server.get("/aluno/:idaluno/dados", async (req, resp)=> {
    try {
        const {idaluno} = req.params;
        const idschema = Joi.number().integer().positive().required()
        const {error} = idschema.validate(idaluno)
        if (error) { return resp.status(400).send({ erro: 'O parâmetro "id" do aluno é obrigatório.'})}

        const resposta = await dadosAluno(idaluno)
        if (!resposta) { return resp.status(400).send({ erro: 'Nada foi retornado.'})}
        else if (resposta.length == 0) { return resp.status(400).send({ erro: 'Nenhum dado foi retornada.'})}
        else { return resp.send(resposta)}
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})

//alterar dados aluno
server.put("/aluno/:idaluno/alterar", async (req, resp)=> {
    try {
        const {idaluno} = req.params;
        const idschema = Joi.number().integer().positive().required()
        const {iderror} = idschema.validate(idaluno)
        if (iderror) { return resp.status(400).send({ erro: 'O parâmetro "id" do aluno é obrigatório.'})}

        const schema = Joi.object({
            nome: Joi.string().required().min(3).max(30),
            email: Joi.string().email().required(),
            numero: Joi.string().required().min(8).max(15),
            nascimento: Joi.string().required()
        })
        const {error, value} = schema.validate(req.body)
        if (error) { return resp.status(400).send({ erro: 'Os parâmetros da resposta estão incorretos.', detalhes: error.details });}

        const resposta = await alterarDadosAluno(idaluno, value)
        if (resposta.affectedRows === 0) { return resp.status(400).send({ erro: 'Nada foi adicionado.' }); }
        return resp.send(resposta);
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})



//dados SALAS
server.get("/aluno/:idaluno/dados/salas", async (req, resp)=> {
    try {
        const {idaluno} = req.params;
        const idSchema = Joi.number().integer().positive()
        const {error: errorid} = idSchema.validate(idaluno);
        if (errorid) { return resp.status(400).send({ erro: 'O parâmetro "id" do aluno é obrigatório.'})}

        const resposta = await dadosSalasAluno(idaluno)
        if (!resposta) { return resp.status(400).send({ erro: 'Nada foi retornado.'})}
        else if (resposta.length == 0) { return resp.status(400).send({ erro: 'Nenhuma sala foi retornada.'})}
        else { return resp.send(resposta)}
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})

//pedir entrar sala
server.post('/aluno/:idaluno/solicitar/entrar/sala/:idsala', async (req, resp)=> {
    try {
        const {idaluno, idsala} = req.params;
        const idSchema = Joi.number().integer().positive()
        const {error: errorid} = idSchema.validate(idaluno);
        const {error: errorid2} = idSchema.validate(idaluno);
        if (errorid || errorid2) { return resp.status(400).send({ erro: 'O parâmetro "id" do aluno e da sala é obrigatório.'})}

        const value4 = await sairSala(idaluno)
        if (!value4) { return resp.status(400).send({ erro: "Aluno não retirado da outra sala."})}

        const resposta = await solicitarEntrarSala(idaluno, idsala);
        if (resposta.affectedRows === 0) { return resp.status(400).send({ erro: 'Nada foi adicionado.' }); }
        return resp.send(resposta);
    } 
    catch (err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor', detalhes: err.message });
    }
});

//entrar sala
server.post('/aluno/:idaluno/entrar/sala', async (req, resp)=> {
    try {
        const {idaluno} = req.params;
        const idSchema = Joi.number().integer().positive()
        const {error: errorid} = idSchema.validate(idaluno);
        if (errorid) { return resp.status(400).send({ erro: 'O parâmetro "id" do aluno é obrigatório.'})}

        const schema = Joi.object({
            codigo: Joi.string().required().min(10).max(25)
        })
        const {error, value} = schema.validate(req.body)
        if (error) { return resp.status(400).send({ erro: 'O parâmetro "código" da sala é obrigatório.'})}

        const value2 = await verificarCodigoSala(value.codigo)
        if (!value2) { return resp.status(400).send({ erro: "Código inválido."})}

        const value4 = await sairSala(idaluno)
        if (!value4) { return resp.status(400).send({ erro: "Aluno não retirado da outra sala."})}

        const resposta = await entrarSala(idaluno, value2.sala);
        if (resposta.affectedRows === 0) { return resp.status(400).send({ erro: 'Nada foi adicionado.' }); }
        return resp.send(resposta);
    } 
    catch (err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor', detalhes: err.message });
    }
});

//sair sala
server.delete('/aluno/:idaluno/sair/sala', async (req, resp)=> {
    try {
        const {idaluno} = req.params;
        const idSchema = Joi.number().integer().positive()
        const {error: errorid} = idSchema.validate(idaluno);
        if (errorid) { return resp.status(400).send({ erro: 'O parâmetro "id" do aluno é obrigatório.'})}

        const resposta = await sairSala(idaluno);
        if (resposta.affectedRows === 0) { return resp.status(400).send({ erro: 'Nada foi deletado.' }); }
        return resp.send(resposta);
    } 
    catch (err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor', detalhes: err.message });
    }
});

//minhasala
server.get("/aluno/:idaluno/dados/minhasala", async (req, resp)=> {
    try {
        const {idaluno} = req.params;
        const idschema = Joi.number().integer().positive().required()
        const {error} = idschema.validate(idaluno)
        if (error) { return resp.status(400).send({ erro: 'O parâmetro "id" do aluno é obrigatório.'})}

        const resposta = await dadosMinhaSalaAluno(idaluno)
        if (!resposta) { return resp.status(400).send({ erro: 'Nada foi retornado.'})}
        else if (resposta.length == 0) { return resp.status(400).send({ erro: 'Nenhuma sala foi retornada.'})}
        else { return resp.send(resposta)}
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})



//dados TRILHAS
server.get("/aluno/:idaluno/dados/sala/:idsala/trilhas", async (req, resp)=> {
    try {
        const {idsala, idaluno} = req.params;
        const idschema = Joi.number().integer().positive().required()
        const {error: error1} = idschema.validate(idsala)
        const {error: error2} = idschema.validate(idaluno)
        if (error1 || error2) { return resp.status(400).send({ erro: 'O parâmetro "id" da sala e do aluno é obrigatório.'})}

        const resposta = await dadosTrilhasAluno(idsala, idaluno)
        if (!resposta) { return resp.status(400).send({ erro: 'Nada foi retornado.'})}
        else if (resposta.length == 0) { return resp.status(400).send({ erro: 'Nenhuma trilha foi retornada.'})}
        else { return resp.send(resposta)}
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})

//dados TRILHA
server.get("/aluno/:idaluno/dados/sala/:idsala/trilha/:idtrilha", async (req, resp)=> {
    try {
        const {idaluno, idsala, idtrilha} = req.params;
        const idschema = Joi.number().integer().positive().required()
        const {error: error1} = idschema.validate(idsala)
        const {error: error2} = idschema.validate(idaluno)
        const {error: error3} = idschema.validate(idsala)
        if (error1 || error2 || error3) { return resp.status(400).send({ erro: 'O parâmetro "id" da sala, do aluno e da trilha é obrigatório.'})}

        const resposta = await dadosTrilhaAluno(idsala, idtrilha, idaluno)
        if (!resposta) { return resp.status(400).send({ erro: 'Nada foi retornado.'})}
        else if (resposta.length == 0) { return resp.status(400).send({ erro: 'Nenhuma trilha foi retornada.'})}
        else { return resp.send(resposta)}
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})

//dados ATIVIDADES
server.get("/aluno/:idaluno/dados/sala/:idsala/trilha/:idtrilha/atividades", async (req, resp)=> {
    try {
        const {idaluno, idsala, idtrilha} = req.params;
        const idschema = Joi.number().integer().positive().required()
        const {error: error1} = idschema.validate(idsala)
        const {error: error2} = idschema.validate(idaluno)
        const {error: error3} = idschema.validate(idsala)
        if (error1 || error2 || error3) { return resp.status(400).send({ erro: 'O parâmetro "id" da sala, do aluno e da trilha é obrigatório.'})}

        const resposta = await dadosAtividadesAluno(idsala, idtrilha, idaluno)
        if (!resposta) { return resp.status(400).send({ erro: 'Nada foi retornado.'})}
        else if (resposta.length == 0) { return resp.status(400).send({ erro: 'Nenhuma atividade foi retornada.'})}
        else { return resp.send(resposta)}
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})

//dados ATIVIDADE
server.get("/aluno/:idaluno/dados/sala/:idsala/trilha/:idtrilha/atividade/:idatividade", async (req, resp)=> {
    try {
        const {idaluno, idsala, idtrilha, idatividade} = req.params;
        const idschema = Joi.number().integer().positive().required()
        const {error: error1} = idschema.validate(idsala)
        const {error: error2} = idschema.validate(idaluno)
        const {error: error3} = idschema.validate(idsala)
        const {error: error4} = idschema.validate(idatividade)
        if (error1 || error2 || error3 || error4) { return resp.status(400).send({ erro: 'O parâmetro "id" da sala, do aluno, da trilha e da atividade é obrigatório.'})}

        const resposta = await dadosAtividadeAluno(idsala, idtrilha, idatividade, idaluno)
        if (!resposta) { return resp.status(400).send({ erro: 'Nada foi retornado.'})}
        else if (resposta.length == 0) { return resp.status(400).send({ erro: 'Nenhuma atividade foi retornada.'})}
        else { return resp.send(resposta)}
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})

//dados PALAVRAS
server.get("/aluno/:idaluno/dados/sala/:idsala/trilha/:idtrilha/atividade/:idatividade/palavras", async (req, resp)=> {
    try {
        const {idaluno, idsala, idtrilha, idatividade} = req.params;
        const idschema = Joi.number().integer().positive().required()
        const {error: error1} = idschema.validate(idsala)
        const {error: error2} = idschema.validate(idaluno)
        const {error: error3} = idschema.validate(idsala)
        const {error: error4} = idschema.validate(idatividade)
        if (error1 || error2 || error3 || error4) { return resp.status(400).send({ erro: 'O parâmetro "id" da sala, do aluno, da trilha e da atividade é obrigatório.'})}

        const resposta = await dadosPalavrasAluno(idsala, idtrilha, idatividade, idaluno)
        if (!resposta) { return resp.status(400).send({ erro: 'Nada foi retornado.'})}
        else if (resposta.length == 0) { return resp.status(400).send({ erro: 'Nenhuma palavra foi retornada.'})}
        else { return resp.send(resposta)}
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})

//dados LICOES
server.get("/aluno/:idaluno/dados/sala/:idsala/trilha/:idtrilha/atividade/:idatividade/licoes", async (req, resp)=> {
    try {
        const {idaluno, idsala, idtrilha, idatividade} = req.params;
        const idschema = Joi.number().integer().positive().required()
        const {error: error1} = idschema.validate(idsala)
        const {error: error2} = idschema.validate(idaluno)
        const {error: error3} = idschema.validate(idsala)
        const {error: error4} = idschema.validate(idatividade)
        if (error1 || error2 || error3 || error4) { return resp.status(400).send({ erro: 'O parâmetro "id" da sala, do aluno, da trilha e da atividade é obrigatório.'})}

        const resposta = await dadosLicoesAluno(idsala, idtrilha, idatividade, idaluno)
        if (!resposta) { return resp.status(400).send({ erro: 'Nada foi retornado.'})}
        else if (resposta.length == 0) { return resp.status(400).send({ erro: 'Nenhuma lição foi retornada.'})}
        else { return resp.send(resposta)}
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})




//dados AVISOS
server.get("/aluno/:idaluno/dados/sala/:idsala/avisos", async (req, resp)=> {
    try {
        const {idsala, idaluno} = req.params;
        const idschema = Joi.number().integer().positive().required()
        const {error: error1} = idschema.validate(idsala)
        const {error: error2} = idschema.validate(idaluno)
        if (error1 || error2) { return resp.status(400).send({ erro: 'O parâmetro "id" da sala e do aluno é obrigatório.'})}

        const resposta = await dadosAvisosAluno(idsala, idaluno)
        if (!resposta) { return resp.status(400).send({ erro: 'Nada foi retornado.'})}
        else if (resposta.length == 0) { return resp.status(400).send({ erro: 'Nenhum aviso foi retornado.'})}
        else { return resp.send(resposta)}
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})

//dados AVISO
server.get("/aluno/:idaluno/dados/sala/:idsala/aviso/:idaviso", async (req, resp)=> {
    try {
        const {idaluno, idsala, idaviso} = req.params;
        const idschema = Joi.number().integer().positive().required()
        const {error: error1} = idschema.validate(idsala)
        const {error: error2} = idschema.validate(idaluno)
        const {error: error3} = idschema.validate(idaviso)
        if (error1 || error2 || error3) { return resp.status(400).send({ erro: 'O parâmetro "id" da sala, do aluno e do aviso é obrigatório.'})}

        const resposta = await dadosAvisoAluno(idsala, idaviso, idaluno)
        if (!resposta) { return resp.status(400).send({ erro: 'Nada foi retornado.'})}
        else if (resposta.length == 0) { return resp.status(400).send({ erro: 'Nenhum aviso foi retornado.'})}
        else { return resp.send(resposta)}
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})



//dados TRANSMISSOES
server.get("/aluno/:idaluno/dados/sala/:idsala/transmissoes", async (req, resp)=> {
    try {
        const {idsala, idaluno} = req.params;
        const idschema = Joi.number().integer().positive().required()
        const {error: error1} = idschema.validate(idsala)
        const {error: error2} = idschema.validate(idaluno)
        if (error1 || error2) { return resp.status(400).send({ erro: 'O parâmetro "id" da sala e do aluno é obrigatório.'})}

        const resposta = await dadosTransmissoesAluno(idsala, idaluno)
        if (!resposta) { return resp.status(400).send({ erro: 'Nada foi retornado.'})}
        else if (resposta.length == 0) { return resp.status(400).send({ erro: 'Nenhuma transmissão foi retornada.'})}
        else { return resp.send(resposta)}
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})

//dados TRANSMISSAO
server.get("/aluno/:idaluno/dados/sala/:idsala/transmissao/:idtransmissao", async (req, resp)=> {
    try {
        const {idaluno, idsala, idtransmissao} = req.params;
        const idschema = Joi.number().integer().positive().required()
        const {error: error1} = idschema.validate(idsala)
        const {error: error2} = idschema.validate(idaluno)
        const {error: error3} = idschema.validate(idtransmissao)
        if (error1 || error2 || error3) { return resp.status(400).send({ erro: 'O parâmetro "id" da sala, do aluno e da transmissão é obrigatório.'})}

        const resposta = await dadosTransmissaoAluno(idsala, idtransmissao, idaluno)
        if (!resposta) { return resp.status(400).send({ erro: 'Nada foi retornado.'})}
        else if (resposta.length == 0) { return resp.status(400).send({ erro: 'Nenhum transmissão foi retornada.'})}
        else { return resp.send(resposta)}
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})



//inserir feito conteudo
server.post('/aluno/:idaluno/feito/atividade/:idatividade/conteudo', async (req, resp)=> {
    try {
        const {idaluno, idatividade} = req.params;
        const idSchema = Joi.number().integer().positive()
        const {error: error1} = idSchema.validate(idaluno);
        const {error: error2} = idSchema.validate(idatividade);
        if (error1 || error2) { return resp.status(400).send({ erro: 'Os parâmetros "id" do aluno e da atividade é obrigatório.'})}

        const feito = await verificarFeitoAluno(idaluno, idatividade)
        if (feito) {return resp.status(200).send({ erro: "Feito já inserido." });}

        const resposta = await inserirFeitoConteudo(idaluno, idatividade);
        if (resposta.affectedRows === 0) { return resp.status(400).send({ erro: 'Nada foi adicionado.' }); }
        return resp.send(resposta);
    } 
    catch (err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor', detalhes: err.message });
    }
});

server.post('/aluno/:idaluno/responder/licao/:idlicao', async (req, resp) => {
    try {
        const {idaluno, idlicao} = req.params;
        const idSchema = Joi.number().integer().positive();
        const {error: error1} = idSchema.validate(idaluno);
        const {error: error2} = idSchema.validate(idlicao);
        if (error1 || error2) { return resp.status(400).send({ erro: 'Os parâmetros "id" do aluno e da atividade são obrigatórios.' });}

        const respostaAluno = await verificarRespostaAluno(idaluno, idlicao);
        if (respostaAluno) {return resp.status(200).send({ erro: "Resposta já inserida." });}

        const schema = Joi.object({
            resposta: Joi.string().required(),
            tipo: Joi.string().valid("Alternativa", "Dissertativa").required(),
            status: Joi.string().valid("Respondida", "Em análise").required()
        });

        const {error, value} = schema.validate(req.body);
        if (error) {return resp.status(400).send({ erro: 'Os parâmetros da resposta estão incorretos.', detalhes: error.details });}

        const resposta = await inserirResposta(idaluno, idlicao, value);
        if (resposta.affectedRows === 0) {return resp.status(400).send({ erro: 'Nada foi adicionado.' });}

        return resp.send(resposta);
    } catch (err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor', detalhes: err.message });
    }
});



export default server;