import { useEffect, useRef, useState } from 'react';
import storage from 'local-storage';
import { useNavigate } from 'react-router-dom';

//conexoes
import { alterarDadosProfessorCon, dadosProfessorCon } from '../../../connection/professorConnection';
import { BuscarImagem } from '../../../connection/userConnection';

// components
import BarraLateral from '../../../components/admin/barraLateral';
import StatusCard from '../../../components/user/statusCard';
import StatusPage from '../../../components/user/statusPage'; 

// outros
import { toast } from 'react-toastify';
import LoadingBar from "react-top-loading-bar";

export default function ContaProfessor() {
    const professor = storage.get('professor');
    const [professorDados, setProfessorDados] = useState([]);
    const [carddados, setCarddados] = useState(false);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [numero, setNumero] = useState("");
    const [nascimento, setNascimento] = useState(""); 
    const [section, setSection] = useState(1);

    async function dadosProfessor() {
        setProfessorDados("Loading");
        try {
            const resposta = await dadosProfessorCon(professor.map(item => item.id));

            setNome(resposta.map(item => item.nome)[0] || ""); 
            setEmail(resposta.map(item => item.email)[0] || "");
            setNumero(resposta.map(item => item.numero)[0] || "");

            const dataFormatada = resposta.map(item => {
                const date = new Date(item.nascimento);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${year}-${month}-${day}`;
            })[0] || ""; 

            setNascimento(dataFormatada); 
            setProfessorDados(resposta);
        } catch (error) {
            console.error("Nenhum professor encontrado", error);
            setProfessorDados("Nenhum professor encontrado.");
        }
    }

    useEffect(() => {
        async function fetchData() {
            await dadosProfessor();
        }
        fetchData();
    }, []);

    const [sala, setSala] = useState([]);
    const [rendimento, setRendimento] = useState([]);

    async function dadosMinhaSala() {
        setSala("Essa função ainda não está disponível.");
    }

    async function dadosRendimento() {
        setRendimento("Essa função ainda não está disponível.");
    }

    useEffect(() => {
        async function fetchDataSection() {
            if (Array.isArray(professorDados)) {
                switch (section) {
                    case 1:
                        await dadosMinhaSala();
                        break;
                    case 2:
                        await dadosRendimento();
                        break;
                    default:
                        break;
                }
            }
        }
        fetchDataSection();
    }, [section, professorDados]);

    const [paisagem, setPaisagem] = useState(0);

    useEffect(() => {
        setPaisagem(Math.floor(Math.random() * 6) + 1);
    }, []);

    async function alterarDadosprofessor() {
        try {
            await alterarDadosProfessorCon(professor.map(item => item.id), nome, email, numero, nascimento)
            toast.dark("Dados alterados!")
            setCarddados(false)
            dadosProfessor()
        } catch (error) {
            toast.dark("Voce não pode executar essa ação!")
        }
    }

    const navigate = useNavigate()
    const ref = useRef()

    function navegacao(para) {
        ref.current.continuousStart()

        try {
            if (para == 1) {
                navigate(`/professor/minhasala`)
            } 
        }
        catch {
            toast.dark("Algo deu errado.")
        }
        finally {
            ref.current.complete()
        }
    }

    return (
        <section className='PageSize'>
            <LoadingBar color="#8A55CD" ref={ref} />
            <BarraLateral page={"minhaconta"} />

            {(professorDados === "Loading" || professorDados === "Nenhum professor encontrado.") ? (
                <StatusPage status={professorDados} /> 
            ) : (
                <>
                {carddados &&
                <StatusPage>
                    <section className='Card normalPadding cor1 border minH'>
                        <section className='Title cor2'>
                            <h3 className="cor2">Meus dados</h3>
                        </section>

                        <input 
                            onChange={(e) => setNome(e.target.value)} 
                            value={nome}              
                            placeholder='Meu nome' 
                            className='cor2 border' 
                        />
                        <input 
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email}              
                            placeholder='Meu email' 
                            className='cor2 border' 
                        />
                        <input 
                            onChange={(e) => setNumero(e.target.value)} 
                            value={numero}              
                            placeholder='Meu número' 
                            className='cor2 border' 
                        />
                        <input 
                            onChange={(e) => setNascimento(e.target.value)} 
                            type='date'
                            value={nascimento}              
                            placeholder='Meu nascimento' 
                            className='cor2 border' 
                        />
                        <section className='SectionButtons default'>
                            <button className='b cem cor3'>
                                {professorDados.map(item => item.tipo)}
                            </button>
                            <button className='b cem cor3'>
                                {professorDados.map(item => item.status)}
                            </button>
                        </section>
                        <section className='SectionButtons default'>
                            <button onClick={() => setCarddados(false)} className='b cor3 cem'>Voltar</button>
                            {(nome !== professorDados.map(item => item.nome)[0] ||
                              email !== professorDados.map(item => item.email)[0] ||
                              numero !== professorDados.map(item => item.numero)[0] ||
                              nascimento !== professorDados.map(item => {
                                const date = new Date(item.nascimento);
                                const day = String(date.getDate()).padStart(2, '0');
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const year = date.getFullYear();
                                return `${year}-${month}-${day}`;
                              })[0]) &&
                            <button onClick={alterarDadosprofessor} className='b cor3 cem'>Alterar dados</button>}
                        </section>
                    </section>
                </StatusPage>}

                <section className='InfoFundo marginTop cor1 border'>
                    {(professorDados === "Loading" || professorDados === "Nenhum professor encontrado.") || professorDados.map(item => item.imagem)
                    ? <img className='fundo' src={`/assets/images/paisagens/fundo${paisagem}.jpg`} />
                    : <>{professorDados.map(item => <img className='fundo' key={item.id} src={BuscarImagem(item.imagemSala)} />)}</>}
                    <section className='Escuro'>
                        <section className='PerfilImage cor0'>
                            <section className='imgPerfilImage cor2 border'>
                                {(professorDados === "Loading" || professorDados === "Nenhum professor encontrado")
                                    ? <img className='Load icon' src='/assets/images/icones/Loading.png' />
                                    : <img src={BuscarImagem(professorDados.map(item => item.imagem))} />}
                            </section>
                        </section>
                    </section>
                </section>

                <section className='SectionButtons'>
                    <button onClick={() => setSection(1)} className={`b nav cor3 ${section === 1 && "selecionado"}`}>
                        <img src={`/assets/images/icones/Avisos${section === 1 ? "PE" : ""}.png`} />Dados
                    </button>
                    <button onClick={() => setSection(2)} className={`b nav cor3 ${section === 2 && "selecionado"}`}>
                        <img src={`/assets/images/icones/Trilhas${section === 2 ? "PE" : ""}.png`} />Meu rendimento
                    </button>
                </section>
                <section className='SectionCards'>
                    {section === 1 &&
                        <>
                        {(professorDados === "Loading" || professorDados === "Nenhum professor encontrado.") ? (
                            <StatusCard mensagem={professorDados} />
                        ) : (
                            <section className='Info InfoDados'>
                                <section className='Card CardDados cem cor1 border'>
                                    <section className='Title  cor2'>
                                        <h3>{professorDados.map(item => item.nome)}</h3>
                                    </section>
                                    <div className='Desc'>
                                        <section className='DescCard border cor2'>
                                            <div className='linha cor3'></div>
                                            <h4>Bem-vindo à Smart Lingu! Esta é a sua página de perfil, onde você pode acompanhar seu progresso no curso. Aqui, você encontrará uma visão detalhada do seu desempenho, incluindo as trilhas de aprendizado que você já completou e as atividades que você concluiu. Além disso, você poderá ver as lições que já foram respondidas e aquelas que ainda estão pendentes. Acompanhe seu avanço e continue se dedicando para alcançar seus objetivos de aprendizado!</h4>
                                        </section>
                                        <button onClick={() => setCarddados(true)} className='b cor3 cem'> 
                                            Ver meus dados
                                        </button>
                                    </div>
                                </section>

                                {(sala === "Loading" || sala === "Nenhuma sala encontrada.") ? (
                                    <StatusCard mensagem={sala} />
                                ) : (
                                    <section className='InfoFundo cor1 border'>
                                        {sala.map(item => 
                                            <>
                                            <img className='fundo' src={BuscarImagem(item.sala.imagem)} alt={item.sala.nome} />
                                            <section onClick={()=> navegacao(1)} className='Escuro'><h3>{item.sala.nome}</h3></section>
                                            </>
                                        )}
                                    </section>
                                )}
                            </section>
                        )}
                        </>
                    }

                    {section === 2 &&
                        <>
                        {(rendimento === "Loading" || rendimento === "Parece que não tem nada aqui." || rendimento === "Essa função ainda não está disponível.") ? (
                            <StatusCard mensagem={rendimento} />
                        ) : (
                            <></>
                        )}
                        </>
                    }
                </section>
                </>
            )}
        </section>
    );
}
