import { Router } from "express";
const server = Router();

import Joi from "Joi";
import multer from "multer"; 
import bcrypt from "bcrypt"
import { cadastroProfessor, dadosAtividadesProfessor, dadosAvisosProfessor, dadosSalasProfessor, dadosTransmissoesProfessor, dadosTrilhasProfessor, inserirAtividade, inserirAviso, inserirSala, inserirTransmissao, inserirTrilha, inserirTrilhaSala, loginProfessor, verificarLoginProfessor } from "../repository/professorRepository.js";

const uploadPerfil = multer({
    dest: "uploads/images/alunos/professores"
})
const uploadSala = multer({
    dest: 'uploads/images/salas'
});
const uploadTrilha = multer({
    dest: 'uploads/images/trilhas'
});
const uploadAviso = multer({
    dest: 'uploads/images/avisos'
});
const uploadTransmissao = multer({
    dest: 'uploads/images/transmissoes'
});
const uploadAtividade = multer({
    dest: 'uploads/images/atividades'
});

//cadastro professor
server.post("/professor/cadastro", uploadPerfil.single("imagem"), async (req, resp)=> {
    try {
        const schema = Joi.object({
            nome: Joi.string().required().min(3).max(30),
            email: Joi.string().email().required(),
            senha: Joi.string().required().min(6).max(20),
            numero: Joi.string().required().min(8).max(15),
            tipo: Joi.string().valid("Conteúdista", "Eventual").required(),
            nascimento: Joi.string().required()
        })
        const {error, value} = schema.validate(req.body)
        if (error) { return resp.status(400).send({ erro: 'Os parâmetros da resposta estão incorretos.', detalhes: error.details });}

        const professorExistente = await verificarLoginProfessor(value.email);
        if (professorExistente) {return resp.status(400).send({ erro: "Esse email já está sendo usado." });}

        const imagemPath = req.file ? req.file.path : null
        if (!imagemPath) { return resp.status(400).send({ erro: 'Imagem é obrigatória.'})}

        const dados = {...value, imagem: imagemPath}
        const resposta = await cadastroProfessor(dados)
        if (!resposta) { return resp.status(400).send({ erro: 'Cadastro não efetuado.'})}
        else { return resp.send({ message: "Usuário adicionado!"})}
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})

//login professor
server.post("/professor/login", async (req, resp)=> {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            senha: Joi.string().required()
        })
        const {error, value} = schema.validate(req.body)
        if (error) { return resp.status(400).send({ erro: 'O parâmetro "email" e "senha" do professor é obrigatório.'})}

        const professor = await verificarLoginProfessor(value.email)
        if (!professor) { return resp.status(400).send({ erro: "Nenhum professor encontrado."})}
        
        const senhaCorreta = await bcrypt.compare(value.senha, professor.senha)
        if (!senhaCorreta) { return resp.status(400).send({ erro: "Senha incorreta."})}

        const resposta = await loginProfessor(value.email)
        if (!resposta) { return resp.status(400).send({ erro: 'Nada foi retornado.'})}
        else if (resposta.length == 0) { return resp.status(400).send({ erro: 'Nenhum dado foi retornado.'})}
        else { return resp.send(resposta)}
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})

//dados professor
server.get("/professor/:idprofessor/dados", async (req, resp)=> {
    try {
        const {idprofessor} = req.params;
        const idschema = Joi.number().integer().positive().required()
        const {error} = idschema.validate(idprofessor)
        if (error) { return resp.status(400).send({ erro: 'O parâmetro "id" do professor é obrigatório.'})}

        const resposta = await dadosprofessor(idprofessor)
        if (!resposta) { return resp.status(400).send({ erro: 'Nada foi retornado.'})}
        else if (resposta.length == 0) { return resp.status(400).send({ erro: 'Nenhum dado foi retornada.'})}
        else { return resp.send(resposta)}
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})




//dados salas professor
server.get("/professor/:idprofessor/dados/salas", async (req, resp)=> {
    try {
        const {idprofessor} = req.params;
        const idschema = Joi.number().integer().positive().required()
        const {error} = idschema.validate(idprofessor)
        if (error) { return resp.status(400).send({ erro: 'O parâmetro "id" do usuário é obrigatório.'})}

        const resposta = await dadosSalasProfessor(idprofessor)
        if (!resposta) { return resp.status(400).send({ erro: 'Nada foi retornado.'})}
        else if (resposta.length == 0) { return resp.status(400).send({ erro: 'Nenhuma sala foi retornada.'})}
        else { return resp.send(resposta)}
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})

//inserir sala
server.post('/professor/:idprofessor/novo/sala', uploadSala.single('imagem'), async (req, resp) => {
    try {
        const {idprofessor} = req.params;
        const idschema = Joi.number().integer().positive();
        const {error: errorId} = idschema.validate(idprofessor);
        if (errorId) { return resp.status(400).send({ erro: 'O parâmetro "id" do professor é obrigatório.' }); }

        const schema = Joi.object({
            nome: Joi.string().required(),
            desc: Joi.string().required(),
            status: Joi.string().valid("Ativo", "Em desenvolvimento", "Desativado").required()
        });
        const {error, value} = schema.validate(req.body);
        if (error) { return resp.status(400).send({ erro: 'Os parâmetros da resposta estão incorretos.', detalhes: error.details });}

        const imagemPath = req.file ? req.file.path : null;
        if (!imagemPath) { return resp.status(400).send({ erro: 'Imagem é obrigatória.' });}

        const dados = {...value, imagem: imagemPath};
        const resposta = await inserirSala(idprofessor, dados);
        if (resposta.affectedRows === 0) { return resp.status(400).send({ erro: 'Nada foi adicionado.' }); }
        return resp.send(resposta);
    } 
    catch (err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor', detalhes: err.message });
    }
});



//dados TRILHAS professor
server.get("/professor/:idprofessor/dados/trilhas", async (req, resp)=> {
    try {
        const {idprofessor} = req.params;
        const idschema = Joi.number().integer().positive().required()
        const {error} = idschema.validate(idprofessor)
        if (error) { return resp.status(400).send({ erro: 'O parâmetro "id" do usuário é obrigatório.'})}

        const resposta = await dadosTrilhasProfessor(idprofessor)
        if (!resposta) { return resp.status(400).send({ erro: 'Nada foi retornado.'})}
        else if (resposta.length == 0) { return resp.status(400).send({ erro: 'Nenhuma trilha foi retornada.'})}
        else { return resp.send(resposta)}
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})

//insert trilha
server.post('/professor/:idprofessor/novo/trilha', uploadTrilha.single('imagem'), async (req, resp)=> {
    try {
        const {idprofessor} = req.params;
        const idschema = Joi.number().integer().positive();
        const {error: errorId} = idschema.validate(idprofessor);
        if (errorId) { return resp.status(400).send({ erro: 'O parâmetro "id" do professor é obrigatório.' }); }

        const schema = Joi.object({
            nome: Joi.string().required(),
            desc: Joi.string().required(),
            status: Joi.string().valid("Ativo", "Em desenvolvimento", "Desativado").required()
        })
        const {error, value} = schema.validate(req.body);
        if (error) { return resp.status(400).send({ erro: 'Os parâmetros da resposta estão incorretos.', detalhes: error.details });}

        const imagemPath = req.file ? req.file.path : null;
        if (!imagemPath) { return resp.status(400).send({ erro: 'Imagem é obrigatória.' });}

        const dados = {...value, imagem: imagemPath};
        const resposta = await inserirTrilha(idprofessor, dados);
        if (resposta.affectedRows === 0) { return resp.status(400).send({ erro: 'Nada foi adicionado.' }); }
        return resp.send(resposta.insertId);
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor', detalhes: err.message });
    }
})

//inserir trilha na sala
server.post('/professor/:idprofessor/add/trilha', async (req, resp)=> {
    try {
        const {idprofessor} = req.params;
        const idSchema = Joi.number().integer().positive()
        const {error: errorid} = idSchema.validate(idprofessor);
        if (errorid) { return resp.status(400).send({ erro: 'O parâmetro "id" do professor é obrigatório.'})}

        const schema = Joi.object({
            sala: Joi.number().integer().positive().required(),
            trilha: Joi.number().integer().positive().required()
        })
        const {error, value} = schema.validate(req.body)
        if (error) { return resp.status(400).send({ erro: 'O parâmetro "id" da sala e da trilha é obrigatório.'})}

        const resposta = await inserirTrilhaSala(idprofessor, value);
        if (resposta.affectedRows === 0) { return resp.status(400).send({ erro: 'Nada foi adicionado.' }); }
        return resp.send(resposta);
    } 
    catch (err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor', detalhes: err.message });
    }
});



//dados AVISOS professor
server.get("/professor/:idprofessor/dados/avisos", async (req, resp)=> {
    try {
        const {idprofessor} = req.params;
        const idschema = Joi.number().integer().positive().required()
        const {error} = idschema.validate(idprofessor)
        if (error) { return resp.status(400).send({ erro: 'O parâmetro "id" do usuário é obrigatório.'})}

        const resposta = await dadosAvisosProfessor(idprofessor)
        if (!resposta) { return resp.status(400).send({ erro: 'Nada foi retornado.'})}
        else if (resposta.length == 0) { return resp.status(400).send({ erro: 'Nenhum aviso foi retornado.'})}
        else { return resp.send(resposta)}
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})

//inserir aviso
server.post('/professor/:idprofessor/novo/aviso', uploadAviso.single('imagem'), async (req, resp)=> {
    try {
        const {idprofessor} = req.params;
        const idschema = Joi.number().integer().positive();
        const {error: errorId} = idschema.validate(idprofessor);
        if (errorId) { return resp.status(400).send({ erro: 'O parâmetro "id" do professor é obrigatório.' }); }

        const schema = Joi.object({
            nome: Joi.string().required(),
            desc: Joi.string().required(),
            video: Joi.string().required(),
            comentarios: Joi.boolean().required(),
            status: Joi.string().valid("Ativo", "Desativado").required()
        })
        const {error, value} = schema.validate(req.body);
        if (error) { return resp.status(400).send({ erro: 'Os parâmetros da resposta estão incorretos.', detalhes: error.details });}

        const imagemPath = req.file ? req.file.path : "Nenhuma imagem adicionada.";

        const dados = {...value, imagem: imagemPath};
        const resposta = await inserirAviso(idprofessor, dados);
        if (resposta.affectedRows === 0) { return resp.status(400).send({ erro: 'Nada foi adicionado.' }); }
        return resp.send(resposta.insertId);
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor', detalhes: err.message });
    }
})



//dados TRANSMISSOES professor
server.get("/professor/:idprofessor/dados/transmissoes", async (req, resp)=> {
    try {
        const {idprofessor} = req.params;
        const idschema = Joi.number().integer().positive().required()
        const {error} = idschema.validate(idprofessor)
        if (error) { return resp.status(400).send({ erro: 'O parâmetro "id" do usuário é obrigatório.'})}

        const resposta = await dadosTransmissoesProfessor(idprofessor)
        if (!resposta) { return resp.status(400).send({ erro: 'Nada foi retornado.'})}
        else if (resposta.length == 0) { return resp.status(400).send({ erro: 'Nenhuma transmissão foi retornada.'})}
        else { return resp.send(resposta)}
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})

//inserir transmissao
server.post('/professor/:idprofessor/novo/transmissao', uploadTransmissao.single('imagem'), async (req, resp)=> {
    try {
        const {idprofessor} = req.params;
        const idschema = Joi.number().integer().positive();
        const {error: errorId} = idschema.validate(idprofessor);
        if (errorId) { return resp.status(400).send({ erro: 'O parâmetro "id" do professor é obrigatório.' }); }

        const schema = Joi.object({
            nome: Joi.string().required(),
            desc: Joi.string().required(),
            video: Joi.string().required(),
            comentarios: Joi.boolean().required(),
            status: Joi.string().valid("Ativo", "Em andamento", "Desativado").required()
        })
        const {error, value} = schema.validate(req.body);
        if (error) { return resp.status(400).send({ erro: 'Os parâmetros da resposta estão incorretos.', detalhes: error.details });}

        const imagemPath = req.file ? req.file.path : null;
        if (!imagemPath) { return resp.status(400).send({ erro: 'Imagem é obrigatória.' });}

        const dados = {...value, imagem: imagemPath};
        const resposta = await inserirTransmissao(idprofessor, dados);
        if (resposta.affectedRows === 0) { return resp.status(400).send({ erro: 'Nada foi adicionado.' }); }
        return resp.send(resposta.insertId);
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor', detalhes: err.message });
    }
})



//dados atividades professor
server.get("/professor/:idprofessor/dados/atividades", async (req, resp)=> {
    try {
        const {idprofessor} = req.params;
        const idschema = Joi.number().integer().positive().required()
        const {error} = idschema.validate(idprofessor)
        if (error) { return resp.status(400).send({ erro: 'O parâmetro "id" do usuário é obrigatório.'})}

        const resposta = await dadosAtividadesProfessor(idprofessor)
        if (!resposta) { return resp.status(400).send({ erro: 'Nada foi retornado.'})}
        else if (resposta.length == 0) { return resp.status(400).send({ erro: 'Nenhuma atividade foi retornada.'})}
        else { return resp.send(resposta)}
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor' });
    }
})

//inserir atividade
server.post('/professor/:idprofessor/novo/atividade', uploadAtividade.single('imagem'), async (req, resp)=> {
    try {
        const {idprofessor} = req.params;
        const idschema = Joi.number().integer().positive();
        const {error: errorId} = idschema.validate(idprofessor);
        if (errorId) { return resp.status(400).send({ erro: 'O parâmetro "id" do professor é obrigatório.' }); }

        const schema = Joi.object({
            nome: Joi.string().required(),
            desc: Joi.string().required(),
            video: Joi.string().required(),
            comentarios: Joi.boolean().required(),
            status: Joi.string().valid("Ativo", "Em desenvolvimento", "Desativado").required()
        })
        const {error, value} = schema.validate(req.body);
        if (error) { return resp.status(400).send({ erro: 'Os parâmetros da resposta estão incorretos.', detalhes: error.details });}

        const imagemPath = req.file ? req.file.path : null;
        if (!imagemPath) { return resp.status(400).send({ erro: 'Imagem é obrigatória.' });}

        const dados = {...value, imagem: imagemPath};
        const resposta = await inserirAtividade(idprofessor, dados);
        if (resposta.affectedRows === 0) { return resp.status(400).send({ erro: 'Nada foi adicionado.' }); }
        return resp.send(resposta.insertId);
    }
    catch(err) {
        console.error('Erro interno no servidor:', err);
        resp.status(500).send({ erro: 'Erro interno no servidor', detalhes: err.message });
    }
})

export default server;