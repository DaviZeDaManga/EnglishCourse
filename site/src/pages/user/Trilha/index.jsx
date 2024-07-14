import './index.scss'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

//conexoes
import { dadosAtividadesCon, dadosTrilhaCon } from '../../../connection/userConnection'

//components
import BarraLateral from '../../../components/user/barraLateral'
import Titulo from '../../../components/user/titulo'
import Card from '../../../components/user/card'
import ErrorCard from '../../../components/user/error'

//outros
import { toast } from 'react-toastify';

export default function Trilha() {
    const {idsala, idtrilha} = useParams()
    const [trilha, setTrilha] = useState([]) 

    async function dadosTrilha() {
        try {
            const resposta = await dadosTrilhaCon(1, idsala, idtrilha);
            setTrilha(resposta);
        } catch { toast.dark('Ocorreu um erro ao buscar dados da trilha.'); }
    }



    const [section, setSection] = useState(1)
    const [atividades, setAtividades] = useState([])
    const [rendimento, setRendimento] = useState([])

    async function dadosAtividades() {
        try {
            let resposta = await dadosAtividadesCon(1, idsala, idtrilha)
            setAtividades(resposta)
        }
        catch { toast.dark('Ocorreu um erro ao buscar dados das atividades.'); }
    }



    useEffect(()=> {
        async function conections() {
            await dadosTrilha()
            await dadosAtividades()
        }
        conections()
    }, [idsala, idtrilha])

    return (
        <div className='Trilha'>
            <BarraLateral page={"Trilha"}/>
            <Titulo nome={"Trilha"}/>

            <section className='Info'>
                <section className='Card min cor1 border'>
                    <section className='Title cor2'>
                        {trilha.map( item => <h3>{item.nome}</h3>)}
                    </section>
                    <div className='Desc'>
                        <section className='DescCard border cor2'>
                            <div className='linha cor3'></div>
                            {trilha.map( item => <h4>{item.descricao}</h4>)}
                        </section>
                        <button className='b cor3'> 
                            {trilha.map( item => <img src={item.img} />)}
                            Pessoas
                        </button>
                    </div>
                </section>
                <section className='InfoFundo border cor1'>
                    {trilha.map( item => <img className='fundo' src={item.imagem} />)}
                </section>
            </section>

            <section className='SectionButtons'>
                <button onClick={()=> setSection(1)} className={`b cor3 ${section == 1 && "selecionado"}`}> <img src={`/assets/images/icones/Trilhas${section == 1 ? "PE" : ""}.png`}/> Atividades</button>
                <button onClick={()=> setSection(2)} className={`b cor3 ${section == 2 && "selecionado"}`}> <img src={`/assets/images/icones/Avisos${section == 2 ? "PE" : ""}.png`}/> Meu rendimento</button>
            </section>

            <main className='SectionCards'>
                {section == 1 && <>  
                {atividades.length <= 0 
                    ? <ErrorCard mensagem={"Parece que não tem nada aqui."}/>
                    : <>
                    {atividades.map( item =>
                        <Card
                        estilo={1}
                        id={item.id}
                        name={item.nome}
                        desc={item.descricao}
                        img={item.imagem}
                        video={item.video}
                        para={4}
                        status={item.status}
                        importante={item.conteudo}
                        />
                    )}</>
                }</>}

                {section == 2 && <>  
                {rendimento.length <= 0 
                    ? <ErrorCard mensagem={"Essa função ainda não está disponível."}/>
                    : <>
                    </>
                }</>}

            </main>
        </div>
    )
}