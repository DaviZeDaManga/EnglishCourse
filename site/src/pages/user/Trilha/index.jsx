import './index.scss';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import storage from 'local-storage';

// conexoes
import { dadosAtividadesAlunoCon, dadosTrilhaAlunoCon } from '../../../connection/alunoConnection';
import { BuscarImagem } from '../../../connection/userConnection';

// components
import BarraLateral from '../../../components/user/barraLateral';
import Titulo from '../../../components/user/titulo';
import Card from '../../../components/user/card';
import StatusCard from '../../../components/user/statusCard';
import StatusPage from '../../../components/user/statusPage';

// outros
import { toast } from 'react-toastify';

export default function Trilha() {
    const aluno = storage.get('aluno') || [];
    const {idsala, idtrilha} = useParams();
    const [trilha, setTrilha] = useState([]);

    async function dadosTrilha() {
        setTrilha("Loading")
        try {
            const resposta = await dadosTrilhaAlunoCon(aluno.map(item => item.id), idsala, idtrilha);
            setTrilha(resposta)
        } catch (error) {
            console.error('Erro ao buscar dados das trilhas:', error);
            setTrilha("Nenhuma trilha encontrada.")
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                await dadosTrilha();
            } catch (error) {
                console.error('Erro ao carregar dados da trilha:', error);
                toast.dark("Erro ao carregar dados da trilha.")
            }
        }
        fetchData();
    }, []);

    const [section, setSection] = useState(1);
    const [atividades, setAtividades] = useState([]);
    const [rendimento, setRendimento] = useState([]);

    async function dadosAtividades() {
        setAtividades("Loading");
        try {
            let resposta = await dadosAtividadesAlunoCon(aluno.map(item => item.id), idsala, idtrilha);
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
        setRendimento("Essa função ainda não está disponível.")
    }

    useEffect(() => {
        async function fetchSectionData() {
            if (Array.isArray(trilha)) {
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
    }, [section, trilha]);

    return (
        <div className='PageSize PageTrilha'>
            <BarraLateral page={"Trilha"} />

            {(trilha == "Loading" || trilha == "Nenhuma trilha encontrada.") ? (
                <StatusPage status={trilha} />
            ) : (
                <>
                <Titulo nome={"Trilha"} />
                <section className='Info marginTop'>
                    <section className='Card min cor1 border'>
                        <section className='Title cor2'>
                            {trilha.map(item => <h3 key={item.id}>{item.nome}</h3>)}
                        </section>
                        <div className='Desc'>
                            <section className='DescCard fix border cor2'>
                                <div className='linha cor3'></div>
                                {trilha.map(item => <h4 key={item.id}>{item.descricao}</h4>)}
                            </section>
                        </div>
                    </section>
                    <section className='InfoFundo border cor1'>
                        {trilha.map(item => (
                            <img key={item.id} className='fundo' src={BuscarImagem(item.imagem)} alt="imagem de fundo" />
                        ))}
                        <section className='Escuro'></section>
                    </section>
                </section>

                <section className='SectionButtons'>
                    <button onClick={() => setSection(1)} className={`b nav cor3 ${section === 1 && "selecionado"}`}>
                        <img src={`/assets/images/icones/Trilhas${section === 1 ? "PE" : ""}.png`} />
                        Atividades
                    </button>
                    <button onClick={() => setSection(2)} className={`b nav cor3 ${section === 2 && "selecionado"}`}>
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
                                            status={item.status}
                                            conteudo={item.conteudo}
                                            licoes={item.licoes}
                                        />
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {section === 2 && (
                        <>
                            {(rendimento === "Loading" || rendimento === "Parece que não tem nada aqui." || rendimento === "Essa função ainda não está disponível.") ? (
                                <StatusCard mensagem={rendimento} />
                            ) : (
                                <>
                                    <></>
                                </>
                            )}
                        </>
                    )}
                </main>
                </>
            )}
        </div>
    );
}
