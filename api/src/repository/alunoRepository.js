import { conx } from "./connection.js";
import bcrypt from "bcrypt"

//cadastro aluno
export async function cadastroAluno(dados) {
    const comando = `
        INSERT INTO tb_alunos (nm_nome, ds_email, ds_senha, img_imagem, ds_numero, ds_tipo, ds_status, dt_nascimento)
        VALUES (?, ?, ?, ?, ?, ?, "Ativo", ?);`;

    try {
        const hash = await bcrypt.hash(dados.senha, 10);
        const [linhas] = await conx.query(comando, [dados.nome, dados.email, hash, dados.imagem, dados.numero, dados.tipo, dados.nascimento]);
        return linhas;
    } catch (error) {
        console.error('Erro ao executar cadastro do aluno:', error);
        throw error;
    }
}

//login aluno
export async function loginAluno(email) {
    const comando = `
    SELECT 
    ta.id_aluno AS id,
    ta.nm_nome AS nome, 
    ta.ds_email AS email, 
    ta.ds_tipo AS tipo
    FROM tb_alunos ta
    WHERE ta.ds_email = ?`

    try {
        const [linhas] = await conx.query(comando, [email]);
        return linhas;
    } catch (error) {
        console.error('Erro ao executar login do aluno:', error);
        throw error; 
    }
}

//dados aluno
export async function dadosAluno(idaluno) {
    const comando = `
    SELECT 
    ta.id_aluno AS id,
    ta.nm_nome AS nome,
    ta.ds_email AS email,
    ta.img_imagem AS imagem,
    ta.ds_numero AS numero,
    ta.ds_tipo AS tipo,
    ta.ds_status AS status,
    ta.dt_nascimento AS nascimento,
    ts.id_sala AS idSala
    FROM tb_alunos ta
    LEFT JOIN tb_salas_alunos tsa ON ta.id_aluno = tsa.id_aluno
    LEFT JOIN tb_salas ts ON tsa.id_sala = ts.id_sala
    WHERE ta.id_aluno = ?`

    try {
        const [linhas] = await conx.query(comando, [idaluno]);
        return linhas;
    } catch (error) {
        console.error('Erro ao executar consulta dos dados do aluno:', error);
        throw error; 
    }
}

//alterar dados aluno
export async function alterarDadosAluno(idaluno, dados) {
    const comando = `
    UPDATE tb_alunos
    SET
    nm_nome = ?, 
    ds_email = ?, 
    ds_numero = ?, 
    dt_nascimento = ?
    WHERE id_aluno = ?`

    try {
        const [linhas] = await conx.query(comando, [dados.nome, dados.email, dados.numero, dados.nascimento, idaluno]);
        return linhas;
    } catch (error) {
        console.error('Erro ao executar consulta dos dados do aluno:', error);
        throw error; 
    }
}



//dados SALAS
export async function dadosSalasAluno(idaluno) {
    const comando = `
    SELECT 
    ts.id_sala AS id,
    tp.nm_nome AS nomeProfessor, 
    tp.ds_email AS emailProfessor, 
    tp.img_imagem AS imagemProfessor,
    ts.nm_nome AS nome, 
    ts.ds_descricao AS descricao, 
    ts.img_imagem AS imagem, 
    ts.ds_status AS status,
    ts.dt_criado AS criado,
    (SELECT tsa.ds_status 
    FROM tb_salas_alunos tsa 
    WHERE tsa.id_sala = ts.id_sala 
    AND tsa.id_aluno = ?) AS statusAluno
    FROM tb_salas ts
    INNER JOIN tb_professores tp ON ts.id_professor = tp.id_professor
    WHERE ts.ds_status = "Ativo";`

    try {
        const [linhas] = await conx.query(comando, [idaluno]);
        return linhas;
    } catch (error) {
        console.error('Erro ao executar consulta dos dados das salas:', error);
        throw error; 
    }
}

//solicitar para entrar sala
export async function solicitarEntrarSala(idaluno, idsala) {
    const comando = `
    INSERT INTO tb_salas_alunos (id_sala, id_aluno, ds_status)
    VALUES (?, ?, "Solicitado")`

    try {
        const [resposta] = await conx.query(comando, [idsala, idaluno]);
        return resposta;
    } catch (error) {
        console.error('Erro ao inserir aluno na sala:', error);
        throw error; 
    }
}

//entrar sala
export async function entrarSala(idaluno, idsala) {
    const comando = `
    INSERT INTO tb_salas_alunos (id_sala, id_aluno, ds_status)
    VALUES (?, ?, "Ativo")`

    try {
        const [resposta] = await conx.query(comando, [idsala, idaluno]);
        return resposta;
    } catch (error) {
        console.error('Erro ao inserir aluno na sala:', error);
        throw error; 
    }
}

//sair sala
export async function sairSala(idaluno) {
    const comando = `
    DELETE FROM tb_salas_alunos 
    where id_aluno = ?`

    try {
        const [resposta] = await conx.query(comando, [idaluno]);
        return resposta;
    } catch (error) {
        console.error('Erro ao retirar aluno da sala:', error);
        throw error; 
    }
}

//dados minha sala
export async function dadosMinhaSalaAluno(idaluno) {
    const comando = `
    SELECT 
    ts.id_sala AS id,
    tp.nm_nome AS nomeProfessor, 
    tp.ds_email AS emailProfessor, 
    tp.img_imagem AS imagemProfessor,
    ts.nm_nome AS nome, 
    ts.ds_descricao AS descricao, 
    ts.img_imagem AS imagem, 
    ts.dt_criado AS criado,
    tsa.ds_status AS statusAluno    
    FROM tb_salas ts
    INNER JOIN tb_salas_alunos tsa ON ts.id_sala = tsa.id_sala
    INNER JOIN tb_professores tp ON ts.id_professor = tp.id_professor
    WHERE tsa.id_aluno = ?
    AND tsa.ds_status = "Ativo"`

    const comando2 = `
    select 
    nm_nome AS nome,
    img_imagem AS imagem,
    ds_tipo AS tipo
    FROM tb_salas_alunos tsa
    inner join tb_alunos ta ON ta.id_aluno = tsa.id_aluno
    where tsa.id_sala = ?
    and tsa.ds_status = "Ativo"`

    try {
        const resposta = []
        const [linhas] = await conx.query(comando, [idaluno]);

        for (const linha of linhas) {
            const [linhas2] = await conx.query(comando2, [linha.id])
            resposta.push({
                sala: linha,
                alunos: linhas2
            });
        }

        return resposta;
    } catch (error) {
        console.error('Erro ao executar consulta dos dados da sala:', error);
        throw error; 
    }
}





//dados TRILHAS
export async function dadosTrilhasAluno(idsala, idaluno) {
    const comando = `
    SELECT 
    tt.id_trilha AS id,
    tt.id_professor AS professor, 
    tt.nm_nome AS nome, 
    tt.ds_descricao AS descricao, 
    tt.img_imagem AS imagem, 
    tt.dt_criado AS criado
    FROM tb_trilhas tt
    INNER JOIN tb_trilhas_salas tts ON tt.id_trilha = tts.id_trilha
    LEFT JOIN tb_salas_alunos tsa ON tts.id_sala = tsa.id_sala
    WHERE tts.id_sala = ? 
    AND tsa.id_aluno = ?`

    try {
        const [linhas] = await conx.query(comando, [idsala, idaluno]);
        return linhas;
    } catch (error) {
        console.error('Erro ao executar consulta dos dados das trilhas:', error);
        throw error; 
    }
}

//dados TRILHA
export async function dadosTrilhaAluno(idsala, idtrilha, idaluno) {
    const comando = `
    SELECT 
    tt.id_trilha AS id,
    tt.id_professor AS professor, 
    tt.nm_nome AS nome, 
    tt.ds_descricao AS descricao, 
    tt.img_imagem AS imagem, 
    tt.dt_criado AS criado
    FROM tb_trilhas tt
    INNER JOIN tb_trilhas_salas tts ON tt.id_trilha = tts.id_trilha
    INNER JOIN tb_salas_alunos tsa ON tts.id_sala = tsa.id_sala
    WHERE tts.id_sala = ?
    AND tts.id_trilha = ?
    AND tsa.id_aluno = ?`

    try {
        const [linhas] = await conx.query(comando, [idsala, idtrilha, idaluno]);
        return linhas;
    } catch (error) {
        console.error('Erro ao executar consulta dos dados da trilha:', error);
        throw error; 
    }
}

//dados ATIVIDADES
export async function dadosAtividadesAluno(idsala, idtrilha, idaluno) {
    const comando = `
    WITH AtividadesAluno AS (
        SELECT 
            ta.id_atividade AS id,
            ta.id_professor AS professor, 
            ta.nm_nome AS nome, 
            ta.ds_descricao AS descricao, 
            ta.img_imagem AS imagem, 
            ta.url_video AS video,
            ta.bt_comentarios AS comentarios,
            ta.dt_criado AS criado,
            COALESCE(taf.bt_conteudo, false) AS conteudo,
            CASE 
                WHEN (
                    SELECT COUNT(*)
                    FROM tb_licoes_atividades tla
                    LEFT JOIN tb_licoes tl ON tla.id_licao = tl.id_licao
                    LEFT JOIN tb_alunos_respostas tar 
                    ON tar.id_licao = tla.id_licao AND tar.id_aluno = ?
                    WHERE tla.id_atividade = ta.id_atividade
                    AND (tar.id_licao IS NULL OR tar.id_aluno IS NULL)
                ) = 0 THEN true
                WHEN (
                    SELECT COUNT(*)
                    FROM tb_licoes_atividades tla
                    WHERE tla.id_atividade = ta.id_atividade
                ) = 0 THEN true
                ELSE false
            END AS licoes,
            COALESCE(taf.ds_status, 'Não feita') AS status, 
            ROW_NUMBER() OVER (ORDER BY ta.id_atividade) AS atividade_ordenada
        FROM tb_atividades ta
        LEFT JOIN tb_alunos_feitos taf ON ta.id_atividade = taf.id_atividade AND taf.id_aluno = ?
        INNER JOIN tb_atividades_trilhas tat ON ta.id_atividade = tat.id_atividade
        INNER JOIN tb_trilhas_salas tas ON tat.id_trilha = tas.id_trilha
        INNER JOIN tb_salas_alunos tsa ON tas.id_sala = tsa.id_sala
        WHERE tsa.id_sala = ?
        AND tat.id_trilha = ?
        AND tsa.id_aluno = ?
    )
    SELECT 
        id,
        professor, 
        nome, 
        descricao, 
        imagem, 
        video,
        comentarios,
        criado,
        conteudo,
        licoes,
        CASE 
            WHEN conteudo = true AND licoes = true THEN 'Feito'
            WHEN (SELECT MIN(atividade_ordenada) FROM AtividadesAluno WHERE conteudo = false OR licoes = false) = atividade_ordenada THEN 'Fazendo'
            ELSE 'Não feita'
        END AS status
    FROM AtividadesAluno
    ORDER BY atividade_ordenada;
    `

    try {
        const [linhas] = await conx.query(comando, [idaluno, idaluno, idsala, idtrilha, idaluno]);
        return linhas;
    } catch (error) {
        console.error('Erro ao executar consulta dos dados das atividades:', error);
        throw error; 
    }
}

//dados ATIVIDADE
export async function dadosAtividadeAluno(idsala, idtrilha, idativdade, idaluno) {
    const comando = `
    WITH AtividadesAluno AS (
        SELECT 
            ta.id_atividade AS id,
            ta.id_professor AS professor, 
            ta.nm_nome AS nome, 
            ta.ds_descricao AS descricao, 
            ta.img_imagem AS imagem, 
            ta.url_video AS video,
            ta.bt_comentarios AS comentarios,
            ta.dt_criado AS criado,
            COALESCE(taf.bt_conteudo, false) AS conteudo,
            CASE 
                WHEN (
                    SELECT COUNT(*)
                    FROM tb_licoes_atividades tla
                    LEFT JOIN tb_licoes tl ON tla.id_licao = tl.id_licao
                    LEFT JOIN tb_alunos_respostas tar 
                    ON tar.id_licao = tla.id_licao AND tar.id_aluno = ?
                    WHERE tla.id_atividade = ta.id_atividade
                    AND (tar.id_licao IS NULL OR tar.id_aluno IS NULL)
                ) = 0 THEN true
                WHEN (
                    SELECT COUNT(*)
                    FROM tb_licoes_atividades tla
                    WHERE tla.id_atividade = ta.id_atividade
                ) = 0 THEN true
                ELSE false
            END AS licoes,
            COALESCE(taf.ds_status, 'Não feita') AS status,
            ROW_NUMBER() OVER (ORDER BY ta.id_atividade) AS atividade_ordenada
        FROM tb_atividades ta
        LEFT JOIN tb_alunos_feitos taf ON ta.id_atividade = taf.id_atividade AND taf.id_aluno = ?
        INNER JOIN tb_atividades_trilhas tat ON ta.id_atividade = tat.id_atividade
        INNER JOIN tb_trilhas_salas tas ON tat.id_trilha = tas.id_trilha
        INNER JOIN tb_salas_alunos tsa ON tas.id_sala = tsa.id_sala
        WHERE tsa.id_sala = ?
        AND tat.id_trilha = ?
        AND tsa.id_aluno = ?
    )
    SELECT 
        id,
        professor, 
        nome, 
        descricao, 
        imagem, 
        video,
        comentarios,
        criado,
        conteudo,
        licoes,
        CASE 
            WHEN conteudo = true AND licoes = true THEN 'Feito'
            WHEN (SELECT MIN(atividade_ordenada) FROM AtividadesAluno WHERE conteudo = false OR licoes = false) = atividade_ordenada THEN 'Fazendo'
            ELSE 'Não feita'
        END AS status
    FROM AtividadesAluno
    WHERE id IN (?) -- Substitua pelo ID da atividade específica
    ORDER BY atividade_ordenada;`

    try {
        const [linhas] = await conx.query(comando, [idaluno, idaluno, idsala, idtrilha, idaluno, idativdade]);
        return linhas;
    } catch (error) {
        console.error('Erro ao executar consulta dos dados da atividade:', error);
        throw error; 
    }
}

//dados PALAVRAS
export async function dadosPalavrasAluno(idsala, idtrilha, idativdade, idaluno) {
    const comando = `
    SELECT 
    tp.id_palavra AS id,
    tp.id_professor AS professor, 
    tp.nm_nome AS nome, 
    tp.ds_descricao AS descricao, 
    tp.dt_criado AS criado
    FROM tb_palavras tp
    INNER JOIN tb_palavras_atividades tpa ON tp.id_palavra = tpa.id_palavra
    INNER JOIN tb_atividades_trilhas tat ON tpa.id_atividade = tat.id_atividade
    INNER JOIN tb_trilhas_salas tas ON tat.id_trilha = tas.id_trilha
    INNER JOIN tb_salas_alunos tsa ON tas.id_sala = tsa.id_sala
    WHERE tsa.id_sala = ?
    AND tat.id_trilha = ?
    AND tat.id_atividade = ?
    AND tsa.id_aluno = ?`

    try {
        const [linhas] = await conx.query(comando, [idsala, idtrilha, idativdade, idaluno]);
        return linhas;
    } catch (error) {
        console.error('Erro ao executar consulta dos dados da atividade:', error);
        throw error; 
    }
}

//dados LICOES
export async function dadosLicoesAluno(idsala, idtrilha, idatividade, idaluno) {
    const comando = `
    SELECT 
        tl.id_licao AS id,
        tl.id_professor AS professor, 
        tl.nm_nome AS nome, 
        tl.ds_descricao AS descricao, 
        tl.ds_pergunta AS pergunta,
        tl.ds_tipo AS tipo,
        tar.ds_resposta AS resposta,
        tar.ds_tipo AS resposta_tipo,
        tar.ds_status AS status,
        tar.ds_nota AS nota,
        tl.dt_criado AS criado
    FROM tb_licoes tl
    LEFT JOIN tb_alunos_respostas tar ON tl.id_licao = tar.id_licao AND tar.id_aluno = ?
    INNER JOIN tb_licoes_atividades tla ON tl.id_licao = tla.id_licao
    INNER JOIN tb_atividades_trilhas tat ON tla.id_atividade = tat.id_atividade
    INNER JOIN tb_trilhas_salas tas ON tat.id_trilha = tas.id_trilha
    INNER JOIN tb_salas_alunos tsa ON tas.id_sala = tsa.id_sala
    WHERE tsa.id_sala = ?
    AND tat.id_trilha = ?
    AND tat.id_atividade = ?
    AND tsa.id_aluno = ?`;

    const comando2 = `
    SELECT 
        ta.id_alternativa AS id,
        ta.nm_nome AS nome, 
        ta.ds_descricao AS descricao,
        ta.bt_correto AS correto,
        tar.ds_nota AS nota
    FROM tb_alternativas ta
    LEFT JOIN tb_alunos_respostas tar ON ta.id_alternativa = tar.ds_resposta AND tar.id_licao = ?
    WHERE ta.id_licao = ?`;

    try {
        const resposta = [];
        const [licoes] = await conx.query(comando, [idaluno, idsala, idtrilha, idatividade, idaluno]);

        for (let i = 0; i < licoes.length; i++) {
            const idLicao = licoes[i].id;

            const [alternativas] = await conx.query(comando2, [idLicao, idLicao]);

            resposta.push({
                licao: licoes[i],
                alternativas: alternativas
            });
        }

        return resposta;
    } catch (error) {
        console.error('Erro ao executar consulta dos dados da atividade:', error);
        throw error; 
    }
}





//dados AVISOS
export async function dadosAvisosAluno(idsala, idaluno) {
    const comando = `
    SELECT 
    ta.id_aviso AS id,
    ta.id_professor AS professor, 
    ta.nm_nome AS nome, 
    ta.ds_descricao AS descricao, 
    ta.img_imagem AS imagem, 
    ta.url_video AS video,
    ta.dt_criado AS criado
    FROM tb_avisos ta
    INNER JOIN tb_avisos_salas tas ON ta.id_aviso = tas.id_aviso
    INNER JOIN tb_salas_alunos tsa ON tas.id_sala = tsa.id_sala
    WHERE tas.id_sala = ?
    AND tsa.id_aluno = ?`

    try {
        const [linhas] = await conx.query(comando, [idsala, idaluno, idaluno]);
        return linhas;
    } catch (error) {
        console.error('Erro ao executar consulta dos dados dos avisos:', error);
        throw error; 
    }
}

//dados AVISO
export async function dadosAvisoAluno(idsala, idaviso, idaluno) {
    const comando = `
    SELECT 
    ta.id_aviso AS id,
    ta.id_professor AS professor, 
    ta.nm_nome AS nome, 
    ta.ds_descricao AS descricao, 
    ta.img_imagem AS imagem, 
    ta.url_video AS video,
    ta.bt_comentarios AS comentarios,
    ta.ds_status AS status,
    ta.dt_criado AS criado
    FROM tb_avisos ta
    INNER JOIN tb_avisos_salas tas ON ta.id_aviso = tas.id_aviso
    INNER JOIN tb_salas_alunos tsa ON tas.id_sala = tsa.id_sala
    WHERE tas.id_sala = ?
    AND tas.id_aviso = ?
    AND tsa.id_aluno = ?`

    try {
        const [linhas] = await conx.query(comando, [idsala, idaviso, idaluno]);
        return linhas;
    } catch (error) {
        console.error('Erro ao executar consulta dos dados do aviso:', error);
        throw error; 
    }
}



//dados TRANSMISSOES
export async function dadosTransmissoesAluno(idsala, idaluno) {
    const comando = `
    SELECT 
    tt.id_transmissao AS id,
    tt.id_professor AS professor, 
    tt.nm_nome AS nome, 
    tt.ds_descricao AS descricao, 
    tt.img_imagem AS imagem, 
    tt.url_video AS video,
    tt.dt_criado AS criado
    FROM tb_transmissoes tt
    INNER JOIN tb_transmissoes_salas tts ON tt.id_transmissao = tts.id_transmissao
    INNER JOIN tb_salas_alunos tsa ON tts.id_sala = tsa.id_sala
    WHERE tts.id_sala = ?
    AND tsa.id_aluno = ?`

    try {
        const [linhas] = await conx.query(comando, [idsala, idaluno]);
        return linhas;
    } catch (error) {
        console.error('Erro ao executar consulta dos dados das transmissoes:', error);
        throw error; 
    }
}

//dados TRANSMISSAO
export async function dadosTransmissaoAluno(idsala, idtransmissao, idaluno) {
    const comando = `
    SELECT 
    tt.id_transmissao AS id,
    tt.id_professor AS professor, 
    tt.nm_nome AS nome, 
    tt.ds_descricao AS descricao, 
    tt.img_imagem AS imagem, 
    tt.url_video AS video,
    tt.bt_comentarios AS comentarios,
    tt.ds_status AS status,
    tt.dt_criado AS criado
    FROM tb_transmissoes tt
    INNER JOIN tb_transmissoes_salas tts ON tt.id_transmissao = tts.id_transmissao
    INNER JOIN tb_salas_alunos tsa ON tts.id_sala = tsa.id_sala
    WHERE tts.id_sala = ?
    AND tts.id_transmissao = ?
    AND tsa.id_aluno = ?`

    try {
        const [linhas] = await conx.query(comando, [idsala, idtransmissao, idaluno]);
        return linhas;
    } catch (error) {
        console.error('Erro ao executar consulta dos dados da transmissao:', error);
        throw error; 
    }
}



//inserir feito conteudo
export async function inserirFeitoConteudo(idaluno, idatividade) {
    const comando = `
    INSERT INTO tb_alunos_feitos (id_aluno, id_atividade, bt_conteudo)
    VALUES (?, ?, true)`

    try {
        const [resposta] = await conx.query(comando, [idaluno, idatividade]);
        return resposta;
    } catch (error) {
        console.error('Erro ao inserir feito do aluno da atividade:', error);
        throw error; 
    }
}

//responder
export async function inserirResposta(idaluno, idlicao, dados) {
    const comando = `
    INSERT INTO tb_alunos_respostas (id_aluno, id_licao, ds_resposta, ds_tipo, ds_status, ds_nota)
    VALUES (?, ?, ?, ?, ?, ?);`;

    const verificarAlternativa = `
    SELECT 
    bt_correto AS correto
    FROM tb_alternativas 
    WHERE id_licao = ?
    AND nm_nome = ?`

    try {
        const nota = 0.0
        const [verificar] = await conx.query(verificarAlternativa, [idlicao, dados.resposta])
        if (verificar.correto === true) {nota = 10.0}

        const [resposta] = await conx.query(comando, [idaluno, idlicao, dados.resposta, dados.tipo, dados.status, nota]);
        return resposta;
    } catch (error) {
        console.error('Erro ao inserir resposta do aluno da lição:', error);
        throw error;
    }
}













//verificações
//verificar login
export async function verificarLoginAluno(email) {
    const comando = `
    SELECT 
    ta.ds_email AS email, 
    ta.ds_senha AS senha
    FROM tb_alunos ta
    WHERE ta.ds_email = ?;`

    try {
        const [linhas] = await conx.query(comando, [email]);
        return linhas.length > 0 ? linhas[0] : null; 
    } catch (error) {
        console.error('Erro ao executar verificação do login do aluno:', error);
        throw error; 
    }
} 

//veridicar codigo da sala
export async function verificarCodigoSala(codigo) {
    const comando = `
    SELECT 
    id_sala AS sala
    FROM tb_salas
    WHERE ds_codigo = ?`

    try {
        const [resposta] = await conx.query(comando, [codigo]);
        return resposta.length > 0 ? resposta[0] : null;
    } catch (error) {
        console.error('Erro ao verificar código da sala:', error);
        throw error; 
    }
}

//verificar feito aluno
export async function verificarFeitoAluno(idaluno, idatividade) {
    const comando = `
    select 
    id_alunos_feitos AS id
    from tb_alunos_feitos
    where id_aluno = ?
    and id_atividade = ?;`

    try {
        const [linhas] = await conx.query(comando, [idaluno, idatividade]);
        return linhas.length > 0 ? linhas[0] : null; 
    } catch (error) {
        console.error('Erro ao verificar feito do aluno da atividade:', error);
        throw error; 
    }
}

//verificar resposta aluno
export async function verificarRespostaAluno(idaluno, idlicao) {
    const comando = `
   select 
    id_aluno_resposta AS id
    from tb_alunos_respostas
    where id_aluno = ?
    and id_licao = ?;`

    try {
        const [linhas] = await conx.query(comando, [idaluno, idlicao]);
        return linhas.length > 0 ? linhas[0] : null; 
    } catch (error) {
        console.error('Erro ao verificar resposta do aluno da lição:', error);
        throw error; 
    }
}