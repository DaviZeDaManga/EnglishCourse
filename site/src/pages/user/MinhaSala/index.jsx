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
import { BuscarImagem, dadosMinhaSalaCon, entrarSalaCon } from '../../../connection/alunoConnection';
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
            dadosSalas()
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

    const [section2, setSection2] = useState(1)
    const [joinByCode, setJoinByCode] = useState(false)
    const [codigo, setCodigo] = useState("")
    const [salas, setSalas] = useState([])
    const [paisagem, setPaisagem] = useState(0);

    async function dadosSalas() {
        setSalas("Loading");
        try {
            const resposta = await dadosSalasCon();
            setSalas(resposta);
        } catch (error) {
            console.error('Erro ao buscar dados das salas:', error);
            setSalas("Nenhuma sala encontrada.");
        }
    }

    useEffect(() => {
        async function fetchSectionData() {
            if (sala === "Nenhuma sala encontrada.") {
                switch (section2) {
                    case 1:
                        await dadosSalas();
                        break;
                    case 2:
                        break;
                    default:
                        break;
                }
            }
        }
        fetchSectionData();
    }, [section2]);

    useEffect(() => {
        setPaisagem(Math.floor(Math.random() * 6) + 1);
    }, []);

    async function entrarSala() {
        try {
            await entrarSalaCon(aluno.map(item => item.id), codigo)
            toast.dark("Seja bem-vindo(a)!")
            dadosMinhaSala()
        }
        catch (error) {
            console.error("Erro ao entrar na sala:", error)
            toast.dark("Erro ao entrar na sala.")
        }
    }

    return (
        <div className='MinhaSala'>
            <BarraLateral page={"minhasala"} />
    
            {sala === "Loading" ? (
                <StatusPage status={sala} />
            ) : (
                <>
                    {sala === "Nenhuma sala encontrada." ? (
                        <>
                        {joinByCode === true &&
                        <StatusPage>
                        <main className={`Card cor1 border visible normalPadding`}>
                            <section className='Title cor2'>
                                <h3 className="cor2">Inserir código</h3>
                            </section>
                            <section className='Desc'>
                                <section className={`DescCard border fix cor2`}>
                                    <div className='linha'></div>
                                    <h4>Olá, já contem o código da sala? Perfeito! Apenas insira e aperte em entrar! Vamos começar nossas aulas, sem perda de tempo. Como entrar na minha sala por código? Faça login em sua conta, pegue o cõdigo com seu professor, insira no campo abaixo e inicie seus estudos!</h4>
                                </section>
                            </section>
                            <input onChange={(e)=> setCodigo(e.target.value)} value={codigo} placeholder='Código da sala' className='cor2 border'></input>
                            <section className='SectionButtons default'>
                                <button onClick={()=> setJoinByCode(false)} className='b cem cor3'>Cancelar</button>
                                <button onClick={()=> entrarSala()} className='b cem cor3'>Participar</button>
                            </section>
                        </main>
                        </StatusPage>}

                        <section className='Info'>
                            <section className='InfoFundo border cor1'>
                                <img className='fundo' src={`/assets/images/paisagens/fundo${paisagem}.jpg`} />
                                <section className='Escuro'></section>
                            </section>
                        </section>

                        <section className='SectionButtons'>
                            <button onClick={()=> setJoinByCode(true)} className='b min cor3'><img src={`/assets/images/icones/3pontos.png`} /></button>
                            <button onClick={() => setSection2(1)} className={`b cor3 ${section2 == 1 && "selecionado"}`}>
                                <img src={`/assets/images/icones/Salas${section2 == 1 ? "PE" : ""}.png`} />Salas disponíveis
                            </button>
                            <button onClick={() => setSection2(2)} className={`b cor3 ${section2 == 2 && "selecionado"}`}>
                                <img src={`/assets/images/icones/Avisos${section2 == 2 ? "PE" : ""}.png`} />Pedidos para entrar
                            </button>
                        </section>

                        {section2 == 1 &&
                        <>
                        {salas === "Loading" || salas === "Nenhuma sala encontrada." ? (
                            <StatusCard mensagem={salas} />
                        ) : (
                            <>
                            {salas.map( item=>
                            <Card
                            key={item.id}
                            estilo={2}
                            id={item.id}
                            name={item.nome}
                            desc={item.descricao}
                            img={item.imagem}
                            video={item.video}
                            para={0}
                            />
                            )}
                            </>
                        )}
                        </>}

                        {section2 == 2 &&
                        <>
                        {salas === "Loading" || salas === "Nenhuma sala encontrada." ? (
                            <StatusCard mensagem={salas} />
                        ) : (
                            <>
                           <StatusCard mensagem={"Nenhuma sala encontrada."} />
                            </>
                        )}
                        </>}
                        
                        </>
                    ) : (
                        <>
                        <section className='Info'>
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
                            <button onClick={() => setSection(1)} className={`b cor3 ${section == 1 && "selecionado"}`}>
                                <img src={`/assets/images/icones/Trilhas${section == 1 ? "PE" : ""}.png`} />Trilhas
                            </button>
                            <button onClick={() => setSection(2)} className={`b cor3 ${section == 2 && "selecionado"}`}>
                                <img src={`/assets/images/icones/Avisos${section == 2 ? "PE" : ""}.png`} />Avisos
                            </button>
                            <button onClick={() => setSection(3)} className={`b cor3 ${section == 3 && "selecionado"}`}>
                                <img src={`/assets/images/icones/Lives${section == 3 ? "PE" : ""}.png`} />Transmissões
                            </button>
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
