import axios from 'axios';

const api = axios.create({ baseURL: "http://localhost:5000" });

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
