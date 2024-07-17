import axios from 'axios';

const api = axios.create({ baseURL: "http://localhost:5000" });

export async function cadastroAlunoCon(nome, email, senha, imagem, tipo, numero, nascimento) {
    try {
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('email', email);
        formData.append('senha', senha);
        formData.append('imagem', imagem);
        formData.append('tipo', tipo);
        formData.append('numero', numero);
        formData.append('nascimento', nascimento);

        const resposta = await api.post(`/aluno/cadastro`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        if (resposta.data.erro) {
            throw new Error(resposta.data.erro); 
        }

        return resposta.data; 
    } catch (error) {
        console.error('Erro ao efetuar cadastro do aluno:', error.message);
        throw new Error(`Erro ao efetuar cadastro do aluno: ${error.message}`);
    }
}

export async function loginAlunoCon(email, senha) {
    try {
        const resposta = await api.post(`/aluno/login`, {
            email: email,
            senha: senha
        })
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao efetuar login do aluno:', error);
        throw new Error(`Erro ao efetuar login do aluno: ${error.message}`);
    }
}

export async function dadosAlunoCon(idaluno) {
    try {
        const resposta = await api.get(`/aluno/${idaluno}/dados`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao ao consultar dados do aluno:', error);
        throw new Error(`Erro ao ao consultar dados do aluno: ${error.message}`);
    }
}

export async function entrarSalaCon(idaluno, idsala, idprofessor) {
    try {
        const resposta = await api.post(`/aluno/${idaluno}/entrar/sala`, {
            sala: idsala,
            professor: idprofessor
        })
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados da sala:', error);
        throw new Error(`Erro ao obter dados da sala: ${error.message}`);
    }
}

export async function dadosMinhaSalaCon(idaluno) {
    try {
        const resposta = await api.get(`/aluno/${idaluno}/dados/minhasala`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados da sala:', error);
        throw new Error(`Erro ao obter dados da sala: ${error.message}`);
    }
}




export async function proximaAtividadeCon(idaluno, idatividade) {
    try {
        const resposta = await api.post(`/aluno/${idaluno}/proxima/atividade/${idatividade}`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao passar para o próximo vídeo:', error);
        throw new Error(`Erro ao passar para o próximo vídeo: ${error.message}`);
    }
}

export async function inserirFeitoConteudoCon(idaluno, idatividade) {
    try {
        const resposta = await api.post(`/aluno/${idaluno}/feito/atividade/${idatividade}/conteudo`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao inserir feito nessa atividade:', error);
        throw new Error(`Erro ao inserir feito nessa atividade: ${error.message}`);
    }
}

export async function inserirFeitoLicoesCon(idaluno, idatividade) {
    try {
        const resposta = await api.post(`/aluno/${idaluno}/feito/atividade/${idatividade}/licoes`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao inserir feito nessa atividade:', error);
        throw new Error(`Erro ao inserir feito nessa atividade: ${error.message}`);
    }
}

export async function inserirResposta(idaluno, idlicao, idalternativa, escrita, nota) {
    try {
        const resposta = await api.post(`/aluno/${idaluno}/responder/licao/${idlicao}`, {
            idalternativa: idalternativa,
            escrita: escrita,
            nota: nota
        })
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao inserir resposta nessa lição:', error);
        throw new Error(`Erro ao inserir resposta nessa lição: ${error.message}`);
    }
}

export function BuscarImagem(imagem){
    return (`${api.getUri()}/${imagem}`)    
}