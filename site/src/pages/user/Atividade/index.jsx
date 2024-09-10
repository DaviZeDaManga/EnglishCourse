import './index.scss';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import storage from 'local-storage';

// Conexões
import { dadosAtividadeAlunoCon, dadosAtividadesAlunoCon, dadosPalarvasAlunoCon, inserirFeitoConteudoCon } from '../../../connection/alunoConnection';
import { BuscarImagem } from '../../../connection/userConnection';

// Components
import BarraLateral from '../../../components/user/barraLateral';
import Titulo from '../../../components/user/titulo';
import StatusCard from '../../../components/user/statusCard';
import StatusPage from '../../../components/user/statusPage';

// Outros
import { toast } from 'react-toastify';
import CardSections from '../../../components/user/cardSections';

export default function Atividade() {
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

    console.log(atividades)

    const [atividade, setAtividade] = useState("Loading");
    const [assistir, setAssistir] = useState(false);

    async function dadosAtividade() {
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
            setLoading(true);
            try {
                await dadosAtividade();
            } catch (error) {
                console.error("Erro ao tentar carregar atividade:", error);
                toast.dark("Erro ao tentar carregar atividade.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [idatividade]);

    const [section, setSection] = useState(1);
    const [palavras, setPalavras] = useState("Loading");
    const [cardpalavra, setCardpalavra] = useState("");
    const [comentarios, setComentarios] = useState([]);

    async function dadosPalavras() {
        try {
            const resposta = await dadosPalarvasAlunoCon(aluno.map(item => item.id), idsala, idtrilha, idatividade);
            setPalavras(resposta);
        } catch (error) {
            console.error("Nenhuma palavra encontrada:", error);
            setPalavras("Nenhuma palavra encontrada.");
        }
    }

    async function dadosComentarios() {
        setComentarios("Essa função ainda não está disponível.");
    }

    useEffect(() => {
        async function fetchDataSection() {
            if (Array.isArray(atividade)) {
                switch (section) {
                    case 1:
                        await dadosPalavras();
                        break;
                    case 2:
                        await dadosComentarios();
                        break;
                    default:
                        break;
                }
            }
        }
        fetchDataSection();
    }, [section, atividade]);

    const refetchAtividades = useRef(null);

    async function inserirFeitoConteudo() {
        try {
            await inserirFeitoConteudoCon(aluno.map(item => item.id), idatividade);
            toast.dark('Partiu lições!');
            if (refetchAtividades.current) {
                await refetchAtividades.current();
            }
        } catch {
            toast.dark('Ocorreu um erro ao inserir feito do conteudo.');
        }
    }

    const videoRef = useRef(null); 
    function adjustVideoHeight() {
        if (videoRef.current) {
            const rect = videoRef.current.getBoundingClientRect();
            const distanceFromBottom = window.innerHeight - rect.bottom;
            
            if (distanceFromBottom <= 10) {
                videoRef.current.style.height = 'calc(100vh - 20px)';
            } else {
                videoRef.current.style.height = ''; 
            }
        }
    }

    useEffect(() => {
        window.addEventListener('resize', adjustVideoHeight);
        window.addEventListener('scroll', adjustVideoHeight);

        adjustVideoHeight(); 

        return () => {
            window.removeEventListener('resize', adjustVideoHeight);
            window.removeEventListener('scroll', adjustVideoHeight);
        };
    }, []);

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
        <div className='PageSize flex'>
            <BarraLateral page={"Assistir"} refetchAtividades={refetchAtividades} />
            <Titulo nome={"Atividade"} />
            <StatusPage loading={loading} />

            {(atividade === "Loading" || atividade === "Nenhuma atividade encontrada." || atividade.map(item => item.status) === "Não feita") ? (
                <StatusCard className={"marginTop"} mensagem={atividade} reload={true} />
            ) : (
                <>
                    {cardpalavra !== "" &&
                        <StatusPage>
                            <CardSections
                            buttons={[["Palavra", "/assets/images/icones/Avisos.png"]]}
                            >
                                <button onClick={()=> setCardpalavra("")} className='b cor3' data-category='Voltar'>
                                    <img src={"/assets/images/icones/voltar.png"}/>
                                </button>

                                <section className='Title cor2' data-category="Palavra">
                                    <h3 className="cor2">{cardpalavra.nome}</h3>
                                </section>
                                <div className='Desc' data-category='Palavra'>
                                    <section className='DescCard autoH border cor2' >
                                        <div className='linha cor3'></div>
                                        <h4>{cardpalavra.descricao}</h4>
                                    </section>
                                </div>
                            </CardSections>
                        </StatusPage>}

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
                                            <button onClick={()=> navegacao(1, item.id)} className='b cem transparente'>{item.nome}</button>
                                            </>
                                        )}  
                                    </section>
                                    <button onClick={()=> navegacao(2, item.id)} className='b cem transparente'>Lições - {item.nome}</button>
                                    </>)}
                                    </>
                                )}
                            </main>
                        </section>
                    </section>
                    <section className='PageSection'>
                        <main ref={videoRef} className='Video cor1 border marginTop'>
                            <section className='FundoVideo'>
                                {atividade.map(item =>
                                    <>
                                        {!assistir && <> <img className='fundo' src={BuscarImagem(item.imagem)} alt="Fundo" /> <section className='Escuro'></section> </>}
                                        {!assistir && item.video !== "Nenhum vídeo adicionado." && <img onClick={() => setAssistir(true)} className='meio icon' src="/assets/images/icones/LivesPE.png" alt="Play Icon" />}
                                        {assistir && <video onEnded={() => inserirFeitoConteudo()} controls={true}>  <source src={item.video} type="video/mp4" /></video>}
                                    </>
                                )}
                            </section>
                        </main>

                        <section className='SectionButtons'>
                            <button onClick={() => setSection(1)} className={`b nav cor3 ${section === 1 && "selecionado"}`}>
                                <img src={`/assets/images/icones/Avisos${section === 1 ? "PE" : ""}.png`} alt="Informações" />
                                Informações
                            </button>
                            <button onClick={() => setSection(2)} className={`b nav cor3 ${section === 2 && "selecionado"}`}>
                                <img src={`/assets/images/icones/comentario${section === 2 ? "PE" : ""}.png`} alt="Comentários" />
                                Comentários
                            </button>
                        </section>

                        <section className='Info'>
                            {section === 1 &&
                                <>
                                    <section className='Card cem cor1 border'>
                                        <section className='Title  cor2'>
                                            <h3>Descrição</h3>
                                        </section>
                                        <div className='Desc'>
                                            <section className='DescCard fix border cor2'>
                                                <div className='linha cor3'></div>
                                                {atividade.map(item => <h4 key={item.descricao}>{item.descricao}</h4>)}
                                            </section>
                                        </div>
                                    </section>

                                    <section className='Card cem cor1 border'>
                                        <section className='Title cor2'>
                                            <h3>Palavras</h3>
                                        </section>
                                        <div className='Desc'>
                                            <section className='DescCard fix border cor2'>
                                                <div className='linha cor3'></div>
                                                {(palavras === "Loading" || palavras === "Nenhuma palavra encontrada.") ? (
                                                    <h4>{palavras}</h4>
                                                ) : (
                                                    <>
                                                        {palavras.map(item => <button key={item.nome} onClick={() => setCardpalavra({ nome: item.nome, descricao: item.descricao })} className='b cor3 auto'>{item.nome}</button>)}
                                                    </>
                                                )}
                                            </section>
                                        </div>
                                    </section>
                                </>
                            }

                            {section === 2 &&
                                <>
                                    {(comentarios === "Loading" || comentarios === "Nenhum comentário encontrado." || comentarios === "Essa função ainda não está disponível.") ? (
                                        <StatusCard mensagem={comentarios} />
                                    ) : (
                                        <></>
                                    )}
                                </>}
                        </section>
                    </section>
                </>
            )}
        </div>
    );
}
