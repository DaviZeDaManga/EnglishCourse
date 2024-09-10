import { useEffect, useState } from 'react';
import storage from 'local-storage';
import { useNavigate } from 'react-router-dom';

//conexoes
import { alterarDadosAlunoCon, dadosAlunoCon, dadosMinhaSalaCon } from '../../../connection/alunoConnection';
import { BuscarImagem } from '../../../connection/userConnection';

// components
import BarraLateral from '../../../components/user/barraLateral';
import StatusCard from '../../../components/user/statusCard';
import StatusPage from '../../../components/user/statusPage'; 

// outros
import { toast } from 'react-toastify';
import CardSections from '../../../components/user/cardSections';

export default function ContaUser() {
    const aluno = storage.get('aluno');
    const [alunoDados, setAlunoDados] = useState("Loading");
    const [loading, setLoading] = useState(true);
    const [carddados, setCarddados] = useState(false);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [numero, setNumero] = useState("");
    const [nascimento, setNascimento] = useState(""); 
    const [section, setSection] = useState(1);

    async function dadosAluno() {
        try {
            const resposta = await dadosAlunoCon(aluno.map(item => item.id));

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
            setAlunoDados(resposta);
        } catch (error) {
            console.error("Nenhum aluno encontrado", error);
            setAlunoDados("Nenhum aluno encontrado.");
        }
    }

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                await dadosAluno();
            } catch (error) {
                console.error("Erro ao carregar dados do aluno:", error);
                toast.dark("Erro ao carregar dados do aluno.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const [sala, setSala] = useState("Loading");
    const [rendimento, setRendimento] = useState([]);

    async function dadosMinhaSala() {
        try {
            const resposta = await dadosMinhaSalaCon(aluno.map(item => item.id));
            setSala(resposta);
        } catch (error) {
            console.error('Erro ao buscar dados da minha sala:', error);
            setSala("Nenhuma sala encontrada.");
        }
    }

    async function dadosRendimento() {
        setRendimento("Essa função ainda não está disponível.");
    }

    useEffect(() => {
        async function fetchDataSection() {
            if (Array.isArray(alunoDados)) {
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
    }, [section, alunoDados]);

    const [paisagem, setPaisagem] = useState(0);

    useEffect(() => {
        setPaisagem(Math.floor(Math.random() * 6) + 1);
    }, []);

    async function alterarDadosAluno() {
        try {
            await alterarDadosAlunoCon(aluno.map(item => item.id), nome, email, numero, nascimento)
            toast.dark("Dados alterados!")
            setCarddados(false)
            dadosAluno()
        } catch (error) {
            toast.dark("Voce não pode executar essa ação!")
        }
    }

    const navigate = useNavigate()
    function navegacao(para) {
        if (para == 1) {
            navigate(`/aluno/minhasala`)
        }
    }

    return (
        <section className='PageSize'>
            <BarraLateral page={"minhaconta"} />
            <StatusPage loading={loading} />

            {(alunoDados === "Loading" || alunoDados === "Nenhum aluno encontrado.") ? (
                <StatusCard className={"marginTop"} mensagem={alunoDados} reload={true}/> 
            ) : (
                <>
                {carddados &&
                <StatusPage>
                    <CardSections
                    buttons={[["Minhas informações", "/assets/images/icones/user.png"]]}
                    >
                        <button onClick={()=> setCarddados(false)} className='b cor3' data-category='Voltar'>
                            <img src={"/assets/images/icones/voltar.png"}/>
                        </button>
                        <div className='Desc' data-category='Minhas informações'>
                            <section className='DescCard autoH border cor2'>
                                <div className='linha cor3'></div>
                                <h4>A seção Minhas Informações permite que o aluno visualize e atualize seus dados pessoais, como nome, email, número de telefone e data de nascimento. Os alunos podem alterar essas informações preenchendo os campos apropriados e clicando em "Alterar dados" para salvar as mudanças. Essa funcionalidade garante que os alunos mantenham suas informações sempre atualizadas.</h4>
                            </section>
                        </div>
                        <input 
                            onChange={(e) => setNome(e.target.value)} 
                            value={nome}              
                            placeholder='Meu nome' 
                            className='cor2 border' 
                            data-category='Minhas informações'
                        />
                        <input 
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email}              
                            placeholder='Meu email' 
                            className='cor2 border' 
                            data-category='Minhas informações'
                        />
                        <input 
                            onChange={(e) => setNumero(e.target.value)} 
                            value={numero}              
                            placeholder='Meu número' 
                            className='cor2 border' 
                            data-category='Minhas informações'
                        />
                        <input 
                            onChange={(e) => setNascimento(e.target.value)} 
                            type='date'
                            value={nascimento}              
                            placeholder='Meu nascimento' 
                            className='cor2 border' 
                            data-category='Minhas informações'
                        />
                        <button className='b cem cor3' data-category='Minhas informações'>
                            {alunoDados.map(item => item.tipo)}
                        </button>
                        <button className='b cem cor3' data-category='Minhas informações'>
                            {alunoDados.map(item => item.status)}
                        </button>
                        <section className='SectionButtons default' data-category='Minhas informações'>
                            <button 
                            onClick={(
                                nome !== alunoDados.map(item => item.nome)[0] ||
                                email !== alunoDados.map(item => item.email)[0] ||
                                numero !== alunoDados.map(item => item.numero)[0] ||
                                nascimento !== alunoDados.map(item => {
                                const date = new Date(item.nascimento);
                                const day = String(date.getDate()).padStart(2, '0');
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const year = date.getFullYear();
                                return `${year}-${month}-${day}`;
                                })[0]
                            ) ? alterarDadosAluno : null}
                            className={`b cem ${(
                                nome !== alunoDados.map(item => item.nome)[0] ||
                                email !== alunoDados.map(item => item.email)[0] ||
                                numero !== alunoDados.map(item => item.numero)[0] ||
                                nascimento !== alunoDados.map(item => {
                                const date = new Date(item.nascimento);
                                const day = String(date.getDate()).padStart(2, '0');
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                const year = date.getFullYear();
                                return `${year}-${month}-${day}`;
                                })[0]
                            ) ? 'selecionado' : 'impossivel'}`}>
                            Alterar dados
                            </button>
                        </section>
                    </CardSections>
                </StatusPage>}

                <section className='InfoFundo marginTop cor1 border'>
                    {(alunoDados === "Loading" || alunoDados === "Nenhum aluno encontrado.") || alunoDados.map(item => item.imagem)
                    ? <img className='fundo' src={`/assets/images/paisagens/fundo${paisagem}.jpg`} />
                    : <>{alunoDados.map(item => <img className='fundo' key={item.id} src={BuscarImagem(item.imagemSala)} />)}</>}
                    <section className='Escuro'>
                        <section className='PerfilImage cor1'>
                            <section className='imgPerfilImage cor2 border'>
                                {(alunoDados === "Loading" || alunoDados === "Nenhum aluno encontrado")
                                    ? <img className='Load icon' src='/assets/images/icones/Loading.png' />
                                    : <img src={BuscarImagem(alunoDados.map(item => item.imagem))} />}
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
                        {(alunoDados === "Loading" || alunoDados === "Nenhum aluno encontrado.") ? (
                            <StatusCard mensagem={alunoDados} />
                        ) : (
                            <section className='Info InfoDados'>
                                <section className='Card CardDados min cor1 border'>
                                    <section className='Title  cor2'>
                                        <h3>{alunoDados.map(item => item.nome)}</h3>
                                    </section>
                                    <div className='Desc'>
                                        <section className='DescCard border cor2'>
                                            <div className='linha cor3'></div>
                                            <h4>Bem-vindo à Smart Lingu! Esta é a sua página de perfil, onde você pode acompanhar seu progresso no curso. Aqui, você encontrará uma visão detalhada do seu desempenho, incluindo as trilhas de aprendizado que você já completou e as atividades que você concluiu. Além disso, você poderá ver as lições que já foram respondidas e aquelas que ainda estão pendentes.</h4>
                                        </section>
                                        <button onClick={() => setCarddados(true)} className='b cor3 cem'> 
                                            <img src="/assets/images/icones/Avisos.png" />
                                            Ver mais
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
    )
}
