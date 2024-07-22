import './index.scss';
import { useEffect, useState } from 'react';
import storage from 'local-storage';

// conexoes
import { dadosAvisosCon, dadosSalasCon, dadosTransmissoesCon, dadosTrilhasCon } from '../../../connection/userConnection';

// components
import BarraLateral from '../../../components/user/barraLateral';
import Titulo from '../../../components/user/titulo';
import Card from '../../../components/user/card';
import StatusCard from '../../../components/user/statusCard';
import StatusPage from '../../../components/user/statusPage';

// outros
import { BuscarImagem, dadosMinhaSalaCon } from '../../../connection/alunoConnection';
import { toast } from 'react-toastify';

export default function MinhaSala() {
    const aluno = storage.get('aluno') || [];
    const [sala, setSala] = useState([]);

    async function dadosMinhaSala() {
        setSala("Loading");
        try {
            const resposta = await dadosMinhaSalaCon(aluno.map(item => item.id));
            setSala(resposta);
        } catch (error) {
            console.error('Erro ao buscar dados da minha sala:', error);
            setSala("Nenhuma sala encontrada.");
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                await dadosMinhaSala();
            } catch (error) {
                console.error('Erro ao carregar dados da minha sala:', error);
                toast.dark("Erro ao carregar dados da minha sala.")
            }
        }
        fetchData();
    }, []);

    const [section, setSection] = useState(1);
    const [trilhas, setTrilhas] = useState([]);
    const [avisos, setAvisos] = useState([]);
    const [transmissoes, setTransmissoes] = useState([]);

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
            if (Array.isArray(sala)) {
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
    }, [section]);

    return (
        <div className='MinhaSala'>
            <BarraLateral page={"minhasala"} />
            <Titulo nome={"Minha Sala"} />
    
            {sala === "Loading" ? (
                <StatusPage status={sala} />
            ) : (
                <>
                    {sala === "Nenhuma sala encontrada." ? (
                        <section className='Info marginTop'>
                            <StatusCard mensagem={"Entre em uma sala para começar suas aulas!"}>
                                <button className='b cor3 min'>Participar da turma</button>
                            </StatusCard>
                        </section>
                    ) : (
                        <>
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
                                        <img src={`/assets/images/icones/pessoas.png`} alt="imagem sala" />
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
                    
                        <section className='SectionButtons'>
                            {['Trilhas', 'Avisos', 'Lives'].map((tipo, idx) => (
                                <button 
                                    key={tipo} 
                                    onClick={() => setSection(idx + 1)} 
                                    className={`b cor3 ${section === idx + 1 && "selecionado"}`}
                                >
                                    <img src={`/assets/images/icones/${tipo}${section === idx + 1 ? "PE" : ""}.png`} />
                                    {tipo === 'Lives' ? 'Transmissões' : tipo}
                                </button>
                            ))}
                        </section>

                        <main className='SectionCards'>
                            {[trilhas, avisos, transmissoes][section - 1] === "Loading" || 
                                [trilhas, avisos, transmissoes][section - 1] === "Parece que não tem nada aqui." ? (
                                <StatusCard mensagem={[trilhas, avisos, transmissoes][section - 1]} />
                            ) : (
                                <>
                                    {([trilhas, avisos, transmissoes][section - 1]).map(item => (
                                        <Card
                                            key={item.id}
                                            estilo={section === 1 ? 2 : 1}
                                            id={item.id}
                                            idsala={sala.map(item => item.id)}
                                            name={item.nome}
                                            desc={item.descricao}
                                            img={item.imagem}
                                            video={item.video}
                                            para={section}
                                        />
                                    ))}
                                </>
                            )}
                        </main>
                        </>
                    )}
                </>
            )}
        </div>
    );    
}
