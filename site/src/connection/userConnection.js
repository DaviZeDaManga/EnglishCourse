import axios from 'axios'

const api = axios.create({ baseURL: "http://localhost:5000" })
const userDadosUrl = (iduser) => `/user/${iduser}/dados`



export function BuscarImagem(imagem){
    return (`${api.getUri()}/${imagem}`)    
}