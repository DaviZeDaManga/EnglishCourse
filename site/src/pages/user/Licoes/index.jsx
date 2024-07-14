import './index.scss'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

//conexoes
import { dadosAtividadeCon, dadosLicoesCon } from '../../../connection/userConnection'
import { inserirFeitoLicoesCon, inserirResposta } from '../../../connection/alunoConnection'

//components
import BarraLateral from '../../../components/user/barraLateral'
import Titulo from '../../../components/user/titulo'
import Card from '../../../components/user/card'
import ErrorCard from '../../../components/user/error'

//outros
import { toast } from 'react-toastify';

export default function Licoes() {
    const {idsala, idtrilha, idatividade} = useParams()
    const [atividade, setAtividade] = useState([])
    const [licoes, setLicoes] = useState([])

    async function dadosAtividade() {
        try {
            const resposta = await dadosAtividadeCon(1, idsala, idtrilha, idatividade);
            setAtividade(resposta);
        } catch { toast.dark('Ocorreu um erro ao buscar dados da atividade.'); }
    }

    async function dadosLicoes() {
        try {
            const resposta = await dadosLicoesCon(1, idsala, idtrilha, idatividade);
            setLicoes(resposta);
        } catch { toast.dark('Ocorreu um erro ao buscar dados das lições.'); }
    }

    useEffect(()=> {
        async function conections() {
            await dadosAtividade()
            await dadosLicoes()
        }
        conections()
    }, [idsala, idtrilha, idatividade])

    const [cardenvio, setCardenvio] = useState(false)
    const [enviar, setEnviar] = useState("")
    const [respostas, setRespostas] = useState([])

    function adicionarRespostas(alternativa, resposta, idlicao) {
        const copiaRespostas = [...respostas];
        const index = copiaRespostas.findIndex(item => item.idlicao === idlicao);
    
        if (index !== -1) {
            copiaRespostas[index] = {resposta: resposta, alternativa: alternativa, idlicao: idlicao };
        } else {
            copiaRespostas.push({resposta: resposta, alternativa: alternativa, idlicao: idlicao });
        }
    
        setRespostas(copiaRespostas);
    }

    async function enviarRespostas() {
        try {
            for (let item of respostas) {
                await inserirResposta(1, item.idlicao, item.alternativa, item.resposta, 10)
                await inserirFeitoLicoesCon(1, idatividade)
            }
        }
        catch {
            toast.dark("Suas respostas não foram enviadas.")
        }
    }

    return(
        <section className='Licoes'>
            <BarraLateral page={"Lições"}/>
            <Titulo nome={"Lições"}/>

            {cardenvio == true &&
            <main className='FundoEscuro'>
                <section className='EnviarRespostas cor1 border'>
                    <div className='Titulo'>
                        <button onClick={()=> setCardenvio(false)} className='b cor3'> <img src='/assets/images/icones/voltar.png'/> </button>
                        <section className='NomeTitulo cem cor3'>
                            <h3>Deseja enviar suas respostas?</h3>
                        </section>
                    </div>
                    <input onChange={(e)=> setEnviar(e.target.value)} value={enviar} className='cor2 border' placeholder='Digite "Confirmar" para fazer essa ação'></input>
                    {enviar == "Confirmar" &&
                    <button onClick={()=> enviarRespostas()} className='b cor3 cem'>Enviar</button>}
                </section>
            </main>}

            <section className='Info'>
                <section className='SectionLicoes'>
                    
                    {licoes.map( item=> 
                        <section className='CardLicoes cor1 border'>
                            <section className='TitleLicoes'>
                                {item.licao.nome != "Nenhum título adicionado." 
                                ? <section className='Title border cor2'><h3>{item.licao.nome}</h3></section>
                                : <section className='Title border cor2'><h3>{item.licao.pergunta}</h3></section>}
                                <button className='b cor2 min'>{item.licao.tipo}</button>
                            </section>

                            {item.licao.descricao != "Nenhuma descrição adicionada." &&
                            <section className="DescCard border cor2">
                                <div className='linha'></div>
                                <h4>{item.licao.descricao}</h4>
                            </section>}

                            {item.licao.nome != "Nenhum título adicionado." &&
                            <section className='TitleLicoes'>
                                <section className='Title border cor2'><h3>{item.licao.pergunta}</h3></section>
                            </section>}

                            {item.licao.tipo == "Writing" &&
                            <section className="DescCard border cor2">
                                <div className='linha'></div>
                                {item.licao.escrita == null 
                                ? <textarea onChange={(e)=> adicionarRespostas(0, e.target.value, item.licao.id)} placeholder='Digite sua resposta' className='cor2 border'></textarea>
                                : <h4>{item.licao.escrita}</h4>}
                            </section>}

                            {item.licao.alternativa == null 
                            ? <>
                            {item.alternativas.map( alternativa =>
                                <button onClick={()=> adicionarRespostas(alternativa.id, "Nenhum texto adicionado.", item.licao.id)} className={`b cor3 cem ${respostas.some(respin => respin.alternativa == alternativa.id) ? 'selecionado' : 'h4'}`}>{alternativa.nome}</button>
                            )}
                            </>
                            : <>
                            {item.alternativas.map( alternativa =>
                                <button onClick={()=> toast.dark("Voce já respondeu!")} className={`b cor3 cem ${item.licao.alternativa == alternativa.id ? ((alternativa.correto == true) ? 'green' : 'red') : "h4"}`}>{alternativa.nome}</button>
                            )}
                            </>}

                        </section>
                    )}

                    {respostas.length == licoes.length &&
                    <button onClick={()=> setCardenvio(true)} className='b cem'>Enviar respostas</button>}
                </section>

                <section className='CardAtividadeLicoes'>
                    {atividade.map( item=> 
                        <Card
                        estilo={2}
                        id={item.id}
                        name={item.nome}
                        desc={item.descricao}
                        img={item.imagem}
                        video={item.video}
                        para={4}
                        importante={false}
                        width={"cem"}
                        />
                    )}
                </section>

            </section>
        </section>
    )
}