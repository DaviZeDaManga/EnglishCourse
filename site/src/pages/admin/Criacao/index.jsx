import './index.scss';
import { useEffect, useState } from 'react';
import storage from 'local-storage';

// Conexões
import { dadosAtividadesProfessorCon, dadosAvisosProfessorCon, dadosSalasProfessorCon, dadosTransmissoesProfessorCon, dadosTrilhasProfessorCon, inserirAtividadeCon, inserirAvisoCon, inserirTransmissaoCon, inserirTrilhaCon, inserirTrilhaSalaCon } from '../../../connection/professorConnection';

// Componentes
import BarraLateral from '../../../components/admin/barraLateral';
import Card from '../../../components/user/card';
import ErrorCard from '../../../components/user/statusCard';
import StatusPage from '../../../components/user/statusPage';

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
            const resposta = await dadosSalasProfessorCon(professor.map(item => item.id));
            setSalas(resposta);
        } catch (error) {
            setSalas("Nenhuma sala encontrada.");
        }
    }

    useEffect(() => {
        async function fetchSectionData() {
            switch (section) {
                case 1:
                    await Trilhas()
                    break;
                case 2:
                    await Avisos()
                    break;
                case 3:
                    await Transmissoes()
                    break
                case 4:
                    await Atividades()
                    break
                default:
                    break
            }
        }
        fetchSectionData();
    }, [section]);

    const [paisagem, setPaisagem] = useState(0);

    useEffect(() => {
        setPaisagem(Math.floor(Math.random() * 6) + 1);
    }, []);

    const [buttons, setButtons] = useState(false)
    const [cardadd, setCardadd] = useState("");
    const [nome, setNome] = useState("Nenhum título adicionado.");
    const [desc, setDesc] = useState("Nenhuma descrição adicionada.");
    const [selectedImage, setSelectedImage] = useState("Nenhuma imagem adicionada.");
    const [video, setVideo] = useState("Nenhum vídeo adicionado.");
    const [comentarios, setComentarios] = useState(false);
    const [status, setStatus] = useState("Ativo");

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
            if (nome !== "" && desc !== "" && selectedImage !== null) {
                const imgFile = document.getElementById('fileInput').files[0];
    
                if (cardadd == "Trilha") {
                    await inserirTrilhaCon(professor.map(item => item.id), nome, desc, imgFile, status);          
                } 
                if (cardadd == "Aviso" || cardadd == "Aviso simples") {
                    await inserirAvisoCon(professor.map(item => item.id), nome, desc, (selectedImage == "Nenhuma imagem adicionada." ? null : imgFile), video, comentarios, status);
                } 
                if (cardadd == "Transmissão") {
                    await inserirTransmissaoCon(professor.map(item => item.id), nome, desc, imgFile, video, comentarios, status);
                } 
                if (cardadd == "Atividade") {
                    await inserirAtividadeCon(professor.map(item => item.id), nome, desc, imgFile, video, comentarios, status);
                }
    
                toast.dark("Criado!");
                resetFormCreate()
            } else {
                toast.dark("Você não inseriu todos os dados!");
            }
        } catch (error) {
            console.error("Erro ao criar:", error);
            toast.dark("Não foi possível criar.");
        } finally {
            try {
                await Trilhas();
                await Avisos();
                await Transmissoes();
                await Atividades();
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        }
    };    

    function resetFormCreate() {
        setNome("Nenhum título adicionado.");
        setDesc("Nenhuma descrição adicionada.");
        setSelectedImage("Nenhuma imagem adicionada.");
        setVideo("Nenhum vídeo adicionado.")
        setCardadd(false);
    }

    return (
        <section className='PageSize'>
            <BarraLateral page={"criacao"} />

            {cardadd != "" && (
                <StatusPage>
                    <section className='Card normalPadding cor1 border'>
                        <section className='Title cor2'>
                            <h3 className="cor2">Criar {cardadd}</h3>
                        </section>

                        {selectedImage != "Nenhuma imagem adicionada." &&
                        <section onClick={handleClick} className='Img cor2 border'>
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
                        </section>}

                        {nome != "Nenhum título adicionado." &&
                        <input
                            onChange={(e) => setNome(e.target.value)}
                            value={nome}
                            placeholder='Digite o nome'
                            className='cor2 border'
                        />}

                        {desc != "Nenhuma descrição adicionada." &&
                        <section className="DescCard border cor2">
                            <div className='linha'></div>
                            <textarea
                                onChange={(e) => setDesc(e.target.value)}
                                value={desc}
                                placeholder='Digite a descrição'
                                className='cor2 border'
                            />
                        </section>}

                        <select className='cor2 border' value={status} onChange={(e)=> setStatus(e.target.value)}>
                            <option value="Ativo">Ativo</option>
                            <option value="Em desenvolvimento">Em desenvolvimento</option>
                            <option value="Desativado">Desativado</option>
                        </select>

                        {video != "Nenhum vídeo adicionado." &&
                        <input
                            onChange={(e) => setVideo(e.target.value)}
                            value={video}
                            placeholder='Endereço do vídeo'
                            className='cor2 border'
                        />}
                        
                        {(cardadd != "Trilha" && cardadd != "Aviso simples") &&
                        <section className='SectionButtons default'>
                            <button onClick={()=> setComentarios(!comentarios)} className={`b cor3 cem ${comentarios == true && "selecionado"}`}>Comentários</button>
                        </section>}
                    
                        <section className='SectionButtons default'>
                            <button onClick={resetFormCreate} className='b cor3 cem'>Cancelar</button>
                            <button onClick={handleCreate} className='b cor3 cem'>Próximo</button>
                        </section>
                    </section>
                </StatusPage>
            )}
            <section className='InfoFundo marginTop cor1 border'>
                <img className='fundo' src={`/assets/images/paisagens/fundo${paisagem}.jpg`} />
                <section className='Escuro'></section>
            </section>
            <section className='SectionButtons'>
                <button onClick={()=> setButtons(!buttons)} className='b min cor3'><img src={`/assets/images/icones/3pontos.png`} /></button>
                {buttons == true &&
                <section className='Buttons cor2 border'>
                    <h3>Criação</h3>
                    <section className='SectionItems cor3 autoH'>
                        <button onClick={()=> (setCardadd("Trilha"), setNome(""), setDesc(""), setSelectedImage(null))} className='b transparente cem'>
                            Trilha
                        </button>
                        <button onClick={()=> (setCardadd("Aviso"), setNome(""), setDesc(""), setSelectedImage(null), setVideo(""))} className='b transparente cem'>
                            Aviso
                        </button>
                        <button onClick={()=> (setCardadd("Aviso simples"), setNome(""), setDesc(""))} className='b transparente cem'>
                            Aviso simples
                        </button>
                        <button onClick={()=> (setCardadd("Transmissão"), setNome(""), setDesc(""), setSelectedImage(null), setVideo(""))} className='b transparente cem'>
                            Transmissão
                        </button>
                        <button onClick={()=> (setCardadd("Atividade"), setNome(""), setDesc(""), setSelectedImage(null), setVideo(""))} className='b transparente cem'>
                            Atividade
                        </button>
                    </section>
                </section>}
                <button onClick={() => setSection(1)} className={`b cor3 nav ${section == 1 && "selecionado"}`}>
                    <img src={`/assets/images/icones/Trilhas${section == 1 ? "PE" : ""}.png`} />Trilhas
                </button>
                <button onClick={() => setSection(2)} className={`b cor3 nav ${section == 2 && "selecionado"}`}>
                    <img src={`/assets/images/icones/Avisos${section == 2 ? "PE" : ""}.png`} />Avisos
                </button>
                <button onClick={() => setSection(3)} className={`b cor3 nav ${section == 3 && "selecionado"}`}>
                    <img src={`/assets/images/icones/Lives${section == 3 ? "PE" : ""}.png`} />Transmissões
                </button>
                <button onClick={() => setSection(4)} className={`b cor3 nav ${section == 4 && "selecionado"}`}>
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

                {section == 3 && (
                    (transmissoes === "Loading" || transmissoes === "Nenhuma transmissão encontrada.") ? (
                        <ErrorCard mensagem={transmissoes} />
                    ) : (
                        transmissoes.map(item =>
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
