import axios from 'axios'

const api = axios.create({ baseURL: "http://localhost:5000" })
const userDadosUrl = (iduser) => `/user/${iduser}/dados`

export async function dadosSalasCon(iduser) {
    try {
        const resposta = await api.get(`${userDadosUrl(iduser)}/salas`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados das salas:', error);
        throw new Error(`Erro ao obter dados das salas: ${error.message}`);
    }
}

export async function dadosSalaCon(iduser, idsala) {
    try {
        const resposta = await api.get(`${userDadosUrl(iduser)}/sala/${idsala}`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados da sala:', error);
        throw new Error(`Erro ao obter dados da sala: ${error.message}`);
    }
}

export async function dadosTrilhasCon(iduser, idsala) {
    try {
        const resposta = await api.get(`${userDadosUrl(iduser)}/sala/${idsala}/trilhas`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados das trilhas:', error);
        throw new Error(`Erro ao obter dados das trilhas: ${error.message}`);
    }
}

export async function dadosTrilhaCon(iduser, idsala, idtrilha) {
    try {
        const resposta = await api.get(`${userDadosUrl(iduser)}/sala/${idsala}/trilha/${idtrilha}`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados da trilha:', error);
        throw new Error(`Erro ao obter dados da trilha: ${error.message}`);
    }
}

export async function dadosAtividadesCon(iduser, idsala, idtrilha) {
    try {
        const resposta = await api.get(`${userDadosUrl(iduser)}/sala/${idsala}/trilha/${idtrilha}/atividades`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados das atividades:', error);
        throw new Error(`Erro ao obter dados das atividades: ${error.message}`);
    }
}

export async function dadosAtividadeCon(iduser, idsala, idtrilha, idatividade) {
    try {
        const resposta = await api.get(`${userDadosUrl(iduser)}/sala/${idsala}/trilha/${idtrilha}/atividade/${idatividade}`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados da atividade:', error);
        throw new Error(`Erro ao obter dados da atividade: ${error.message}`);
    }
}

export async function dadosPalarvasCon(iduser, idsala, idtrilha, idatividade) {
    try {
        const resposta = await api.get(`${userDadosUrl(iduser)}/sala/${idsala}/trilha/${idtrilha}/atividade/${idatividade}/palavras`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados das palavras:', error);
        throw new Error(`Erro ao obter dados das palavras: ${error.message}`);
    }
}

export async function dadosLicoesCon(iduser, idsala, idtrilha, idatividade) {
    try {
        const resposta = await api.get(`${userDadosUrl(iduser)}/sala/${idsala}/trilha/${idtrilha}/atividade/${idatividade}/licoes`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados das lições:', error);
        throw new Error(`Erro ao obter dados das lições: ${error.message}`);
    }
}




export async function dadosAvisosCon(iduser, idsala) {
    try {
        const resposta = await api.get(`${userDadosUrl(iduser)}/sala/${idsala}/avisos`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados dos avisos:', error);
        throw new Error(`Erro ao obter dados dos avisos: ${error.message}`);
    }
}

export async function dadosAvisoCon(iduser, idsala, idaviso) {
    try {
        const resposta = await api.get(`${userDadosUrl(iduser)}/sala/${idsala}/aviso/${idaviso}`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados do aviso:', error);
        throw new Error(`Erro ao obter dados do aviso: ${error.message}`);
    }
}

export async function dadosTransmissoesCon(iduser, idsala) {
    try {
        const resposta = await api.get(`${userDadosUrl(iduser)}/sala/${idsala}/transmissoes`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados das transmissões:', error);
        throw new Error(`Erro ao obter dados das transmissões: ${error.message}`);
    }
}

export async function dadosTransmissaoCon(iduser, idsala, idtransmissao) {
    try {
        const resposta = await api.get(`${userDadosUrl(iduser)}/sala/${idsala}/transmissao/${idtransmissao}`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados da transmissão:', error);
        throw new Error(`Erro ao obter dados da transmissão: ${error.message}`);
    }
}