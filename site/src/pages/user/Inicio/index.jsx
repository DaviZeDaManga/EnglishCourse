import { useNavigate } from 'react-router-dom'
import './index.scss'
import { useState, useRef } from 'react'

import { cadastroAlunoCon, loginAlunoCon } from '../../../connection/alunoConnection.js';

//outros
import { toast } from 'react-toastify';
import { cadastroProfessorCon, loginProfessorCon } from '../../../connection/professorConnection.js';

export default function Inicio() {
    const [section, setSection] = useState("aluno")
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [numero, setNumero] = useState("");
    const [tipo, setTipo] = useState("");
    const [nascimento, setNascimento] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const navigate = useNavigate()

    const handleCreateAccount = async () => {
        try {
            if (nome && email && senha && numero && tipo && nascimento && selectedImage) {
                const imgFile = document.getElementById('fileInput').files[0];
                const indiceT = nascimento.indexOf("T")
                
                if (section == "aluno") {
                    const response = await cadastroAlunoCon(nome, email, senha, imgFile, tipo, numero, nascimento.substring(indiceT, nascimento.length));

                    if (response.erro) { toast.dark(response.erro); } 
                    else {
                        toast.dark("Cadastro realizado com sucesso!");
                        try {
                            let dadosAluno = await loginAlunoCon(email, senha)
                            localStorage.setItem("aluno", JSON.stringify(dadosAluno))
                            navigate(`/user/minhaconta`)
                        }
                        catch { toast.dark("Erro ao fazer login")}
                    }
                }
                if (section == "professor") {
                    const response = await cadastroProfessorCon(nome, email, senha, imgFile, tipo, numero, nascimento.substring(indiceT, nascimento.length));

                    if (response.erro) { toast.dark(response.erro); } 
                    else {
                        toast.dark("Cadastro realizado com sucesso!");
                        try {
                            let dadosProfessor = await loginProfessorCon(email, senha)
                            localStorage.setItem("professor", JSON.stringify(dadosProfessor))
                            navigate(`/admin/minhaconta`)
                        }
                        catch { toast.dark("Erro ao fazer login")}
                    }
                }

            } else {
                toast.dark("Você não inseriu todos os dados necessários!");
            }
        } catch (error) {
            console.error('Erro ao cadastrar:', error.message);
            toast.dark("Não foi possível criar uma nova conta.");
        }
    };

    // navigate(`/professor/minhaconta`)

    return (
        <section className='Inicio'>
            <section className='Card normalPadding min cor1 border'>
                <div className='Titulo'>
                    <section onClick={()=> setSection(section != "aluno" ? "aluno" : "professor")} className='NomeTitulo cem cor3'>
                        <h3>Cadastro de {section == "aluno" ? "aluno" : "professor"}</h3>
                    </section>
                </div>

                <section onClick={() => document.getElementById('fileInput').click()} className='Img cor2 border'>
                    {selectedImage ? (
                        <img className='fundo' src={selectedImage} alt="Uploaded" />
                    ) : (
                        <img className='meio vinte' src='/assets/images/icones/mais.png' alt="Adicionar imagem" />
                    )}
                    <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />
                </section>

                {/* Inputs para os dados do aluno */}
                <input
                    onChange={(e) => setNome(e.target.value)}
                    value={nome}
                    placeholder='Digite o nome'
                    className='cor2 border'
                />
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder='Email'
                    className='cor2 border'
                />
                <input
                    onChange={(e) => setSenha(e.target.value)}
                    value={senha}
                    placeholder='Senha'
                    className='cor2 border'
                />
                <input
                    onChange={(e) => setNumero(e.target.value)}
                    value={numero}
                    placeholder='Número de celular'
                    className='cor2 border'
                />
                <input
                    onChange={(e) => setTipo(e.target.value)}
                    value={tipo}
                    placeholder='Nível'
                    className='cor2 border'
                />
                <input
                    type="date"
                    onChange={(e) => setNascimento(e.target.value)}
                    value={nascimento}
                    placeholder="Data de nascimento"
                    className="cor2 border"
                />

                {/* Botão para criar conta */}
                <button onClick={handleCreateAccount} className='b cor3 cem'>Criar</button>
            </section>
        </section>
    );
}
