import './index.scss'
import { useEffect, useState } from 'react'
import storage from 'local-storage';

// Conexões
import { dadosSalasProfessorCon, inserirSalaCon } from '../../../connection/professorConnection'

// Componentes
import BarraLateral from '../../../components/admin/barraLateral'
import Titulo from '../../../components/user/titulo'
import Card from '../../../components/user/card'
import StatusCard from '../../../components/user/statusCard'
import StatusPage from '../../../components/user/statusPage';

// Outros
import { toast } from 'react-toastify';

export default function MinhasSalas() {
    const professor = storage.get('professor');
    const [section, setSection] = useState(1)
    const [salas, setSalas] = useState([])

    async function minhasSalas() {
        setSalas("Loading")
        try {
            let resposta = await dadosSalasProfessorCon(professor.map(item=> item.id))
            setSalas(resposta)
        } catch (error) {
            setSalas("Nenhuma sala encontrada.")
        }
    }

    useEffect(() => {
        async function load() {
            await minhasSalas()
        }
        load()
    }, [])

    const [paisagem, setPaisagem] = useState(0);

    useEffect(() => {
        setPaisagem(Math.floor(Math.random() * 6) + 1);
    }, []);

    const [buttons, setButtons] = useState(false)
    const [cardadd, setCardadd] = useState(false)
    const [nome, setNome] = useState("")
    const [desc, setDesc] = useState("")
    const [selectedImage, setSelectedImage] = useState(null);
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

    const handleCreateRoom = async () => {
        try {
            if (nome !== "" && desc !== "" && selectedImage !== null) {
                const imgFile = document.getElementById('fileInput').files[0];
                await inserirSalaCon(professor.map(item=> item.id), nome, desc, imgFile, status)
                toast.dark("Sala criada!")
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
            minhasSalas()
        }
    }

    return (
        <section className='PageSize'>
            <BarraLateral page={"minhassalas"} />

            {cardadd &&
                <StatusPage>
                    <section className='Card normalPadding cor1 border'>
                        <section className='Title cor2'>
                            <h3 className="cor2">Criar sala</h3>
                        </section>

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
                        <select className='cor2 border' value={status} onChange={(e)=> setStatus(e.target.value)}>
                            <option value="Ativo">Ativo</option>
                            <option value="Em desenvolvimento">Em desenvolvimento</option>
                            <option value="Desativado">Desativado</option>
                        </select>
                        <section className='SectionButtons default'>
                            <button onClick={()=> setCardadd(false)} className='b cor3 cem'>Cancelar</button>
                            <button onClick={handleCreateRoom} className='b cor3 cem'>Criar</button>
                        </section>
                    </section>
                </StatusPage>
            }
            <section className='InfoFundo marginTop cor1 border'>
                <img className='fundo' src={`/assets/images/paisagens/fundo${paisagem}.jpg`} />
                <section className='Escuro'></section>
            </section>
            <section className='SectionButtons'>
                <button onClick={()=> setButtons(!buttons)} className='b min cor3'><img src={`/assets/images/icones/3pontos.png`} /></button>
                {buttons == true &&
                <section className='Buttons cor2 border'>
                    <h3>Filtros</h3>
                    <section className='SectionItems cor3 autoH'>
                        <button className='b transparente cem'>
                            Novas
                        </button>
                        <button className='b transparente cem'>
                            Melhores avaliadas
                        </button>
                    </section>
                    <h3>Criação</h3>
                    <section className='SectionItems cor3 autoH'>
                        <button onClick={()=> setCardadd(true)} className='b transparente cem'>
                            Sala
                        </button>
                    </section>
                </section>}
                <button onClick={()=> setSection(1)} className={`b cor3 ${section == 1 && "selecionado"}`}> <img src={`/assets/images/icones/salas${section == 1 ? "PE" : ""}.png`}/>Salas</button>
                <button onClick={()=> setSection(2)} className={`b cor3 ${section == 2 && "selecionado"}`}> <img src={`/assets/images/icones/Avisos${section == 2 ? "PE" : ""}.png`}/>Informações</button>
            </section>
            <section className='SectionCards'>

                {section == 1 &&
                <>
                {(salas == "Loading" || salas == "Nenhuma sala encontrada.") 
                ? <StatusCard mensagem={salas} />
                : <>
                {salas.map( item=>
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
                )}
                </>}
                </>
                }

                {section == 2 &&
                <StatusCard mensagem={"Essa função ainda não está disponível."} />
                }
            </section>
        </section>
    )
}
