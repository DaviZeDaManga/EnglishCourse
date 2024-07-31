import { useNavigate, useParams } from 'react-router-dom'
import { useRef } from 'react'
import storage from 'local-storage';

//conexoes
import { BuscarImagem } from '../../../connection/userConnection';

//outros
import { toast } from 'react-toastify';
import LoadingBar from "react-top-loading-bar";

export default function Card({estilo, id, idSala, name, desc, img, video, status, para, conteudo, licoes, width}) {
    const aluno = storage.get('aluno') || []; 
    const {idtrilha, idsala} = useParams()
    const navigate = useNavigate()
    const ref = useRef()

    function navegacao() {
        ref.current.continuousStart()

        try {
            if (status !== "Não feita") {
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
                    navigate(`/aluno/minhasala/${idsala}/trilha/${idtrilha}/atividade/${id}/${(conteudo == false || (conteudo == true && licoes == true)) ? "assistir" : "lições"}`)
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

    return (
        <>
            <LoadingBar color="#cd9555" ref={ref} />

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
                    {(img != "Nenhuma imagem adicionada." && video != "Nenhum vídeo adicionado.") &&
                    <button onClick={()=> navegacao()} className='b cor3 cem'>
                        Acessar
                    </button>}
                </section>}
            </main>
        </>
    )
}