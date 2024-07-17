import { useNavigate, useParams } from 'react-router-dom'
import { useRef } from 'react'
import storage from 'local-storage';

//conexoes
import { BuscarImagem, entrarSalaCon } from '../../../connection/alunoConnection';

//outros
import { toast } from 'react-toastify';
import LoadingBar from "react-top-loading-bar";

export default function Card({estilo, id, idProfessor, idSala, name, desc, img, video, status, para, importante, width, tipo}) {
    const aluno = storage.get('aluno') || []; 
    const {idtrilha, idsala} = useParams()
    const navigate = useNavigate()
    const ref = useRef()

    function navegacao() {
        ref.current.continuousStart()

        try {
            if (status != "Não feita.") {
                if (para == 0) {
                    navigate(`/aluno/minhasala/${id}`)
                }
                if (para == 1) {
                    navigate(`/aluno/minhasala/${idSala}/trilha/${id}`)
                }
                if (para == 2) {
                    navigate(`/aluno/minhasala/${idSala}/aviso/${id}`)
                }
                if (para == 3) {
                    navigate(`/aluno/minhasala/${idSala}/transmissão/${id}`)
                }
                if (para == 4) {
                    navigate(`/aluno/minhasala/${idsala}/trilha/${idtrilha}/atividade/${id}/${importante == false ? "assistir" : "lições"}`)
                }
            }
            else {
                toast.dark("Voce não pode acessar isso.")
            }
        }
        catch {
            toast.dark("Algo deu errado.")
        }
        finally {
            ref.current.complete()
        }
    }



    async function funcoes() {
        try {
            if (tipo == "PedirEntrar") {
                await entrarSalaCon(aluno.map(item=> item.id), id, idProfessor)
                toast.dark("Pedido enviado!")
            }
        }
        catch {toast.dark("Falha ao executar essa função.")}
    }

    return (
        <>
            <LoadingBar color="#f11946" ref={ref} />

            <main className={`Card ${width} cor1 border ${(estilo == 1 && img != "Nenhuma imagem adicionada.") && "normalPadding"}`}>

                {(estilo == 1 && img == "Nenhuma imagem adicionada.") &&
                <section className='Title cor2'>
                    <h3 className="cor2">{name}</h3>
                </section>}
                {(estilo == 2 || (estilo == 1 && img != "Nenhuma imagem adicionada.")) &&
                <section className={`Img cor2 `}>
                    <img src={BuscarImagem(img)} className='fundo'/>
                    <section onClick={()=> navegacao()} className='Escuro'>
                        <h3 onClick={()=> navegacao()}>{name}</h3>
                    </section>
                </section>}
                {(estilo == 2 || (estilo == 1 && img == "Nenhuma imagem adicionada.")) &&
                <section className='Desc'>
                    <section className={`DescCard border cor2 ${(img == "Nenhuma imagem adicionada." && video == "Nenhum vídeo adicionado.") && "fix"}`}>
                        <div className='linha'></div>
                        <h4>{desc}</h4>
                    </section>
                    {(img != "Nenhuma imagem adicionada." && video != "Nenhum vídeo adicionado." && tipo == null) &&
                    <button onClick={()=> navegacao()} className='b cor3 cem'>
                        Acessar
                    </button>}
                    {(img != "Nenhuma imagem adicionada." && video != "Nenhum vídeo adicionado." && tipo == "PedirEntrar") &&
                    <button onClick={()=> funcoes()} className='b cor3 cem'>
                        Pedir para entrar
                    </button>}
                </section>}
            </main>
        </>
    )
}