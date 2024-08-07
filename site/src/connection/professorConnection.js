import axios from 'axios';

const api = axios.create({ baseURL: "http://localhost:5000" });

//cadastro professor
export async function cadastroProfessorCon(nome, email, senha, imagem, tipo, numero, nascimento) {
    try {
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('email', email);
        formData.append('senha', senha);
        formData.append('imagem', imagem);
        formData.append('tipo', tipo);
        formData.append('numero', numero);
        formData.append('nascimento', nascimento);

        const resposta = await api.post(`/professor/cadastro`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        if (resposta.data.erro) {throw new Error(resposta.data.erro); }
        return resposta.data; 
    } catch (error) {
        console.error('Erro ao efetuar cadastro do professor:', error.message);
        throw new Error(`Erro ao efetuar cadastro do professor: ${error.message}`);
    }
}

//login professor
export async function loginProfessorCon(email, senha) {
    try {
        const resposta = await api.post(`/professor/login`, {
            email: email,
            senha: senha
        })
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao efetuar login do professor:', error);
        throw new Error(`Erro ao efetuar login do professor: ${error.message}`);
    }
}

//dados professor
export async function dadosProfessorCon(idprofessor) {
    try {
        const resposta = await api.get(`/professor/${idprofessor}/dados`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao ao consultar dados do professor:', error);
        throw new Error(`Erro ao ao consultar dados do professor: ${error.message}`);
    }
}

//alterar dados professor
export async function alterarDadosProfessorCon(idprofessor, nome, email, numero, nascimento) {
    try {
        const resposta = await api.put(`/professor/${idprofessor}/alterar`, {
            nome: nome,
            email: email,
            numero: numero,
            nascimento: nascimento
        })
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao alterar dados do professor:', error);
        throw new Error(`Erro ao alterar dados do aluno: ${error.message}`);
    }
}


//dados salas professor
export async function dadosSalasProfessorCon(idprofessor) {
    try {
        const resposta = await api.get(`/professor/${idprofessor}/dados/salas`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados das salas:', error);
        throw new Error(`Erro ao obter dados das salas: ${error.message}`);
    }
}

//inserir sala
export async function inserirSalaCon(idprofessor, nome, desc, img, status) {
    try {
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('desc', desc);
        formData.append('imagem', img);
        formData.append('status', status);

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
export async function inserirTrilhaCon(idprofessor, nome, desc, img, status) {
    try {
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('desc', desc);
        formData.append('imagem', img);
        formData.append('status', status);

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

//inserir trilha na sala
export async function inserirTrilhaSalaCon(idprofessor, idsala, idtrilha) {
    try {
        const resposta = await api.post(`/professor/${idprofessor}/add/trilha`, {
            sala: idsala,
            trilha: idtrilha
        })
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados da sala:', error);
        throw new Error(`Erro ao obter dados da sala: ${error.message}`);
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



//dados atividades professor
export async function dadosAtividadesProfessorCon(idprofessor) {
    try {
        const resposta = await api.get(`/professor/${idprofessor}/dados/atividades`)
        return resposta.data
    }
    catch(error) {
        console.error('Erro ao obter dados das atividades:', error);
        throw new Error(`Erro ao obter dados das atividades: ${error.message}`);
    }
}

//inserir atividade
export async function inserirAtividadeCon(idprofessor, nome, desc, img, video, comentarios, status) {
    try {
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('desc', desc);
        formData.append('imagem', img);
        formData.append('video', video);
        formData.append('comentarios', comentarios);
        formData.append('status', status);

        const resposta = await api.post(`/professor/${idprofessor}/novo/atividade`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return resposta.data;
    }
    catch(error) {
        console.error('Erro ao inserir nova atividade:', error);
        throw new Error(`Erro ao inserir nova atividade: ${error.message}`);
    }
}