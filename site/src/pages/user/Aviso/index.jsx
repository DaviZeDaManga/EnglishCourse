import './index.scss'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import storage from 'local-storage';

//conexoes
import { dadosAvisoAlunoCon } from '../../../connection/alunoConnection'
import { BuscarImagem } from '../../../connection/userConnection';

//components
import BarraLateral from '../../../components/user/barraLateral'
import Titulo from '../../../components/user/titulo'
import StatusCard from '../../../components/user/statusCard'
import StatusPage from '../../../components/user/statusPage';

//outros
import { toast } from 'react-toastify';

export default function Aviso() {
    const aluno = storage.get('aluno') || [];
    const {idsala, idaviso} = useParams()
    const [aviso, setAviso] = useState([])
    const [assistir, setAssistir] = useState(false)

    async function dadosAviso() {
        setAviso("Loading")
        try {
            const resposta = await dadosAvisoAlunoCon(aluno.map( item=> item.id), idsala, idaviso);
            setAviso(resposta);
        } catch (error) { 
            console.error("Nenhum aviso encontrado:", error)
            setAviso("Nenhum aviso encontrado.")    
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                await dadosAviso();
            } catch (error) {
                console.error('Erro ao carregar dados do aviso:', error);
                toast.dark("Erro ao carregar dados do aviso.")
            }
        }
        fetchData();
    }, []);

    const [section, setSection] = useState(1)
    const [comentarios, setComentarios] = useState([])

    return(
        <div className='PageSize'>
            <BarraLateral page={"Aviso"}/>
            <Titulo nome={"Aviso"}/>

            {(aviso === "Loading" || aviso === "Nenhum aviso encontrado.") ? (
                <StatusPage status={aviso} />
            ) : (
                <>
                <main className='Video cor1 border marginTop'>
                    <section className='FundoVideo'>
                        {aviso.map( item => 
                            <>
                            {assistir == false && <> <img className='fundo' src={BuscarImagem(item.imagem)}/> <section className='Escuro'></section> </>}
                            {(assistir == false && item.video != "Nenhum vídeo adicionado.") && <img onClick={()=> setAssistir(true)} className='meio icon' src="/assets/images/icones/LivesPE.png" />}
                            {assistir == true && <video controls="true">  <source src={item.video} type="video/mp4" /></video>}
                            </>
                        )}
                    </section>
                </main>

                <section className='SectionButtons'>
                    <button onClick={()=> setSection(1)} className={`b nav cor3 ${section == 1 && "selecionado"}`}> 
                        <img src={`/assets/images/icones/Avisos${section == 1 ? "PE" : ""}.png`} />
                        Informações
                    </button>
                    <button onClick={()=> setSection(2)} className={`b nav cor3 ${section == 2 && "selecionado"}`}> 
                        <img src={`/assets/images/icones/comentario${section == 2 ? "PE" : ""}.png`} />
                        Comentários
                    </button>
                </section>

                <section className='Info'>
                    {section == 1 &&
                    <>
                    <section className='Card cem cor1 border'>
                        <section className='Title  cor2'>
                            <h3>Descrição</h3>
                        </section>
                        <div className='Desc'>
                            <section className='DescCard border cor2'>
                                <div className='linha cor3'></div>
                                {aviso.map( item => <h4>{item.descricao}</h4>)}
                            </section>
                            <button className='b cor3 cem'> 
                                Mais dados
                            </button>
                        </div>
                    </section>

                    <section className='Card cem cor1 border'>
                        <section className='Title  cor2'>
                            <h3>Criado por</h3>
                        </section>
                        <div className='Desc'>
                            <section className='DescCard fix border cor2'>
                                <div className='linha cor3'></div>
                                
                            </section>
                        </div>
                    </section>
                    </>}

                    {section == 2 && <>  
                    {comentarios.length <= 0 
                        ? <StatusCard mensagem={"Parece que não tem nada aqui."}/>
                        : <>
                        {comentarios.map( item =>
                            <></>
                        )}</>
                    }</>}
                </section>
                </>
            )}
        </div>
    )
}