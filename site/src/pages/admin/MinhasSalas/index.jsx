import './index.scss'
import { useEffect, useState } from 'react'
import storage from 'local-storage';

// Conexões
import { dadosSalasCon } from '../../../connection/userConnection'
import { inserirSalaCon } from '../../../connection/professorConnection'

// Componentes
import BarraLateral from '../../../components/admin/barraLateral'
import Titulo from '../../../components/user/titulo'
import Card from '../../../components/user/card'
import ErrorCard from '../../../components/user/error'

// Outros
import { toast } from 'react-toastify';

export default function MinhasSalas() {
    const professor = storage.get('professor');
    const [section, setSection] = useState(1)
    const [salas, setSalas] = useState([])

    async function minhasSalas() {
        setSalas("Loading")
        try {
            let resposta = await dadosSalasCon(professor.map(item=> item.id))
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



    const [cardadd, setCardadd] = useState(false)
    const [nome, setNome] = useState("")
    const [desc, setDesc] = useState("")
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

    const handleClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleCreateRoom = async () => {
        try {
            if (nome !== "" && desc !== "" && selectedImage !== null) {
                const imgFile = document.getElementById('fileInput').files[0];
                await inserirSalaCon(professor.map(item=> item.id), nome, desc, imgFile)
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
        <section className='MinhasSalas'>
            <BarraLateral page={"minhassalas"} />
            <Titulo nome={"Minhas salas"} />

            {cardadd &&
                <main className='FundoEscuro'>
                    <section className='Card normalPadding min cor1 border'>
                        <div className='Titulo'>
                            <button onClick={() => setCardadd(false)} className='b cor3'> 
                                <img src='/assets/images/icones/voltar.png' alt="Voltar" /> 
                            </button>
                            <section className='NomeTitulo cem cor3'>
                                <h3>Criar nova sala</h3>
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
                        <button onClick={handleCreateRoom} className='b cor3 cem'>Criar</button>
                    </section>
                </main>
            }
            <section onClick={() => setCardadd(true)} className='AddButton cor1 border marginTop'>
                <img className='meio vinte' src='/assets/images/icones/mais.png' alt="Adicionar nova sala" />
            </section>

            <section className='SectionButtons'>
                <button onClick={()=> setSection(1)} className={`b cor3 ${section == 1 && "selecionado"}`}> <img src={`/assets/images/icones/salas${section == 1 ? "PE" : ""}.png`}/>Salas</button>
                <button onClick={()=> setSection(2)} className={`b cor3 ${section == 2 && "selecionado"}`}> <img src={`/assets/images/icones/Avisos${section == 2 ? "PE" : ""}.png`}/>Informações</button>
            </section>
            <section className='SectionCards'>

                {section == 1 &&
                <>
                {(salas == "Loading" || salas == "Nenhuma sala encontrada.") 
                ? <ErrorCard mensagem={salas} />
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
                <ErrorCard mensagem={"Essa função ainda não está disponível."} />
                }
            </section>
        </section>
    )
}
