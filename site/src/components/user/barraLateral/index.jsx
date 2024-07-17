import { useNavigate, useParams } from 'react-router-dom'
import './index.scss'
import { useEffect, useState, useRef } from 'react'
import storage from 'local-storage';

//conexoes
import { dadosAtividadesCon } from '../../../connection/userConnection';

//outros
import { toast } from 'react-toastify';
import LoadingBar from "react-top-loading-bar";

export default function BarraLateral({page}) {
    const aluno = storage.get('aluno') || [];
    const {idtrilha, idatividade} = useParams()
    const [atividades, setAtividades] = useState([])

    async function dadosAtividades() {
        setAtividades("Loading")
        try {
            const resposta = await dadosAtividadesCon(aluno.map(item=> item.id), aluno.map(item=> item.idSala), idtrilha)
            if (Array.isArray(resposta)) {
                setAtividades(resposta)
            } else {
                setAtividades([])
            }
        }
        catch { setAtividades('Nenhuma atividade encontrada.'); }
    }

    useEffect(()=> {
        async function fetchData() {
            try {
                await dadosAtividades()
            } catch {
                toast.dark("Erro ao carregar as atividades!")
            }
        }
        fetchData()
    }, [])

    const navigate = useNavigate()
    const ref = useRef()

    function navegacao(para, id, outro) {
        ref.current.continuousStart()

        try {
            if (para == 0) {
                toast.dark("Você não pode acessar isso.")
            }
            if (para == 1) {
                navigate(`/aluno/minhasala/trilha/${idtrilha}/atividade/${id}${outro != null && "/" + outro}`)
            }
            if (para == 2) {
                navigate(`/aluno/minhasala`)
            }
            if (para == 3) {
                navigate(`/aluno/minhaconta`)
            }
        }
        catch {
            toast.dark("Algo deu errado.")
        }
        finally {
            ref.current.complete()
        }
    }

    return ( 
        <>
            <LoadingBar color="#f11946" ref={ref} />
            
            <section className='BarraLateral border cor1'>
                <div className='ButtonSections cor4'>
                    <button onClick={()=> navegacao(3)} className={`b cor3 cem ${page == "minhaconta" && "selecionado"}`}> 
                        <img src={`/assets/images/icones/user${page === "minhaconta" ? "PE" : ""}.png`} />
                        Conta 
                    </button>
                </div>
                {/* <div className='ButtonSections cor4'>
                    <button className={`b cor3 cem ${page == "calendario" && "selecionado"}`}> 
                        <img src={`/assets/images/icones/calendario${page === "calendario" ? "PE" : ""}.png`} />
                        Calendário 
                    </button>
                </div> */}
                <div className='ButtonSections cor4'>
                    <button onClick={()=> navegacao(2)} className={`b cem cor3 ${page == "minhasala" && "selecionado"}`}> 
                        <img src={`/assets/images/icones/minhasala${page === "minhasala" ? "PE" : ""}.png`} />
                        Minha Sala 
                    </button>
                    {/* {page == "minhasala" &&
                    <>
                    <button className="b cem selecionado"> 
                        <img src={`/assets/images/icones/TrilhasPE.png`} />
                        Acessar ultima trilha
                    </button>
                    <button className="b cem selecionado"> 
                        <img src={`/assets/images/icones/LivesPE.png`} />
                        Entrar na chamada
                    </button>
                    </>} */}
                </div>

                {(page == "Trilha" || page == "Assistir" || page == "Lições") &&
                <section className='Atividades cor4'>
                    <button className="b cem selecionado"> 
                        <img src={`/assets/images/icones/TrilhasPE.png`} />
                        Trilha 2 - No ritmo certo
                    </button>

                    <section className='CardAtividades'>
                        {(atividades === "Loading" || atividades == "Nenhuma atividade encontrada.") ? (
                            <button className='b selecionado cem'>{atividades}</button>
                        ) : <>
                        {atividades.map( item =>
                            <>
                            <button onClick={()=> navegacao(1, item.id, (item.conteudo != true ? "assistir" : "licoes"))} className={`b ${idatividade == item.id ? "selecionado" : "mostrando"}`}> 
                                {item.nome}
                            </button>
                            {idatividade == item.id &&
                            <>
                            <button onClick={()=> navegacao(1, item.id, "assistir")} className="b selecionado"> 
                                <img src={`/assets/images/icones/LivesPE.png`} />
                                Assistir vídeo
                                <div className={`bolinha ${item.conteudo == true && "preenchido"}`}></div>
                            </button>
                            <button onClick={()=> navegacao((item.conteudo == true ? 1 : 0), item.id, "lições")} className="b selecionado"> 
                                <img src={`/assets/images/icones/atividadesPE.png`} />
                                Fazer lições
                                {item.conteudo == true &&
                                <div className={`bolinha ${item.licoes == true && "preenchido"}`}></div>}
                            </button>
                            </>}
                            </>
                        )}
                        </>}
                    </section>
                </section>}
            </section>
        </>
    )
}