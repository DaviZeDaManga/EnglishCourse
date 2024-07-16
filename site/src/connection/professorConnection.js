import axios from 'axios';

const api = axios.create({ baseURL: "http://localhost:5000" });

//inserir sala
export async function inserirSalaCon(idprofessor, nome, desc, img) {
    try {
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('desc', desc);
        formData.append('imagem', img);

        const resposta = await api.post(`/professor/${idprofessor}/novo/sala`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return resposta.data;
    }
    catch(error) {
        console.error('Erro ao inserir nova sala:', error);
        throw new Error(`Erro ao inserir nova sala: ${error.message}`);
    }
}



//dados TRILHAS professor
export async function dadosTrilhasProfessorCon(idprofessor) {
    try {
        const resposta = await api.get(`/professor/${idprofessor}/dados/trilhas`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados das trilhas:', error);
        throw new Error(`Erro ao obter dados das trilhas: ${error.message}`);
    }
}

//inseri trilha
export async function inserirTrilhaCon(idprofessor, nome, desc, img) {
    try {
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('desc', desc);
        formData.append('imagem', img);

        const resposta = await api.post(`/professor/${idprofessor}/novo/trilha`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return resposta.data;
    }
    catch(error) {
        console.error('Erro ao inserir nova trilha:', error);
        throw new Error(`Erro ao inserir nova trilha: ${error.message}`);
    }
}



//dados AVISOS professor
export async function dadosAvisosProfessorCon(idprofessor) {
    try {
        const resposta = await api.get(`/professor/${idprofessor}/dados/avisos`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados dos avisos:', error);
        throw new Error(`Erro ao obter dados dos avisos: ${error.message}`);
    }
}

//inserir aviso
export async function inserirAvisoCon(idprofessor, nome, desc, img, video, comentarios, status) {
    try {
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('desc', desc);
        formData.append('imagem', img);
        formData.append('video', video);
        formData.append('comentarios', comentarios);
        formData.append('status', status);

        const resposta = await api.post(`/professor/${idprofessor}/novo/aviso`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return resposta.data;
    }
    catch(error) {
        console.error('Erro ao inserir novo aviso:', error);
        throw new Error(`Erro ao inserir novo aviso: ${error.message}`);
    }
}



//dados TRANSMISSOES professor
export async function dadosTransmissoesProfessorCon(idprofessor) {
    try {
        const resposta = await api.get(`/professor/${idprofessor}/dados/transmissoes`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados das transmissões:', error);
        throw new Error(`Erro ao obter dados das transmissões: ${error.message}`);
    }
}

//inserir transmissao
export async function inserirTransmissaoCon(idprofessor, nome, desc, img, video, comentarios, status) {
    try {
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('desc', desc);
        formData.append('imagem', img);
        formData.append('video', video);
        formData.append('comentarios', comentarios);
        formData.append('status', status);

        const resposta = await api.post(`/professor/${idprofessor}/novo/transmissao`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return resposta.data;
    }
    catch(error) {
        console.error('Erro ao inserir nova transmissão:', error);
        throw new Error(`Erro ao inserir nova transmissão: ${error.message}`);
    }
}