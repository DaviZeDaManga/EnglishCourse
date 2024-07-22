import './index.scss';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// conexoes
import { dadosAtividadesCon, dadosTrilhaCon } from '../../../connection/userConnection';

// components
import BarraLateral from '../../../components/user/barraLateral';
import Titulo from '../../../components/user/titulo';
import Card from '../../../components/user/card';
import StatusCard from '../../../components/user/statusCard';
import StatusPage from '../../../components/user/statusPage';

// outros
import { BuscarImagem } from '../../../connection/alunoConnection';

export default function Trilha() {
    const {idsala, idtrilha} = useParams();
    const [trilha, setTrilha] = useState([]);
    const [loading, setLoading] = useState(true);
    const [section, setSection] = useState(1);
    const [atividades, setAtividades] = useState([]);
    const [rendimento, setRendimento] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                await dadosTrilha();
                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar dados da trilha:', error);
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    async function dadosTrilha() {
        try {
            const resposta = await dadosTrilhaCon(1, idsala, idtrilha);
            if (Array.isArray(resposta)) {
                setTrilha(resposta)
            } else {
                setTrilha([])
            }
        } catch (error) {
            console.error('Erro ao buscar dados das trilhas:', error);
            setTrilha([])
        }
    }

    async function dadosAtividades() {
        setAtividades("Loading");
        try {
            let resposta = await dadosAtividadesCon(1, idsala, idtrilha);
            if (Array.isArray(resposta)) {
                setAtividades(resposta);
            } else {
                setAtividades([]);
            }
        } catch (error) {
            console.error('Erro ao buscar dados das atividades:', error);
            setAtividades("Parece que não tem nada aqui.")
        }
    }

    async function dadosRendimentoTrilha() {
        
    }

    useEffect(() => {
        async function fetchSectionData() {
            if (!loading) {
                switch (section) {
                    case 1:
                        await dadosAtividades();
                        break;
                    case 2:
                        await dadosRendimentoTrilha();
                        break
                    default:
                        break
                }
            }
        }
        fetchSectionData();
    }, [section, loading]);

    return (
        <div className='Trilha'>
            <BarraLateral page={"Trilha"} />
            <Titulo nome={"Trilha"} />

            {loading ? (
                <StatusPage status={"Loading"} />
            ) : (
                <section className='Info marginTop'>
                    <section className='Card min cor1 border'>
                        <section className='Title cor2'>
                            {trilha.map(item => <h3 key={item.id}>{item.nome}</h3>)}
                        </section>
                        <div className='Desc'>
                            <section className='DescCard border cor2'>
                                <div className='linha cor3'></div>
                                {trilha.map(item => <h4 key={item.id}>{item.descricao}</h4>)}
                            </section>
                            <button className='b cor3 cem'>
                                {trilha.map(item => <img key={item.id} src={item.img} alt="imagem sala" />)}
                                Pessoas
                            </button>
                        </div>
                    </section>
                    <section className='InfoFundo border cor1'>
                        {trilha.map(item => (
                            <img key={item.id} className='fundo' src={BuscarImagem(item.imagem)} alt="imagem de fundo" />
                        ))}
                    </section>
                </section>
            )}

            <section className='SectionButtons'>
                <button onClick={() => setSection(1)} className={`b cor3 ${section === 1 && "selecionado"}`}>
                    <img src={`/assets/images/icones/Trilhas${section === 1 ? "PE" : ""}.png`} />
                    Atividades
                </button>
                <button onClick={() => setSection(2)} className={`b cor3 ${section === 2 && "selecionado"}`}>
                    <img src={`/assets/images/icones/Avisos${section === 2 ? "PE" : ""}.png`} />
                    Meu rendimento
                </button>
            </section>

            <main className='SectionCards'>
                {section === 1 && (
                    <>
                        {(atividades === "Loading" || atividades === "Parece que não tem nada aqui.") ? (
                            <StatusCard mensagem={atividades} />
                        ) : (
                            <>
                                {atividades.map(item =>
                                    <Card
                                        key={item.id}
                                        estilo={1}
                                        id={item.id}
                                        name={item.nome}
                                        desc={item.descricao}
                                        img={item.imagem}
                                        video={item.video}
                                        para={4}
                                       
                                        importante={item.conteudo}
                                    />
                                )}
                            </>
                        )}
                    </>
                )}

                {section === 2 && (
                    <>
                        {rendimento.length <= 0 ? (
                            <StatusCard mensagem={"Essa função ainda não está disponível."} />
                        ) : (
                            <>
                                {/* Conteúdo do rendimento aqui */}
                            </>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
