import axios from 'axios'

const api = axios.create({ baseURL: "http://localhost:5000" })

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