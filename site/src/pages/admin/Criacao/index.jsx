import './index.scss';
import { useEffect, useState } from 'react';
import storage from 'local-storage';

// Conexões
import { dadosAtividadesProfessorCon, dadosAvisosProfessorCon, dadosTransmissoesProfessorCon, dadosTrilhasProfessorCon, inserirAtividadeCon, inserirAvisoCon, inserirTransmissaoCon, inserirTrilhaCon, inserirTrilhaSalaCon } from '../../../connection/professorConnection';
import { dadosSalasCon } from '../../../connection/userConnection';

// Componentes
import BarraLateral from '../../../components/admin/barraLateral';
import Titulo from '../../../components/user/titulo';
import Card from '../../../components/user/card';
import ErrorCard from '../../../components/user/error';

// Outros
import { toast } from 'react-toastify';

export default function Criacao() {
    const professor = storage.get('professor');
    const [section, setSection] = useState(1);
    const [trilhas, setTrilhas] = useState([]);
    const [avisos, setAvisos] = useState([]);
    const [transmissoes, setTransmissoes] = useState([]);
    const [atividades, setAtividades] = useState([])
    const [salas, setSalas] = useState([]);
    const [loading, setLoading] = useState(true);

    async function Trilhas() {
        setTrilhas("Loading");
        try {
            const resposta = await dadosTrilhasProfessorCon(professor.map(item => item.id));
            if (Array.isArray(resposta)) {
                setTrilhas(resposta);
            } else {
                setTrilhas([]);
            }
        } catch {
            setTrilhas("Nenhuma trilha encontrada.");
        }
    }

    async function Avisos() {
        setAvisos("Loading");
        try {
            const resposta = await dadosAvisosProfessorCon(professor.map(item => item.id));
            if (Array.isArray(resposta)) {
                setAvisos(resposta);
            } else {
                setAvisos([]);
            }
        } catch {
            setAvisos("Nenhum aviso encontrado.");
        }
    }

    async function Transmissoes() {
        setTransmissoes("Loading");
        try {
            const resposta = await dadosTransmissoesProfessorCon(professor.map(item => item.id));
            if (Array.isArray(resposta)) {
                setTransmissoes(resposta);
            } else {
                setTransmissoes([]);
            }
        } catch {
            setTransmissoes("Nenhuma transmissão encontrada.");
        }
    }

    async function Atividades() {
        setAtividades("Loading");
        try {
            const resposta = await dadosAtividadesProfessorCon(professor.map(item => item.id));
            if (Array.isArray(resposta)) {
                setAtividades(resposta);
            } else {
                setAtividades([]);
            }
        } catch {
            setAtividades("Nenhuma atividade encontrada.");
        }
    }

    async function minhasSalas() {
        setSalas("Loading");
        try {
            const resposta = await dadosSalasCon(professor.map(item => item.id));
            if (Array.isArray(resposta)) {
                setSalas(resposta);
            } else {
                setSalas([]);
            }
        } catch (error) {
            setSalas("Nenhuma sala encontrada.");
        }
    }

    useEffect(() => {
        async function load() {
            setLoading(true);
            await Trilhas();
            await Avisos();
            await Transmissoes();
            await Atividades();
            await minhasSalas();
            setLoading(false);
        }
        load();
    }, []);

    const [cardadd, setCardadd] = useState(false);
    const [nome, setNome] = useState("");
    const [desc, setDesc] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [video, setVideo] = useState("");
    const [comentarios, setComentarios] = useState(false);
    const [status, setStatus] = useState("Ativo");
    const [salaAdd, setSalaAdd] = useState([]);

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

    const handleClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleCreate = async () => {
        try {
            if (nome !== "" && desc !== "" && selectedImage !== null && video != "") {
                const imgFile = document.getElementById('fileInput').files[0];

                if (section == 1) {
                    await inserirTrilhaCon(professor.map(item => item.id), nome, desc, imgFile);          
                } else if (section == 2) {
                    await inserirAvisoCon(professor.map(item => item.id), nome, desc, imgFile, video, comentarios, status);
                } else if (section == 3) {
                    await inserirTransmissaoCon(professor.map(item => item.id), nome, desc, imgFile, video, comentarios, status);
                } else if (section == 4) {
                    await inserirAtividadeCon(professor.map(item => item.id), nome, desc, imgFile, video, comentarios, status);
                }

                toast.dark("Criado!");
                setNome('');
                setDesc('');
                setSelectedImage(null);
                setCardadd(false);
            } else {
                toast.dark("Você não inseriu todos os dados!");
            }
        } catch {
            toast.dark("Não foi possível criar uma nova sala.");
        } finally {
            Trilhas();
            Avisos();
            Transmissoes();
        }
    };

    return (
        <section className='Criacao'>
            <BarraLateral page={"criacao"} />
            <Titulo nome={"Criação"} />

            {cardadd && (
                <main className='FundoEscuro'>
                    <section className='Card normalPadding min cor1 border'>
                        <div className='Titulo'>
                            <button onClick={() => setCardadd(false)} className='b cor3'>
                                <img src='/assets/images/icones/voltar.png' alt="Voltar" />
                            </button>
                            <section className='NomeTitulo cem cor3'>
                                <h3>Criar {section == 1 && "nova trilha"}  {section == 2 && "novo aviso"}  {section == 3 && "nova transmissão"} {section == 4 && "nova atividade"}</h3>
                            </section>
                        </div>

                        <section onClick={handleClick} className='AddImage cor2 border'>
                            {selectedImage ? (
                                <img className='fundo' src={selectedImage} alt="Uploaded" />
                            ) : (
                                <img className='meio fourty' src='/assets/images/icones/mais.png' alt="Adicionar imagem" />
                            )}
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                        </section>

                        <input
                            onChange={(e) => setNome(e.target.value)}
                            value={nome}
                            placeholder='Digite o nome'
                            className='cor2 border'
                        />
                        <section className="DescCard border cor2">
                            <div className='linha'></div>
                            <textarea
                                onChange={(e) => setDesc(e.target.value)}
                                value={desc}
                                placeholder='Digite a descrição'
                                className='cor2 border'
                            />
                        </section>

                        {section !== 1 &&
                        <>
                        <input
                            onChange={(e) => setVideo(e.target.value)}
                            value={video}
                            placeholder='Endereço do vídeo'
                            className='cor2 border'
                        />
                        <section className='SectionButtons default'>
                            <button onClick={()=> setComentarios(!comentarios)} className={`b cor3 cem ${comentarios == true && "selecionado"}`}>Comentários</button>
                            <button onClick={()=> setStatus(status != "Ativo" ? "Ativo" : "Desativado")} className={`b cor3 cem ${status == "Ativo" && "selecionado"}`}>{status == "Ativo" ? "Ativo" : "Desativado"}</button>
                        </section>
                        </>}

                        <select className='cor2 border' onChange={(e)=> setSalaAdd(e.target.value)} value={salaAdd}>
                           {section !== 4 ? (
                            <>
                            <option value="Adicionar em nenhuma sala">Adicionar em nenhuma sala</option>
                            {Array.isArray(salas) && salas.length !== 0 && salas.map(item => (
                                <option key={item.id} value={item.id}>{item.nome}</option>
                            ))}
                            <option value="Adicionar em todas">Adicionar em todas</option>
                            </>
                           ) : (
                            <>
                            <option value="Adicionar em nenhuma trilha">Adicionar em nenhuma trilha</option>
                            {Array.isArray(trilhas) && trilhas.length !== 0 && trilhas.map(item => (
                                <option key={item.id} value={item.id}>{item.nome}</option>
                            ))}
                            <option value="Adicionar em todas">Adicionar em todas</option>
                            </>
                           )}
                        </select>
                        <button onClick={() => handleCreate()} className='b cor3 cem'>Criar</button>
                    </section>
                </main>
            )}

            <section onClick={() => setCardadd(true)} className='AddButton cor1 border marginTop'>
                <img className='meio vinte' src='/assets/images/icones/mais.png' alt="Adicionar nova sala" />
            </section>

            <section className='SectionButtons'>
                <button onClick={() => setSection(1)} className={`b cor3 ${section == 1 && "selecionado"}`}>
                    <img src={`/assets/images/icones/Trilhas${section == 1 ? "PE" : ""}.png`} />Trilhas
                </button>
                <button onClick={() => setSection(2)} className={`b cor3 ${section == 2 && "selecionado"}`}>
                    <img src={`/assets/images/icones/Avisos${section == 2 ? "PE" : ""}.png`} />Avisos
                </button>
                <button onClick={() => setSection(3)} className={`b cor3 ${section == 3 && "selecionado"}`}>
                    <img src={`/assets/images/icones/Lives${section == 3 ? "PE" : ""}.png`} />Transmissões
                </button>
                <button onClick={() => setSection(4)} className={`b cor3 ${section == 4 && "selecionado"}`}>
                    <img src={`/assets/images/icones/atividades${section == 4 ? "PE" : ""}.png`} />Atividades
                </button>
            </section>
            <section className='SectionCards'>
                {section == 1 && (
                    (trilhas === "Loading" || trilhas === "Nenhuma trilha encontrada.") ? (
                        <ErrorCard mensagem={trilhas} />
                    ) : (
                        trilhas.map(item =>
                            <Card
                                key={item.id}
                                estilo={2}
                                id={item.id}
                                name={item.nome}
                                desc={item.descricao}
                                img={item.imagem}
                                video={item.video}
                                para={0}
                            />
                        )
                    )
                )}

                {section == 2 && (
                    (avisos === "Loading" || avisos === "Nenhum aviso encontrado.") ? (
                        <ErrorCard mensagem={avisos} />
                    ) : (
                        avisos.map(item =>
                            <Card
                                key={item.id}
                                estilo={2}
                                id={item.id}
                                name={item.nome}
                                desc={item.descricao}
                                img={item.imagem}
                                video={item.video}
                                para={0}
                            />
                        )
                    )
                )}

                {section == 3 && (
                    (transmissoes === "Loading" || transmissoes === "Nenhuma transmissão encontrada.") ? (
                        <ErrorCard mensagem={transmissoes} />
                    ) : (
                        transmissoes.map(item =>
                            <Card
                                key={item.id}
                                estilo={2}
                                id={item.id}
                                name={item.nome}
                                desc={item.descricao}
                                img={item.imagem}
                                video={item.video}
                                para={0}
                            />
                        )
                    )
                )}

                {section == 4 && (
                    (atividades === "Loading" || atividades === "Nenhuma atividade encontrada.") ? (
                        <ErrorCard mensagem={atividades} />
                    ) : (
                        atividades.map(item =>
                            <Card
                                key={item.id}
                                estilo={1}
                                id={item.id}
                                name={item.nome}
                                desc={item.descricao}
                                img={item.imagem}
                                video={item.video}
                                para={0}
                            />
                        )
                    )
                )}
            </section>
        </section>
    );
}
