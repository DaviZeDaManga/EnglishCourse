import './index.scss'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

//conexoes
import { dadosAvisosCon, dadosSalaCon, dadosTransmissoesCon, dadosTrilhasCon } from '../../../connection/userConnection'

//components
import BarraLateral from '../../../components/user/barraLateral'
import Titulo from '../../../components/user/titulo'
import Card from '../../../components/user/card'
import ErrorCard from '../../../components/user/error'

//outros
import { toast } from 'react-toastify';
import { BuscarImagem } from '../../../connection/alunoConnection'

export default function MinhaSala() {
    const {idsala} = useParams()
    const [sala, setSala] = useState([]) 

    async function dadosSala() {
        try {
            const resposta = await dadosSalaCon(1, idsala);
            setSala(resposta);
        } catch { toast.dark('Ocorreu um erro ao buscar dados da sala.'); }
    }



    const [section, setSection] = useState(1)
    const [trilhas, setTrilhas] = useState([])
    const [avisos, setAvisos] = useState([])
    const [transmissoes, setTransmissoes] = useState([])

    async function dadosTrilhas() {
        setTrilhas("Loading")
        try {
            let resposta = await dadosTrilhasCon(1, idsala)
            setTrilhas(resposta)
        }
        catch(error) { 
            setTrilhas("Parece que não tem nada aqui.")
        }
    }

    async function dadosAvisos() {
        setAvisos("Loading")
        try {
            let resposta = await dadosAvisosCon(1, idsala)
            setAvisos(resposta)
        }
        catch { setAvisos("Parece que não tem nada aqui.") }
    }

    async function dadosTransmissoes() {
        setTransmissoes("Loading")
        try {
            let resposta = await dadosTransmissoesCon(1, idsala)
            setTransmissoes(resposta)
        }
        catch { setTransmissoes("Parece que não tem nada aqui.")}
    }



    useEffect(()=> {
        async function conections() {
            await dadosSala()
            await dadosTrilhas()
            await dadosAvisos()
            await dadosTransmissoes()
        }
        conections()
    }, [idsala])

    return (
        <div className='MinhaSala'>
            <BarraLateral page={"minhasala"}/>
            <Titulo nome={"Minha Sala"}/>

            <section className='Info'>
                <section className='Card min cor1 border'>
                    <section className='Title cor2'>
                        {sala.map( item => <h3>{item.nome}</h3>)}
                    </section>
                    <div className='Desc'>
                        <section className='DescCard border cor2'>
                            <div className='linha cor3'></div>
                            {sala.map( item => <h4>{item.descricao}</h4>)}
                        </section>
                        <button className='b cor3'> 
                            {sala.map( item => <img src={item.img} />)}
                            Pessoas
                        </button>
                    </div>
                </section>
                <section className='InfoFundo border cor1'>
                    {sala.map( item => <img className='fundo' src={BuscarImagem(item.imagem)} />)}
                </section>
            </section>

            <section className='SectionButtons'>
                <button onClick={()=> setSection(1)} className={`b cor3 ${section == 1 && "selecionado"}`}> <img src={`/assets/images/icones/Trilhas${section == 1 ? "PE" : ""}.png`}/> Trilhas</button>
                <button onClick={()=> setSection(2)} className={`b cor3 ${section == 2 && "selecionado"}`}> <img src={`/assets/images/icones/Avisos${section == 2 ? "PE" : ""}.png`}/> Avisos</button>
                <button onClick={()=> setSection(3)} className={`b cor3 ${section == 3 && "selecionado"}`}> <img src={`/assets/images/icones/Lives${section == 3 ? "PE" : ""}.png`}/> Transmissões</button>
            </section>

            <main className='SectionCards'>
                {section == 1 && <>  
                {(trilhas == "Loading" || trilhas == "Parece que não tem nada aqui.") 
                    ? <ErrorCard mensagem={trilhas}/>
                    : <>
                    {trilhas.map( item =>
                        <Card
                        estilo={2}
                        id={item.id}
                        name={item.nome}
                        desc={item.descricao}
                        img={item.imagem}
                        video={item.video}
                        para={1}
                        />
                    )}</>
                }</>}

                {section == 2 && <>  
                {(avisos == "Loading" || avisos == "Parece que não tem nada aqui.") 
                    ? <ErrorCard mensagem={avisos}/>
                    : <>
                    {avisos.map( item =>
                        <Card
                        estilo={1}
                        id={item.id}
                        name={item.nome}
                        desc={item.descricao}
                        img={item.imagem}
                        video={item.video}
                        para={2}
                        />
                    )}</>
                }</>}

                {section == 3 && <>  
                {(transmissoes == "Loading" || transmissoes == "Parece que não tem nada aqui.") 
                    ? <ErrorCard mensagem={transmissoes}/>
                    : <>
                    {transmissoes.map( item =>
                        <Card
                        estilo={1}
                        id={item.id}
                        name={item.nome}
                        desc={item.descricao}
                        img={item.imagem}
                        video={item.video}
                        para={3}
                        />
                    )}</>
                }</>}
            </main>
        </div>
    )
}