import './index.scss'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

//components
import BarraLateral from '../../../components/user/barraLateral'
import Titulo from '../../../components/user/titulo'
import StatusCard from '../../../components/user/statusCard'

//outros
import { toast } from 'react-toastify';
import { dadosAvisoCon, dadosTransmissaoCon } from '../../../connection/userConnection'

export default function Conteudo() {
    const {idsala, idconteudo, tipoconteudo} = useParams()
    const [conteudo, setConteudo] = useState([])

    async function dadosAviso() {
        try {
            const resposta = await dadosAvisoCon(1, idsala, idconteudo);
            setConteudo(resposta);
        } catch { toast.dark('Ocorreu um erro ao buscar dados do aviso.'); }
    }

    async function dadosTransmissao() {
        try {
            const resposta = await dadosTransmissaoCon(1, idsala, idconteudo);
            setConteudo(resposta);
        } catch { toast.dark('Ocorreu um erro ao buscar dados da transmissão.'); }
    }

    const [section, setSection] = useState(1)
    const [comentarios, setComentarios] = useState([])



    useEffect(()=> {
        async function conections() {
            if (tipoconteudo == "aviso") {await dadosAviso()}
            if (tipoconteudo == "transmissão") {await dadosTransmissao()}
        }
        conections()
    }, [idsala, idconteudo, tipoconteudo])

    const [assistir, setAssistir] = useState(false)

    return(
        <div className='Conteudo'>
            <BarraLateral page={"Conteudo"}/>
            <Titulo nome={tipoconteudo}/>

            <main className='Video cor1 border'>
                <section className='FundoVideo'>
                    {conteudo.map( item => 
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
                            {conteudo.map( item => <h4>{item.descricao}</h4>)}
                        </section>
                        <button className='b cor3'> 
                            Mais dados
                        </button>
                    </div>
                </section>

                <section className='Card min cor1 border'>
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
        </div>
    )
}