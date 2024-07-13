import axios from 'axios'

const api = axios.create({ baseURL: "http://localhost:5000" })
const userDadosUrl = (iduser) => `/user/${iduser}/dados`

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
        console.error('Erro ao obter dados da atividade:', error);
        throw new Error(`Erro ao obter dados da atividade: ${error.message}`);
    }
}











export async function dadosAvisosCon(iduser, idsala) {
    try {
        const resposta = await api.get(`${userDadosUrl(iduser)}/sala/${idsala}/avisos`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados das trilhas:', error);
        throw new Error(`Erro ao obter dados das trilhas: ${error.message}`);
    }
}

export async function dadosTransmissoesCon(iduser, idsala) {
    try {
        const resposta = await api.get(`${userDadosUrl(iduser)}/sala/${idsala}/transmissoes`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados das trilhas:', error);
        throw new Error(`Erro ao obter dados das trilhas: ${error.message}`);
    }
}