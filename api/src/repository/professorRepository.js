import { conx } from "./connection.js";
import bcrypt from "bcrypt"

//cadastro professor
export async function cadastroProfessor(dados) {
    const comando = `
        INSERT INTO tb_professores (nm_nome, ds_email, ds_senha, img_imagem, ds_numero, ds_tipo, ds_status, dt_nascimento)
        VALUES (?, ?, ?, ?, ?, ?, "Ativo", ?);`;

    try {
        const hash = await bcrypt.hash(dados.senha, 10);
        const [linhas] = await conx.query(comando, [dados.nome, dados.email, hash, dados.imagem, dados.numero, dados.tipo, dados.nascimento]);
        return linhas;
    } catch (error) {
        console.error('Erro ao executar cadastro do professor:', error);
        throw error;
    }
}

//login professor
export async function loginProfessor(email) {
    const comando = `
    SELECT 
    tp.id_professor AS id,
    tp.nm_nome AS nome, 
    tp.ds_email AS email, 
    tp.ds_tipo AS tipo
    FROM tb_professores tp
    WHERE tp.ds_email = ?`

    try {
        const [linhas] = await conx.query(comando, [email]);
        return linhas;
    } catch (error) {
        console.error('Erro ao executar login do professor:', error);
        throw error; 
    }
}

//verificar login
export async function verificarLoginProfessor(email) {
    const comando = `
    SELECT 
    tp.ds_email AS email, 
    tp.ds_senha AS senha
    FROM tb_professores tp
    WHERE tp.ds_email = ?;`

    try {
        const [linhas] = await conx.query(comando, [email]);
        return linhas.length > 0 ? linhas[0] : null; 
    } catch (error) {
        console.error('Erro ao executar verificação do login do professor:', error);
        throw error; 
    }
} 

//dados professor
export async function dadosProfessor(idprofessor) {
    const comando = `
    `

    try {
        const [linhas] = await conx.query(comando, [idaluno]);
        return linhas;
    } catch (error) {
        console.error('Erro ao executar consulta dos dados do aluno:', error);
        throw error; 
    }
}


//gerar random code
function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

//dados salas professor
export async function dadosSalasProfessor(idprofessor) {
    const comando = `
    SELECT 
    ts.id_sala AS id,
    ts.id_professor AS professor, 
    ts.nm_nome AS nome, 
    ts.ds_descricao AS descricao, 
    ts.img_imagem AS imagem, 
    ts.ds_status AS status,
    ts.dt_criado AS criado
    FROM tb_salas ts
    WHERE ts.id_professor = ?`

    try {
        const [linhas] = await conx.query(comando, [idprofessor]);
        return linhas;
    } catch (error) {
        console.error('Erro ao executar consulta dos dados das salas:', error);
        throw error; 
    }
}

//inserir sala
export async function inserirSala(idprofessor, dados) {
    const comando = `
    INSERT INTO tb_salas (id_professor, nm_nome, ds_descricao, img_imagem, ds_status, ds_codigo, dt_criado)
    VALUES (?, ?, ?, ?, ?, ?, curdate());`

    try {
        const codigo = generateRandomCode(25)
        const [resposta] = await conx.query(comando, [idprofessor, dados.nome, dados.desc, dados.imagem, dados.status, codigo])
        return resposta
    }
    catch (error) {
        console.error('Erro ao inserir uma nova sala:', error);
        throw error; 
    }
}



//dados trilhas professor
export async function dadosTrilhasProfessor(idprofessor) {
    const comando = `
    SELECT 
    tt.id_trilha AS id,
    tt.id_professor AS professor, 
    tt.nm_nome AS nome, 
    tt.ds_descricao AS descricao, 
    tt.img_imagem AS imagem, 
    tt.dt_criado AS criado
    FROM tb_trilhas tt
    WHERE tt.id_professor = ?`

    try {
        const [linhas] = await conx.query(comando, [idprofessor]);
        return linhas;
    } catch (error) {
        console.error('Erro ao executar consulta dos dados das trilhas:', error);
        throw error; 
    }
}

//insert trilha
export async function inserirTrilha(idprofessor, dados) {
    const comando = `
    INSERT INTO tb_trilhas (id_professor, nm_nome, ds_descricao, img_imagem, ds_status, dt_criado)
    VALUES (?, ?, ?, ?, ?, CURDATE())`

    try {
        const [resposta] = await conx.query(comando, [idprofessor, dados.nome, dados.desc, dados.imagem, dados.status])
        return resposta
    }
    catch (error) {
        console.error('Erro ao inserir uma nova trilha:', error);
        throw error; 
    }
}

//inserir trilha na sala
export async function inserirTrilhaSala(idprofessor, dados) {
    const comando = `
    INSERT INTO tb_trilhas_salas (id_professor, id_trilha, id_sala)
    VALUES (?, ?, ?);`

    try {
        const [resposta] = await conx.query(comando, [idprofessor, dados.trilha, dados.sala])
        return resposta
    }
    catch (error) {
        console.error('Erro ao inserir uma nova trilha na sala:', error);
        throw error; 
    }
}



//dados avisos professor
export async function dadosAvisosProfessor(idprofessor) {
    const comando = `
    SELECT 
    ta.id_aviso AS id,
    ta.id_professor AS professor, 
    ta.nm_nome AS nome, 
    ta.ds_descricao AS descricao, 
    ta.img_imagem AS imagem, 
    ta.dt_criado AS criado
    FROM tb_avisos ta
    WHERE ta.id_professor = ?`

    try {
        const [linhas] = await conx.query(comando, [idprofessor]);
        return linhas;
    } catch (error) {
        console.error('Erro ao executar consulta dos dados dos avisos:', error);
        throw error; 
    }
}

//insert aviso
export async function inserirAviso(idprofessor, dados) {
    const comando = `
    INSERT INTO tb_avisos (id_professor, nm_nome, ds_descricao, img_imagem, url_video, bt_comentarios, ds_status, dt_criado)
    VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())`

    try {
        const [resposta] = await conx.query(comando, [idprofessor, dados.nome, dados.desc, dados.imagem, dados.video, dados.comentarios, dados.status])
        return resposta
    }
    catch (error) {
        console.error('Erro ao inserir um novo aviso:', error);
        throw error; 
    }
}



//dados transmissoes professor
export async function dadosTransmissoesProfessor(idprofessor) {
    const comando = `
    SELECT 
    tt.id_transmissao AS id,
    tt.id_professor AS professor, 
    tt.nm_nome AS nome, 
    tt.ds_descricao AS descricao, 
    tt.img_imagem AS imagem, 
    tt.dt_criado AS criado
    FROM tb_transmissoes tt
    WHERE tt.id_professor = ?`

    try {
        const [linhas] = await conx.query(comando, [idprofessor]);
        return linhas;
    } catch (error) {
        console.error('Erro ao executar consulta dos dados das transmissões:', error);
        throw error; 
    }
}

//insert transmissao
export async function inserirTransmissao(idprofessor, dados) {
    const comando = `
    INSERT INTO tb_transmissoes (id_professor, nm_nome, ds_descricao, img_imagem, url_video, bt_comentarios, ds_status, dt_criado)
    VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())`

    try {
        const [resposta] = await conx.query(comando, [idprofessor, dados.nome, dados.desc, dados.imagem, dados.video, dados.comentarios, dados.status])
        return resposta
    }
    catch (error) {
        console.error('Erro ao inserir uma nova transmissão:', error);
        throw error; 
    }
}



//dados atividades professor
export async function dadosAtividadesProfessor(idprofessor) {
    const comando = `
    SELECT 
    ta.id_atividade AS id,
    ta.id_professor AS professor, 
    ta.nm_nome AS nome, 
    ta.ds_descricao AS descricao, 
    ta.img_imagem AS imagem, 
    ta.url_video AS video,
    bt_comentarios AS comentarios,
    ds_status AS status,
    ta.dt_criado AS criado
    FROM tb_atividades ta
    WHERE ta.id_professor = ?`

    try {
        const [linhas] = await conx.query(comando, [idprofessor]);
        return linhas;
    } catch (error) {
        console.error('Erro ao executar consulta dos dados das atividades:', error);
        throw error; 
    }
}

//insert atividade
export async function inserirAtividade(idprofessor, dados) {
    const comando = `
    INSERT INTO tb_atividades (id_professor, nm_nome, ds_descricao, img_imagem, url_video, bt_comentarios, ds_status, dt_criado)
    VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())`

    try {
        const [resposta] = await conx.query(comando, [idprofessor, dados.nome, dados.desc, dados.imagem, dados.video, dados.comentarios, dados.status])
        return resposta
    }
    catch (error) {
        console.error('Erro ao inserir uma nova transmissão:', error);
        throw error; 
    }
}