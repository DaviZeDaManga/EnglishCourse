import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'


//outros
import { toast } from 'react-toastify';
import LoadingBar from "react-top-loading-bar";

export default function BarraLateral({page}) {
    const {idsala, idtrilha, idatividade} = useParams()

    const navigate = useNavigate()
    const ref = useRef()

    function navegacao(para, id, outro) {
        ref.current.continuousStart()

        try {
            if (para == 0) {
                toast.dark("Você não pode acessar isso.")
            }
            if (para == 1) {
                navigate(`/admin/minhassalas`)
            }
            if (para == 2) {
                navigate(`/admin/criação`)
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
            <LoadingBar color="#8A55CD" ref={ref} />
            
            <section className='BarraLateral border cor1'>
                {/* <div className='ButtonSections cor4'>
                    <button className={`b cem cor3 ${page == "dash" && "selecionado"}`}> 
                        <img src={`/assets/images/icones/inicio${page === "dash" ? "PE" : ""}.png`} />
                        Dash 
                    </button>
                </div>
                <div className='ButtonSections cor4'>
                    <button className={`b cem cor3 ${page == "gerenciamento" && "selecionado"}`}> 
                        <img src={`/assets/images/icones/pessoas.png`} />
                        Gerenciamento de alunos 
                    </button>
                </div> */}
                <div className='ButtonSections cor4'>
                    <button onClick={()=> navegacao(1)} className={`b cem cor3 ${page == "minhassalas" && "selecionado"}`}> 
                        <img src={`/assets/images/icones/minhasala${page === "minhassalas" ? "PE" : ""}.png`} />
                        Minhas Salas 
                    </button>
                </div>
                <div className='ButtonSections cor4'>
                    <button onClick={()=> navegacao(2)} className={`b cem cor3 ${page == "criacao" && "selecionado"}`}> 
                        <img src={`/assets/images/icones/criacao${page === "criacao" ? "PE" : ""}.png`} />
                        Criação
                    </button>
                </div>
            </section>
        </>
    )
}