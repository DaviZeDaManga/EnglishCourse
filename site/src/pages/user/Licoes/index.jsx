import './index.scss';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import storage from 'local-storage';

// conexões
import { dadosAtividadeAlunoCon, dadosLicoesAlunoCon, inserirRespostaCon } from '../../../connection/alunoConnection';

// components
import BarraLateral from '../../../components/user/barraLateral';
import Titulo from '../../../components/user/titulo';
import Card from '../../../components/user/card';
import StatusCard from '../../../components/user/statusCard';

// outros
import { toast } from 'react-toastify';
import StatusPage from '../../../components/user/statusPage';

export default function Licoes() {
    const aluno = storage.get('aluno') || [];
    const { idsala, idtrilha, idatividade } = useParams();
    const [atividade, setAtividade] = useState([]);
    const [licoes, setLicoes] = useState([]);
    const [respostas, setRespostas] = useState([]);
    const [cardenvio, setCardenvio] = useState(false);
    const [enviar, setEnviar] = useState("");

    async function dadosAtividade() {
        setAtividade("Loading");
        try {
            const resposta = await dadosAtividadeAlunoCon(aluno.map(item => item.id), idsala, idtrilha, idatividade);
            setAtividade(resposta);
        } catch (error) {
            console.error("Nenhuma atividade encontrada:", error);
            setAtividade("Nenhuma atividade encontrada.");
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                await dadosAtividade();
            } catch (error) {
                console.error("Erro ao tentar carregar atividade:", error);
                toast.dark("Erro ao tentar carregar atividade.");
            }
        }
        fetchData();
    }, [idsala, idtrilha, idatividade]);

    async function dadosLicoes() {
        setLicoes("Loading");
        try {
            const resposta = await dadosLicoesAlunoCon(aluno.map(item => item.id), idsala, idtrilha, idatividade);
            setLicoes(resposta);
        } catch (error) {
            console.error("Nenhuma lição encontrada:", error);
            setLicoes("Nenhuma lição encontrada.");
        }
    }

    useEffect(() => {
        if (Array.isArray(atividade)) {
            async function fetchDataSection() {
                try {
                    await dadosLicoes();
                } catch (error) {
                    console.error("Erro ao tentar carregar as lições:", error);
                    toast.dark("Erro ao tentar carregar as lições.");
                }
            }
            fetchDataSection();
        }
    }, [atividade]);

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
                } catch (inserirError) {
                    console.error(`Erro ao enviar resposta ${i + 1}:`, inserirError);
                }
            }
            toast.dark("Suas respostas foram enviadas com sucesso.");
        } catch (error) {
            console.error("Erro ao enviar respostas:", error);
            toast.dark("Suas respostas não foram enviadas.");
        }
    }

    const todasLicoesRespondidas = licoes !== "Loading" && licoes !== "Nenhuma lição encontrada." && licoes.every(licao =>
        respostas.some(resposta => resposta.idlicao === licao.licao.id && resposta.resposta)
    );

    return (
        <section className='Licoes'>
            <BarraLateral page={"Lições"} />
            <Titulo nome={"Lições"} />

            {cardenvio && (
                <StatusPage>
                    <section className='EnviarRespostas cor1 border'>
                        <div className='Titulo'>
                            <button onClick={() => setCardenvio(false)} className='b cor3'>
                                <img src='/assets/images/icones/voltar.png' alt="Voltar" />
                            </button>
                            <section className='NomeTitulo cem cor3'>
                                <h3>Deseja enviar suas respostas?</h3>
                            </section>
                        </div>
                        <input
                            onChange={(e) => setEnviar(e.target.value)}
                            value={enviar}
                            className='cor2 border'
                            placeholder='Digite "Confirmar" para fazer essa ação'
                        />
                        {enviar === "Confirmar" && (
                            <button onClick={() => enviarRespostas()} className='b cor3 cem'>Enviar</button>
                        )}
                    </section>
                </StatusPage>
            )}

            {atividade === "Loading" || atividade === "Nenhuma atividade encontrada." || atividade.map(item => item.status) === "Não feita" ? (
                <StatusPage status={atividade} />
            ) : (
                <section className='Info marginTop'>
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
                                                    className={`b cor3 cem ${item.licao.resposta === alternativa.nome ? (alternativa.correto ? 'green' : 'red') : ''}`}
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

                        {respostas.length > 0 && (
                            <button onClick={() => setCardenvio(true)} className='b cem amarelo'>Enviar respostas</button>
                        )}
                    </section>

                    <section className='CardAtividadeLicoes'>
                        {atividade.map(item =>
                            <Card
                                key={item.id}
                                estilo={2}
                                id={item.id}
                                name={item.nome}
                                desc={item.descricao}
                                img={item.imagem}
                                video={item.video}
                                para={4}
                                conteudo={false}
                                width={"cem"}
                            />
                        )}
                    </section>
                </section>
            )}
        </section>
    );
}
