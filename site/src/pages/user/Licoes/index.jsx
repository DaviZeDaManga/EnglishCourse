import './index.scss';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import storage from 'local-storage';

// conexões
import { dadosAtividadeAlunoCon, dadosAtividadesAlunoCon, dadosLicoesAlunoCon, inserirRespostaCon } from '../../../connection/alunoConnection';

// components
import BarraLateral from '../../../components/user/barraLateral';
import Titulo from '../../../components/user/titulo';
import Card from '../../../components/user/card';
import StatusCard from '../../../components/user/statusCard';

// outros
import { toast } from 'react-toastify';
import StatusPage from '../../../components/user/statusPage';
import { BuscarImagem } from '../../../connection/userConnection';

export default function Licoes() {
    const aluno = storage.get('aluno') || [];
    const [loading, setLoading] = useState(true);
    const {idsala, idtrilha, idatividade} = useParams();

    const [atividades, setAtividades] = useState("Loading")

    async function dadosAtividades() {
        try {
            let resposta = await dadosAtividadesAlunoCon(aluno.map(item => item.id), idsala, idtrilha);
            setAtividades(resposta);
        } catch (error) {
            console.error('Erro ao buscar dados das atividades:', error);
            setAtividades("Parece que não tem nada aqui.")
        }
    }

    useEffect(()=> {
        async function fetchData() {
            try {
                await dadosAtividades()
            } catch (error) {
                console.error('Erro ao carregar dados das atividades:', error);
                toast.dark("Erro ao carregar as atividades!")
            }
        }
        fetchData()
    }, [])

    const [section, setSection] = useState(1);
    const [atividade, setAtividade] = useState("Loading");
    const [licoes, setLicoes] = useState("Loading");

    async function dadosAtividade() {
        try {
            const resposta = await dadosAtividadeAlunoCon(aluno.map(item => item.id), idsala, idtrilha, idatividade);
            setAtividade(resposta);
        } catch (error) {
            console.error("Nenhuma atividade encontrada:", error);
            setAtividade("Nenhuma atividade encontrada.");
        }
    }

    async function dadosLicoes() {
        try {
            const resposta = await dadosLicoesAlunoCon(aluno.map(item => item.id), idsala, idtrilha, idatividade);
            setLicoes(resposta);
        } catch (error) {
            console.error("Nenhuma lição encontrada:", error);
            setLicoes("Nenhuma lição encontrada.");
        }
    }

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                await dadosAtividade();
                await dadosLicoes()
            } catch (error) {
                console.error("Erro ao tentar carregar atividade e suas atividades:", error);
                toast.dark("Erro ao tentar carregar atividade e suas atividades.");
            } finally {
                setLoading(false)
            }
        }
        fetchData();
    }, [idsala, idtrilha, idatividade]);

    const refetchAtividades = useRef(null)
    const [respostas, setRespostas] = useState([]);
    const [cardenvio, setCardenvio] = useState(false);
    const [enviar, setEnviar] = useState("");
    const [buttonEnviarRespostas, setButtonsEnviarRespostas] = useState(true)
 
    function adicionarRespostas(resposta, tipo, status, idlicao) {
        const copiaRespostas = [...respostas];
        const index = copiaRespostas.findIndex(item => item.idlicao === idlicao);

        if (index !== -1) {
            copiaRespostas[index] = { resposta: resposta, tipo: tipo, status: status, idlicao: idlicao };
        } else {
            copiaRespostas.push({ resposta: resposta, tipo: tipo, status: status, idlicao: idlicao });
        }

        setRespostas(copiaRespostas);
    }

    async function enviarRespostas() {
        try {
            for (let i = 0; i < respostas.length; i++) {
                const item = respostas[i];
                try {
                    await inserirRespostaCon(aluno.map(item => item.id), item.idlicao, item.resposta, item.tipo, item.status);
                    console.log(`Resposta ${i + 1} enviada com sucesso.`);
                    if (refetchAtividades.current) {
                        await refetchAtividades.current()
                    }
                } catch (inserirError) {
                    console.error(`Erro ao enviar resposta ${i + 1}:`, inserirError);
                }
            }
            toast.dark("Suas respostas foram enviadas com sucesso.");
            dadosLicoes()
            setButtonsEnviarRespostas(false)
            setCardenvio(false)
        } catch (error) {
            console.error("Erro ao enviar respostas:", error);
            toast.dark("Suas respostas não foram enviadas.");
        }
    }

    const todasLicoesRespondidas = buttonEnviarRespostas == true && licoes !== "Loading" && licoes !== "Nenhuma lição encontrada." && licoes.every(licao =>
        respostas.some(resposta => resposta.idlicao === licao.licao.id && resposta.resposta)
    );

    const navigate = useNavigate()
    const ref = useRef()

    function navegacao(para, id) {
        if (para == 0) {
            toast.dark("Você não pode acessar isso.")
        }
        if (para == 1) {
            navigate(`/aluno/minhasala/${idsala}/trilha/${idtrilha}/atividade/${id}/assistir`)
        }
        if (para == 2) {
            navigate(`/aluno/minhasala/${idsala}/trilha/${idtrilha}/atividade/${id}/lições`)
        }
    }

    return (
        <section className='PageSize flex'>
            <BarraLateral page={"Lições"} refetchAtividades={refetchAtividades} biggerSize={true}/>
            <Titulo nome={"Lições"} />
            <StatusPage loading={loading} />

            {atividade === "Loading" || atividade === "Nenhuma atividade encontrada." || atividade.map(item => item.status) === "Não feita" ? (
                <StatusCard className={"marginTop"} mensagem={atividade} reload={true} />
            ) : (
                <>
                {cardenvio && (
                    <StatusPage>
                        <section className='EnviarRespostas cor1 border'>
                            <section className='Title cor2'>
                                <h3>Deseja enviar suas respostas?</h3>
                            </section>
                            <input
                                onChange={(e) => setEnviar(e.target.value)}
                                value={enviar}
                                className='cor2 border'
                                placeholder='Digite "Confirmar" para fazer essa ação'
                            />
                            <section className='SectionButtons default'>
                                <button onClick={() => setCardenvio(false)} className='b cor3 border cem'>
                                    Voltar
                                </button>
                                {enviar === "Confirmar" && (
                                    <button onClick={() => enviarRespostas()} className='b cor3 cem'>Enviar</button>
                                )}
                            </section>
                        </section>
                    </StatusPage>
                )}
                <section className='ConteudosTrilha'>
                    <section className='CardConteudosTrilha cor1 border'>
                        <section className='Title cor2'>
                            <h3>Conteúdos</h3>
                        </section>

                        <main className='ConteudosList cor2 border'>
                            {(atividades === "Loading" || atividades == "Parece que não tem nada aqui.") ? (
                                <button className='b selecionado cem'>{atividades}</button>
                            ) : (
                                <>
                                {atividades.map( item=>
                                <>
                                <button onClick={()=> navegacao(1, item.id)} className='b cem transparente'>{item.nome}</button>
                                <section className={`CardList border ${item.id != idatividade && "minH"}`}>
                                    {item.id == idatividade ? (
                                        <>
                                        <img src={BuscarImagem(item.imagem)} />
                                        <section className='Escuro'>
                                            <h3>{item.nome}</h3>
                                        </section>
                                        </>
                                    ) : (
                                        <>
                                        <button onClick={()=> navegacao(2, item.id)} className='b cem transparente'>Lições - {item.nome}</button>
                                        </>
                                    )}  
                                </section>
                                </>)}
                                </>
                            )}
                        </main>
                    </section>
                </section>

                <section className='PageSection'>
                    <section className='Info marginTop'>
                        <section className='Card min cor1 border'>
                            <section className='Title cor2'>
                                {atividade.map(item => <h3>{item.nome}</h3>)}
                            </section>
                            <div className='Desc'>
                                <section className='DescCard fix border cor2'>
                                    <div className='linha cor3'></div>
                                    {atividade.map(item => <h4>{item.descricao}</h4>)}
                                </section>
                            </div>
                        </section>
                        <section className='InfoFundo border cor1'>
                            {atividade.map(item => (
                                <img className='fundo' src={BuscarImagem(item.imagem)} alt="imagem de fundo" />
                            ))}
                            <section className='Escuro'>
                                <h3>{atividade.map(item => item.nome)}</h3>
                            </section>
                        </section>
                    </section>

                    <section className='SectionButtons'>
                        <button onClick={() => setSection(1)} className={`b nav cor3 ${section === 1 && "selecionado"}`}>
                            <img src={`/assets/images/icones/atividades${section === 1 ? "PE" : ""}.png`} alt="atividades" />
                            Lições
                        </button>
                        <button onClick={() => setSection(2)} className={`b nav cor3 ${section === 2 && "selecionado"}`}>
                            <img src={`/assets/images/icones/comentario${section === 2 ? "PE" : ""}.png`} alt="Comentários" />
                            Outros
                        </button>
                    </section>

                    <section className='InfoLicoes'>
                        <section className='SectionLicoes'>
                            {licoes === "Loading" || licoes === "Nenhuma lição encontrada." ? (
                                <StatusCard mensagem={licoes} />
                            ) : (
                                <>
                                    {licoes.map(item => (
                                        <section className='CardLicoes cor1 border' key={item.licao.id}>
                                            <section className='TitleLicoes'>
                                                {item.licao.nome !== "Nenhum título adicionado."
                                                    ? <section className='Title border cor2'><h3>{item.licao.nome}</h3></section>
                                                    : <section className='Title border cor2'><h3>{item.licao.pergunta}</h3></section>}
                                                <button className='b cor2 min'><img src={`/assets/images/icones/${item.licao.tipo}.png`} /></button>
                                                {item.licao.status == "Respondida" &&
                                                <button className='b cor2 min'>{item.licao.nota}</button>}
                                                {(item.licao.status != "Respondida" && item.licao.status != null) &&
                                                <button className='b cor2 auto'>{item.licao.status}</button>}
                                            </section>

                                            {item.licao.descricao !== "Nenhuma descrição adicionada." &&
                                                <section className="DescCard border cor2">
                                                    <div className='linha'></div>
                                                    <h4>{item.licao.descricao}</h4>
                                                </section>
                                            }

                                            {item.licao.nome !== "Nenhum título adicionado." &&
                                                <section className='TitleLicoes'>
                                                    <section className='Title border cor2'><h3>{item.licao.pergunta}</h3></section>
                                                </section>
                                            }

                                            {item.licao.tipo === "Writing" &&
                                                <section className="DescCard border cor2">
                                                    <div className='linha'></div>
                                                    {item.licao.resposta == null
                                                        ? <textarea onChange={(e) => adicionarRespostas(e.target.value, "Dissertativa", "Em análise", item.licao.id)} placeholder='Digite sua resposta' className='cor2 border'></textarea>
                                                        : <h4>{item.licao.resposta}</h4>
                                                    }
                                                </section>
                                            }

                                            {item.licao.tipo === "Reading" &&
                                            <>
                                            {item.licao.resposta == null ? (
                                                item.alternativas.map(alternativa => (
                                                    <button
                                                        key={alternativa.id}
                                                        onClick={() => adicionarRespostas(alternativa.nome, "Alternativa", "Respondida", item.licao.id)}
                                                        className={`b cor3 cem ${respostas.some(respin => respin.idlicao === item.licao.id && respin.resposta === alternativa.nome) ? 'selecionado' : ''}`}
                                                    >
                                                        {alternativa.nome}
                                                    </button>
                                                ))
                                            ) : (
                                                item.alternativas.map(alternativa => (
                                                    <button
                                                        key={alternativa.id}
                                                        className={`b cor3 cem ${alternativa.correto === true && "grey"} ${item.licao.resposta === alternativa.nome ? (alternativa.correto ? 'green' : 'red') : ''}`}
                                                    >
                                                        {alternativa.nome}
                                                    </button>
                                                ))
                                            )}
                                            </>
                                            }
                                        </section>
                                    ))}
                                </>
                            )}

                            {todasLicoesRespondidas && (
                                <button onClick={() => setCardenvio(true)} className='b cem amarelo'>Enviar respostas</button>
                            )}
                        </section>
                    </section>
                </section>
                </>
            )}
        </section>
    );
}
