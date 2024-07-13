import './index.scss'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

//conexoes
import { dadosAtividadeCon, dadosPalarvasCon } from '../../../connection/userConnection'

//components
import BarraLateral from '../../../components/user/barraLateral'
import Titulo from '../../../components/user/titulo'
import ErrorCard from '../../../components/user/error'

//outros
import { toast } from 'react-toastify';

export default function Atividade() {
    const {idsala, idtrilha, idatividade} = useParams()
    const [atividade, setAtividade] = useState([])

    async function dadosAtividade() {
        try {
            const resposta = await dadosAtividadeCon(1, idsala, idtrilha, idatividade);
            setAtividade(resposta);
        } catch { toast.dark('Ocorreu um erro ao buscar dados da atividade.'); }
    }

    const [section, setSection] = useState(1)
    const [palavras, setPalavras] = useState([])
    const [comentarios, setComentarios] = useState([])

    async function dadosPalavras() {
        try {
            const resposta = await dadosPalarvasCon(1, idsala, idtrilha, idatividade);
            setPalavras(resposta);
        } catch { toast.dark('Ocorreu um erro ao buscar dados das palavras.'); }
    }

    useEffect(()=> {
        async function conections() {
            await dadosAtividade()
            await dadosPalavras()
        }
        conections()
    }, [idsala, idtrilha, idatividade])

    const [assistir, setAssistir] = useState(false)

    return(
        <div className='Atividade'>
            <BarraLateral page={"Atividade"}/>
            <Titulo nome={"Atividade"}/>

            <main className='Video cor1 border'>
                <section className='FundoVideo'>
                    {atividade.map( item => 
                        <>
                        {assistir == false && <img className='fundo' src={item.imagem} />}
                        {(assistir == false && item.video != "Nenhum vídeo adicionado.") && <img onClick={()=> setAssistir(true)} className='meio icon' src="/assets/images/icones/LivesPE.png" />}
                        {assistir == true && <video controls="true">  <source src={item.video} type="video/mp4" /></video>}
                        </>
                    )}
                </section>
            </main>

            <section className='SectionButtons'>
                <button onClick={()=> setSection(1)} className={`b cor3 ${section == 1 && "selecionado"}`}> 
                    <img src={`/assets/images/icones/Avisos${section == 1 ? "PE" : ""}.png`} />
                    Informações
                </button>
                <button onClick={()=> setSection(2)} className={`b cor3 ${section == 2 && "selecionado"}`}> 
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
                        <button className='b cor3'> 
                            Mais dados
                        </button>
                    </div>
                </section>

                <section className='Card cem cor1 border'>
                    <section className='Title  cor2'>
                        <h3>Palavras</h3>
                    </section>
                    <div className='Desc'>
                        <section className='DescCard fix border cor2'>
                            <div className='linha cor3'></div>
                            {palavras.map( item => <button className='b cor3 min'>{item.nome}</button>)}
                        </section>
                    </div>
                </section>
                </>}

                {section == 2 && <>  
                {comentarios.length <= 0 
                    ? <ErrorCard mensagem={"Parece que não tem nada aqui."}/>
                    : <>
                    {comentarios.map( item =>
                        <></>
                    )}</>
                }</>}
            </section>
        </div>
    )
}