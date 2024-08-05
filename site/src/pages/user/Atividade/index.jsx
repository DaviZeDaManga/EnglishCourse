import './index.scss'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import storage from 'local-storage';

//conexoes
import { dadosAtividadeAlunoCon, dadosPalarvasAlunoCon, inserirFeitoConteudoCon } from '../../../connection/alunoConnection'
import { BuscarImagem } from '../../../connection/userConnection';

//components
import BarraLateral from '../../../components/user/barraLateral'
import Titulo from '../../../components/user/titulo'
import StatusCard from '../../../components/user/statusCard'
import StatusPage from '../../../components/user/statusPage';

//outros
import { toast } from 'react-toastify';

export default function Atividade() {
    const aluno = storage.get('aluno') || [];
    const {idsala, idtrilha, idatividade} = useParams()
    const [atividade, setAtividade] = useState([])
    const [assistir, setAssistir] = useState(false)

    async function dadosAtividade() {
        setAtividade("Loading")
        try {
            const resposta = await dadosAtividadeAlunoCon(aluno.map( item=> item.id), idsala, idtrilha, idatividade);
            setAtividade(resposta);
        } catch (error) { 
            console.error("Nenhuma atividade encontrada:", error)
            setAtividade("Nenhuma atividade encontrada.")    
        }
    }

    useEffect(()=> {
        async function fetchData() {
            try {
                await dadosAtividade()
            } catch (error) {
                console.error("Erro ao tentar carregar atividade:", error)
                toast.dark("Erro ao tentar carregar atividade.")
            }
        }
        fetchData()
    }, [idatividade])

    const [section, setSection] = useState(1)
    const [palavras, setPalavras] = useState([])
    const [comentarios, setComentarios] = useState([])

    async function dadosPalavras() {
        setPalavras("Loading")
        try {
            const resposta = await dadosPalarvasAlunoCon(aluno.map( item=> item.id), idsala, idtrilha, idatividade);
            setPalavras(resposta);
        } catch (error) { 
            console.error("Nenhuma palavra encontrada:", error)
            setPalavras("Nenhuma palavra encontrada.")    
        }
    }

    async function dadosComentarios() {
       setComentarios("Essa função ainda não está disponível.")
    }

    useEffect(()=> {
        async function fetchDataSection() {
            if (Array.isArray(atividade)) {
                switch (section) {
                    case 1:
                        await dadosPalavras()
                        break
                    case 2:
                        await dadosComentarios()
                        break
                    default:
                        break
                }
            }
        }
        fetchDataSection()
    }, [section, atividade])

    async function inserirFeitoConteudo() {
        try {
            await inserirFeitoConteudoCon(aluno.map( item=> item.id), idatividade);
            toast.dark('Partiu lições!');
        } catch { 
            toast.dark('Ocorreu um erro ao inserir feito do conteudo.'); 
        }
    }

    return(
        <div className='PageSize PageAtividade'>
            <BarraLateral page={"Assistir"}/>
            <Titulo nome={"Atividade"}/>

            {((atividade === "Loading" || atividade === "Nenhuma atividade encontrada.") || atividade.map(item=> item.status) == "Não feita") ? (
                <StatusPage status={atividade} />
            ) : (
                <>
                <main className='Video cor1 border marginTop'>
                    <section className='FundoVideo'>
                        {atividade.map( item => 
                            <>
                            {assistir == false && <> <img className='fundo' src={BuscarImagem(item.imagem)}/> <section className='Escuro'></section> </>}
                            {(assistir == false && item.video != "Nenhum vídeo adicionado.") && <img onClick={()=> setAssistir(true)} className='meio icon' src="/assets/images/icones/LivesPE.png" />}
                            {assistir == true && <video onEnded={()=> inserirFeitoConteudo()} controls="true">  <source src={item.video} type="video/mp4" /></video>}
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
                                {atividade.map( item => <h4>{item.descricao}</h4>)}
                            </section>
                            <button className='b cor3 cem'> 
                                Mais dados
                            </button>
                        </div>
                    </section>

                    <section className='Card cem cor1 border'>
                        <section className='Title cor2'>
                            <h3>Palavras</h3>
                        </section>
                        <div className='Desc'>
                            <section className='DescCard fix border cor2'>
                                <div className='linha cor3'></div>
                                {(palavras === "Loading" || palavras === "Nenhuma palavra encontrada.") ? (
                                    <h4>{palavras}</h4>
                                ) : (
                                    <>
                                    {palavras.map( item => <button className='b cor3 min'>{item.nome}</button>)}
                                    </>
                                )}
                            </section>
                        </div>
                    </section>
                    </>}

                    {section == 2 && 
                    <>  
                    {(comentarios === "Loading" || comentarios === "Nenhum comentário encontrado." || comentarios === "Essa função ainda não está disponível.") ? (
                        <StatusCard mensagem={comentarios}/>
                    ) : (
                        <></>
                    )}
                    </>}
                </section>
                </>
            )}
        </div>
    )
}