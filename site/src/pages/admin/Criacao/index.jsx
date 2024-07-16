import './index.scss'
import { useEffect, useState } from 'react'

// Conexões
import { dadosAvisosProfessorCon, dadosTransmissoesProfessorCon, dadosTrilhasProfessorCon, inserirAvisoCon, inserirTransmissaoCon, inserirTrilhaCon } from '../../../connection/professorConnection'

// Componentes
import BarraLateral from '../../../components/admin/barraLateral'
import Titulo from '../../../components/user/titulo'
import Card from '../../../components/user/card'
import ErrorCard from '../../../components/user/error'

// Outros
import { toast } from 'react-toastify';

export default function Criacao() {
    const [section, setSection] = useState(1)
    const [trilhas, setTrilhas] = useState([])
    const [avisos, setAvisos] = useState([])
    const [transmissoes, setTransmissoes] = useState([])

    async function Trilhas() {
        setTrilhas("Loading")
        try {
            let resposta = await dadosTrilhasProfessorCon(1)
            setTrilhas(resposta)
        }
        catch { setTrilhas("Nenhuma trilha encontrada.")}
    }

    async function Avisos() {
        setAvisos("Loading")
        try {
            let resposta = await dadosAvisosProfessorCon(1)
            setAvisos(resposta)
        }
        catch { setAvisos("Nenhum aviso encontrado.")}
    }

    async function Transmissoes() {
        setTransmissoes("Loading")
        try {
            let resposta = await dadosTransmissoesProfessorCon(1)
            setTransmissoes(resposta)
        }
        catch { setTransmissoes("Nenhuma transmissão encontrada.")}
    }

    useEffect(()=> {
        async function load() {
            await Trilhas()
            await Avisos()
            await Transmissoes()
        }
        load()
    }, [])


    
    const [cardadd, setCardadd] = useState(false)
    const [nome, setNome] = useState("")
    const [desc, setDesc] = useState("")
    const [selectedImage, setSelectedImage] = useState(null)
    const [video, setVideo] = useState("")
    const [comentarios, setComentarios] = useState(false)
    const [status, setStatus] = useState("Ativo")

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
                
                if (section == 1) { await inserirTrilhaCon(1, nome, desc, imgFile) }
                else if (section == 2) { await inserirAvisoCon(1, nome, desc, imgFile, video, comentarios, status) }
                else if (section == 3) { await inserirTransmissaoCon(1, nome, desc, imgFile, video, comentarios, status) }

                toast.dark("Criado!")
                setNome('')
                setDesc('')
                setSelectedImage(null)
                setCardadd(false)
            } else {
                toast.dark("Você não inseriu todos os dados!")
            }
        } catch {
            toast.dark("Não foi possível criar uma nova sala.")
        } finally {
            Trilhas()
            Avisos()
            Transmissoes()
        }
    }

    return (
        <section className='Criacao'>
            <BarraLateral page={"criacao"} />
            <Titulo nome={"Criação"} />

            {cardadd &&
                <main className='FundoEscuro'>
                    <section className='AddCard cor1 border'>
                        <div className='Titulo'>
                            <button onClick={() => setCardadd(false)} className='b cor3'> 
                                <img src='/assets/images/icones/voltar.png' alt="Voltar" /> 
                            </button>
                            <section className='NomeTitulo cem cor3'>
                                <h3>Criar {section == 1 && "nova trilha"}  {section == 2 && "novo aviso"}  {section == 3 && "nova transmissão"}</h3>
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
                        <button onClick={()=> handleCreate()} className='b cor3 cem'>Criar</button>
                    </section>
                </main>
            }

            <section className='SectionCards'>
                <section onClick={() => setCardadd(true)} className='AddButton cor1 border'>
                    <img className='meio vinte' src='/assets/images/icones/mais.png' alt="Adicionar nova sala" />
                </section>

                <section className='SectionButtons'>
                    <button onClick={()=> setSection(1)} className={`b cor3 ${section == 1 && "selecionado"}`}> <img src={`/assets/images/icones/Trilhas${section == 1 ? "PE" : ""}.png`}/>Trilhas</button>
                    <button onClick={()=> setSection(2)} className={`b cor3 ${section == 2 && "selecionado"}`}> <img src={`/assets/images/icones/Avisos${section == 2 ? "PE" : ""}.png`}/>Avisos</button>
                    <button onClick={()=> setSection(3)} className={`b cor3 ${section == 3 && "selecionado"}`}> <img src={`/assets/images/icones/Lives${section == 3 ? "PE" : ""}.png`}/>Transmissões</button>
                </section>

                {section == 1 && <>
                {(trilhas == "Loading" || trilhas == "Nenhuma trilha encontrada.") 
                ? <ErrorCard mensagem={trilhas} />
                : <>{trilhas.map( item=>
                    <Card
                    key={item.id}
                    estilo={2}
                    id={item.id}
                    name={item.nome}
                    desc={item.descricao}
                    img={item.imagem}
                    video={item.video}
                    para={0}
                    />)}
                </>} </>}

                {section == 2 && <>
                {(avisos == "Loading" || avisos == "Nenhum aviso encontrado.") 
                ? <ErrorCard mensagem={avisos} />
                : <>{avisos.map( item=>
                    <Card
                    key={item.id}
                    estilo={2}
                    id={item.id}
                    name={item.nome}
                    desc={item.descricao}
                    img={item.imagem}
                    video={item.video}
                    para={0}
                    />)}
                </>} </>}

                {section == 3 && <>
                {(transmissoes == "Loading" || transmissoes == "Nenhuma transmissão encontrada.") 
                ? <ErrorCard mensagem={transmissoes} />
                : <>{transmissoes.map( item=>
                    <Card
                    key={item.id}
                    estilo={2}
                    id={item.id}
                    name={item.nome}
                    desc={item.descricao}
                    img={item.imagem}
                    video={item.video}
                    para={0}
                    />)}
                </>} </>}


            </section>
        </section>
    )
}
