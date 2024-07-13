import { useNavigate, useParams } from 'react-router-dom'
import './index.scss'
import { useEffect, useState, useRef } from 'react'

//conexoes
import { dadosAtividadesCon } from '../../../connection/userConnection';

//outros
import { toast } from 'react-toastify';
import LoadingBar from "react-top-loading-bar";

export default function BarraLateral({page}) {
    const {idsala, idtrilha, idatividade} = useParams()
    const [atividades, setAtividades] = useState([])

    async function dadosAtividades() {
        try {
            let resposta = await dadosAtividadesCon(1, idsala, idtrilha)
            setAtividades(resposta)
        }
        catch { toast.dark('Ocorreu um erro ao buscar dados das atividades.'); }
    }

    useEffect(()=> {
        async function conections() {
            if (page == "Trilha" || page == "Atividade") {
                await dadosAtividades()
            }
        }
        conections()
    }, [idsala, idtrilha])

    const navigate = useNavigate()
    const ref = useRef()

    function navegacao(para, id) {
        ref.current.continuousStart()

        if (para == 1) {
            navigate(`/minhasala/${idsala}/trilha/${idtrilha}/atividade/${id}`)
        }
    }

    return ( 
        <>
            <LoadingBar color="#f11946" ref={ref} />
            
            <section className='BarraLateral border cor1'>
                <div className='ButtonSections cor4'>
                    <button className={`b cor3 ${page == "inicio" && "selecionado"}`}> 
                        <img src={`/assets/images/icones/inicio${page === "inicio" ? "PE" : ""}.png`} />
                        Inicio 
                    </button>
                </div>
                <div className='ButtonSections cor4'>
                    <button className={`b cor3 ${page == "calendario" && "selecionado"}`}> 
                        <img src={`/assets/images/icones/calendario${page === "calendario" ? "PE" : ""}.png`} />
                        Calendário 
                    </button>
                </div>
                <div className='ButtonSections cor4'>
                    <button className={`b cor3 ${page == "minhasala" && "selecionado"}`}> 
                        <img src={`/assets/images/icones/minhasala${page === "minhasala" ? "PE" : ""}.png`} />
                        Minha Sala 
                    </button>
                    {page == "minhasala" &&
                    <>
                    <button className="b selecionado"> 
                        <img src={`/assets/images/icones/TrilhasPE.png`} />
                        Acessar ultima trilha
                    </button>
                    <button className="b selecionado"> 
                        <img src={`/assets/images/icones/LivesPE.png`} />
                        Entrar na chamada
                    </button>
                    </>}
                </div>

                {(page == "Trilha" || page == "Atividade") &&
                <section className='Atividades cor4'>
                    <button className="b selecionado"> 
                        <img src={`/assets/images/icones/TrilhasPE.png`} />
                        Trilha 2 - No ritmo certo
                    </button>

                    <section className='CardAtividades'>
                        {atividades.map( item =>
                            <>
                            <button onClick={()=> navegacao(1, item.id)} className={`b ${idatividade == item.id ? "selecionado" : "mostrando"}`}> 
                                {item.nome}
                            </button>
                            {idatividade == item.id &&
                            <>
                            <button className="b selecionado"> 
                                <img src={`/assets/images/icones/LivesPE.png`} />
                                Assistir vídeo
                            </button>
                            <button className="b selecionado"> 
                                <img src={`/assets/images/icones/atividadesPE.png`} />
                                Fazer lições
                            </button>
                            </>}
                            </>
                        )}
                    </section>
                </section>}
            </section>
        </>
    )
}