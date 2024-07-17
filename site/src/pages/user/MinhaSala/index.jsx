import './index.scss';
import { useEffect, useState } from 'react';
import storage from 'local-storage';

// conexoes
import { dadosAvisosCon, dadosSalasCon, dadosTransmissoesCon, dadosTrilhasCon } from '../../../connection/userConnection';

// components
import BarraLateral from '../../../components/user/barraLateral';
import Titulo from '../../../components/user/titulo';
import Card from '../../../components/user/card';
import ErrorCard from '../../../components/user/error';
import StatusPage from '../../../components/user/statusPage';

// outros
import { BuscarImagem, dadosMinhaSalaCon } from '../../../connection/alunoConnection';

export default function MinhaSala() {
    const aluno = storage.get('aluno') || [];
    const [sala, setSala] = useState([]);
    const [section, setSection] = useState(1);
    const [trilhas, setTrilhas] = useState([]);
    const [avisos, setAvisos] = useState([]);
    const [transmissoes, setTransmissoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [section2, setSection2] = useState(1);
    const [salas, setSalas] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                await dadosMinhaSala();
                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar dados da minha sala:', error);
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    async function dadosMinhaSala() {
        setSala("Loading");
        try {
            const resposta = await dadosMinhaSalaCon(aluno.map(item => item.id));
            if (Array.isArray(resposta)) {
                setSala(resposta);
            } else {
                setSala([]);
            }
        } catch (error) {
            console.error('Erro ao buscar dados da minha sala:', error);
            setSala([]);
        }
    }

    async function dadosTrilhas() {
        setTrilhas("Loading");
        try {
            const resposta = await dadosTrilhasCon(aluno.map(item => item.id), sala.map(item => item.id));
            if (Array.isArray(resposta)) {
                setTrilhas(resposta);
            } else {
                setTrilhas([]);
            }
        } catch (error) {
            console.error('Erro ao buscar dados das trilhas:', error);
            setTrilhas("Parece que não tem nada aqui.");
        }
    }

    async function dadosAvisos() {
        setAvisos("Loading");
        try {
            const resposta = await dadosAvisosCon(aluno.map(item => item.id), sala.map(item => item.id));
            if (Array.isArray(resposta)) {
                setAvisos(resposta);
            } else {
                setAvisos([]);
            }
        } catch (error) {
            console.error('Erro ao buscar dados dos avisos:', error);
            setAvisos("Parece que não tem nada aqui.");
        }
    }

    async function dadosTransmissoes() {
        setTransmissoes("Loading");
        try {
            const resposta = await dadosTransmissoesCon(aluno.map(item => item.id), sala.map(item => item.id));
            if (Array.isArray(resposta)) {
                setTransmissoes(resposta);
            } else {
                setTransmissoes([]);
            }
        } catch (error) {
            console.error('Erro ao buscar dados das transmissões:', error);
            setTransmissoes("Parece que não tem nada aqui.");
        }
    }

    useEffect(() => {
        async function fetchSectionData() {
            if (!loading) {
                switch (section) {
                    case 1:
                        await dadosTrilhas();
                        break;
                    case 2:
                        await dadosAvisos();
                        break;
                    case 3:
                        await dadosTransmissoes();
                        break;
                    default:
                        break;
                }
            }
        }
        fetchSectionData();
    }, [section, loading]);

    async function Salas() {
        setSalas("Loading");
        try {
            const resposta = await dadosSalasCon();
            if (Array.isArray(resposta)) {
                setSalas(resposta);
            } else {
                setSalas([]);
            }
        } catch {
            setSalas([]);
        }
    }

    useEffect(() => {
        Salas();
    }, []);

    return (
        <div className='MinhaSala'>
            <BarraLateral page={"minhasala"} />
            <Titulo nome={"Minha Sala"} />
            {Array.isArray(sala) && sala.length > 0 &&
                <>
                    {sala.some(item => item.statusAluno === "Análise") &&
                    <StatusPage mensagem={{titulo: "Em análise", mensagem: "Voce ainda não pode acessar a sala, seu perfil está passando por uma análise."}} />}
                </>
            }

            {loading ? (
                <StatusPage status={"Loading"}/>
            ) : (
                <>
                    {sala === "Loading" || sala === "Nenhuma sala encontrada." ? (
                        <ErrorCard mensagem={sala} />
                    ) : (
                        <section className='Info marginTop'>
                            <section className='Card min cor1 border'>
                                <section className='Title cor2'>
                                    {sala.map(item => <h3 key={item.id}>{item.nome}</h3>)}
                                </section>
                                <div className='Desc'>
                                    <section className='DescCard border cor2'>
                                        <div className='linha cor3'></div>
                                        {sala.map(item => <h4 key={item.id}>{item.descricao}</h4>)}
                                    </section>
                                    <button className='b cem cor3'>
                                        {sala.map(item => <img key={item.id} src={`/assets/images/icones/pessoas.png`} alt="imagem sala" />)}
                                        Pessoas
                                    </button>
                                </div>
                            </section>
                            <section className='InfoFundo border cor1'>
                                {sala.map(item => (
                                    <img key={item.id} className='fundo' src={BuscarImagem(item.imagem)} alt="imagem de fundo" />
                                ))}
                            </section>
                        </section>
                    )}

                    {(sala !== "Loading" || sala !== "Nenhuma sala encontrada.") &&
                        <section className='SectionButtons'>
                            <button onClick={() => setSection(1)} className={`b cor3 ${section === 1 && "selecionado"}`}>
                                <img src={`/assets/images/icones/Trilhas${section === 1 ? "PE" : ""}.png`} />
                                Trilhas
                            </button>
                            <button onClick={() => setSection(2)} className={`b cor3 ${section === 2 && "selecionado"}`}>
                                <img src={`/assets/images/icones/Avisos${section === 2 ? "PE" : ""}.png`} />
                                Avisos
                            </button>
                            <button onClick={() => setSection(3)} className={`b cor3 ${section === 3 && "selecionado"}`}>
                                <img src={`/assets/images/icones/Lives${section === 3 ? "PE" : ""}.png`} />
                                Transmissões
                            </button>
                        </section>}

                    {sala === "Nenhuma sala encontrada." &&
                        <section className='SectionButtons'>
                            <button onClick={() => setSection2(1)} className={`b cor3 ${section2 === 1 && "selecionado"}`}>
                                <img src={`/assets/images/icones/salas${section2 === 1 ? "PE" : ""}.png`} />
                                Salas disponíveis
                            </button>
                            <button onClick={() => setSection2(2)} className={`b cor3 ${section2 === 2 && "selecionado"}`}>
                                <img src={`/assets/images/icones/Avisos${section2 === 2 ? "PE" : ""}.png`} />
                                Avisos
                            </button>
                        </section>}

                    {(sala !== "Loading" || sala !== "Nenhuma sala encontrada.") &&
                        <main className='SectionCards'>
                            {section === 1 && (
                                <>
                                    {trilhas === "Loading" || trilhas === "Parece que não tem nada aqui." ? (
                                        <ErrorCard mensagem={trilhas} />
                                    ) : (
                                        <>
                                            {trilhas.map(item => (
                                                <Card
                                                    key={item.id}
                                                    estilo={2}
                                                    id={item.id}
                                                    idSala={sala.map(item=> item.id)}
                                                    name={item.nome}
                                                    desc={item.descricao}
                                                    img={item.imagem}
                                                    video={item.video}
                                                    para={1}
                                                />
                                            ))}
                                        </>
                                    )}
                                </>
                            )}

                            {section === 2 && (
                                <>
                                    {avisos === "Loading" || avisos === "Parece que não tem nada aqui." ? (
                                        <ErrorCard mensagem={avisos} />
                                    ) : (
                                        <>
                                            {avisos.map(item => (
                                                <Card
                                                    key={item.id}
                                                    estilo={1}
                                                    id={item.id}
                                                    idsala={sala.map(item=> item.id)}
                                                    name={item.nome}
                                                    desc={item.descricao}
                                                    img={item.imagem}
                                                    video={item.video}
                                                    para={2}
                                                />
                                            ))}
                                        </>
                                    )}
                                </>
                            )}

                            {section === 3 && (
                                <>
                                    {transmissoes === "Loading" || transmissoes === "Parece que não tem nada aqui." ? (
                                        <ErrorCard mensagem={transmissoes} />
                                    ) : (
                                        <>
                                            {transmissoes.map(item => (
                                                <Card
                                                    key={item.id}
                                                    estilo={1}
                                                    id={item.id}
                                                    idsala={sala.map(item=> item.id)}
                                                    name={item.nome}
                                                    desc={item.descricao}
                                                    img={item.imagem}
                                                    video={item.video}
                                                    para={3}
                                                />
                                            ))}
                                        </>
                                    )}
                                </>
                            )}
                        </main>}

                    {sala === "Nenhuma sala encontrada." &&
                        <main className='SectionCards marginTop'>
                            {section2 === 1 && (
                                <>
                                    {(salas === "Loading" || salas === "Nenhuma sala encontrada.") ? (
                                        <ErrorCard margin={"top"} mensagem={salas} />
                                    ) : (
                                        <>
                                            {salas.map(item => (
                                                <Card
                                                    key={item.id}
                                                    estilo={2}
                                                    id={item.id}
                                                    name={item.nome}
                                                    desc={item.descricao}
                                                    img={item.imagem}
                                                    video={item.video}
                                                    para={0}
                                                    tipo={"PedirEntrar"}
                                                />
                                            ))}
                                        </>
                                    )}
                                </>
                            )}
                        </main>}
                </>
            )}
        </div>
    );
}
