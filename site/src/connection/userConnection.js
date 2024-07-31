import axios from 'axios'

const api = axios.create({ baseURL: "http://localhost:5000" })
const userDadosUrl = (iduser) => `/user/${iduser}/dados`

export async function dadosSalasCon() {
    try {
        const resposta = await api.get(`/user/dados/salas`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados das salas:', error);
        throw new Error(`Erro ao obter dados das salas: ${error.message}`);
    }
}

export function BuscarImagem(imagem){
    return (`${api.getUri()}/${imagem}`)    
}