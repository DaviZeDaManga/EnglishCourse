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




export async function entrarSalaCon(idaluno, codigo) {
    try {
        const resposta = await api.post(`/aluno/${idaluno}/entrar/sala`, {
            codigo: codigo
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



export async function dadosTrilhasAlunoCon(idaluno, idsala) {
    try {
        const resposta = await api.get(`/aluno/${idaluno}/dados/sala/${idsala}/trilhas`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados das trilhas:', error);
        throw new Error(`Erro ao obter dados das trilhas: ${error.message}`);
    }
}

export async function dadosTrilhaAlunoCon(idaluno, idsala, idtrilha) {
    try {
        const resposta = await api.get(`/aluno/${idaluno}/dados/sala/${idsala}/trilha/${idtrilha}`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados da trilha:', error);
        throw new Error(`Erro ao obter dados da trilha: ${error.message}`);
    }
}

export async function dadosAtividadesAlunoCon(idaluno, idsala, idtrilha) {
    try {
        const resposta = await api.get(`/aluno/${idaluno}/dados/sala/${idsala}/trilha/${idtrilha}/atividades`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados das atividades:', error);
        throw new Error(`Erro ao obter dados das atividades: ${error.message}`);
    }
}

export async function dadosAtividadeAlunoCon(idaluno, idsala, idtrilha, idatividade) {
    try {
        const resposta = await api.get(`/aluno/${idaluno}/dados/sala/${idsala}/trilha/${idtrilha}/atividade/${idatividade}`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados da atividade:', error);
        throw new Error(`Erro ao obter dados da atividade: ${error.message}`);
    }
}

export async function dadosPalarvasAlunoCon(idaluno, idsala, idtrilha, idatividade) {
    try {
        const resposta = await api.get(`/aluno/${idaluno}/dados/sala/${idsala}/trilha/${idtrilha}/atividade/${idatividade}/palavras`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados das palavras:', error);
        throw new Error(`Erro ao obter dados das palavras: ${error.message}`);
    }
}

export async function dadosLicoesAlunoCon(idaluno, idsala, idtrilha, idatividade) {
    try {
        const resposta = await api.get(`/aluno/${idaluno}/dados/sala/${idsala}/trilha/${idtrilha}/atividade/${idatividade}/licoes`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados das lições:', error);
        throw new Error(`Erro ao obter dados das lições: ${error.message}`);
    }
}




export async function dadosAvisosAlunoCon(idaluno, idsala) {
    try {
        const resposta = await api.get(`/aluno/${idaluno}/dados/sala/${idsala}/avisos`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados dos avisos:', error);
        throw new Error(`Erro ao obter dados dos avisos: ${error.message}`);
    }
}

export async function dadosAvisoAlunoCon(idaluno, idsala, idaviso) {
    try {
        const resposta = await api.get(`/aluno/${idaluno}/dados/sala/${idsala}/aviso/${idaviso}`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados do aviso:', error);
        throw new Error(`Erro ao obter dados do aviso: ${error.message}`);
    }
}



export async function dadosTransmissoesAlunoCon(idaluno, idsala) {
    try {
        const resposta = await api.get(`/aluno/${idaluno}/dados/sala/${idsala}/transmissoes`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados das transmissões:', error);
        throw new Error(`Erro ao obter dados das transmissões: ${error.message}`);
    }
}

export async function dadosTransmissaoAlunoCon(idaluno, idsala, idtransmissao) {
    try {
        const resposta = await api.get(`/aluno/${idaluno}/dados/sala/${idsala}/transmissao/${idtransmissao}`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados da transmissão:', error);
        throw new Error(`Erro ao obter dados da transmissão: ${error.message}`);
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

export async function inserirRespostaCon(idaluno, idlicao, resp, tipo, status) {
    try {
        const resposta = await api.post(`/aluno/${idaluno}/responder/licao/${idlicao}`, {
            resposta: resp,
            tipo: tipo,
            status: status
        })
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao inserir resposta nessa lição:', error);
        throw new Error(`Erro ao inserir resposta nessa lição: ${error.message}`);
    }
}
