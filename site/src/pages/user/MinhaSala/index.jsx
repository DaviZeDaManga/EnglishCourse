import './index.scss';
import { useEffect, useState } from 'react';
import storage from 'local-storage';

// conexoes
import { dadosAvisosAlunoCon, dadosMinhaSalaCon, dadosTransmissoesAlunoCon, dadosTrilhasAlunoCon } from '../../../connection/alunoConnection';
import { BuscarImagem } from '../../../connection/userConnection';

// components
import BarraLateral from '../../../components/user/barraLateral';
import Card from '../../../components/user/card';
import StatusCard from '../../../components/user/statusCard';
import StatusPage from '../../../components/user/statusPage';
import Titulo from '../../../components/user/titulo';

// outros
import { toast } from 'react-toastify';
import CardSections from '../../../components/user/cardSections';

export default function MinhaSala() {
    const aluno = storage.get('aluno') || [];
    const [loading, setLoading] = useState(true);
    const [sala, setSala] = useState("Loading");
    const [cardpessoas, setCardpessoas] = useState(false);

    async function dadosMinhaSala() {
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
            setLoading(true);
            try {
                await dadosMinhaSala();
            } catch (error) {
                console.error('Erro ao carregar dados da minha sala:', error);
                toast.dark("Erro ao carregar dados da minha sala.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const [section, setSection] = useState(1);
    const [trilhas, setTrilhas] = useState("Loading");
    const [avisos, setAvisos] = useState("Loading");
    const [transmissoes, setTransmissoes] = useState("Loading");

    async function dadosTrilhas() {
        try {
            const resposta = await dadosTrilhasAlunoCon(aluno.map(item => item.id), sala.map(item => item.sala.id));
            setTrilhas(resposta);
        } catch (error) {
            console.error('Erro ao buscar dados das trilhas:', error);
            setTrilhas("Parece que não tem nada aqui.");
        }
    }

    async function dadosAvisos() {
        try {
            const resposta = await dadosAvisosAlunoCon(aluno.map(item => item.id), sala.map(item => item.sala.id));
            setAvisos(resposta);
        } catch (error) {
            console.error('Erro ao buscar dados dos avisos:', error);
            setAvisos("Parece que não tem nada aqui.");
        }
    }

    async function dadosTransmissoes() {
        try {
            const resposta = await dadosTransmissoesAlunoCon(aluno.map(item => item.id), sala.map(item => item.sala.id));
            setTransmissoes(resposta);
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
    }, [section, sala]);

    return (
        <div className='PageSize'>
            <BarraLateral page={"minhasala"} />
            <StatusPage loading={loading} />
    
            {(sala === "Nenhuma sala encontrada." || sala === "Loading") ? (
                <StatusCard className={"marginTop"} mensagem={sala} reload={true} />
            ) : (
                <>
                {cardpessoas && (
                    <StatusPage>
                        <CardSections
                        buttons={[["Sobre", "/assets/images/icones/Avisos.png"], ["Pessoas", "/assets/images/icones/pessoas.png"]]}
                        >
                            <button onClick={()=> setCardpessoas(false)} className='b cor3' data-category='Voltar'>
                                <img src={"/assets/images/icones/voltar.png"}/>
                            </button>

                            <div className='Desc' data-category='Sobre'>
                                <section className='DescCard autoH border cor2'>
                                    <div className='linha cor3'></div>
                                    {sala.map(item => <h4>{item.sala.descricao}</h4>)}
                                </section>
                            </div>

                            <div className='Desc' data-category='Pessoas'>
                                <section className='DescCard autoH border cor2' >
                                    <div className='linha cor3'></div>
                                    <h4>Nesta seção, você poderá visualizar todos os alunos que fazem parte da sua sala, junto com o nome e os detalhes do professor responsável. Isso permite que você tenha uma visão clara de quem está participando da mesma turma, facilitando a interação e o acompanhamento das atividades em grupo. Além disso, ao conhecer o professor responsável pela sala, você saberá a quem recorrer em caso de dúvidas ou para solicitar orientações.</h4>
                                </section>
                            </div>
                            <h3 data-category="Pessoas">Professor</h3>
                            <section className='CardPerfil cor2 border' data-category="Pessoas">
                                <section className='CardPerfilImg cor3'>
                                    {sala.map(item => (
                                        <img className='fundo' src={BuscarImagem(item.sala.imagemProfessor)} alt="imagem de fundo" />
                                    ))}
                                    <section className='Escuro'></section>
                                </section>
                                <section className='CardPerfilCont'>
                                    {sala.map(item => <h3>{item.sala.nomeProfessor}</h3>)}
                                    {sala.map(item => <h4>{item.sala.emailProfessor}</h4>)}
                                </section>
                            </section>

                            <h3 data-category="Pessoas">Alunos</h3>
                            {sala[0].alunos.map(item => (
                                <section className='CardPerfil cor2 border' data-category="Pessoas">
                                    <section className='CardPerfilImg cor3'>
                                        <img className='fundo' src={BuscarImagem(item.imagem)} alt="imagem de fundo" />
                                        <section className='Escuro'></section>
                                    </section>
                                    <section className='CardPerfilCont'>
                                        <h3>{item.nome}</h3>
                                        <h4>{item.tipo}</h4>
                                    </section>
                                </section>
                            ))}
                        </CardSections>
                    </StatusPage>
                )}

                <section className='Info marginTop'>
                    <section className='Card min cor1 border'>
                        <section className='Title cor2'>
                            {sala.map(item => <h3>{item.sala.nome}</h3>)}
                        </section>
                        <div className='Desc'>
                            <section className='DescCard border cor2'>
                                <div className='linha cor3'></div>
                                {sala.map(item => <h4>{item.sala.descricao}</h4>)}
                            </section>
                            <button onClick={() => setCardpessoas(true)} className='b cor3 cem'>
                                <img src="/assets/images/icones/Avisos.png" />
                                Ver mais
                            </button>
                        </div>
                    </section>
                    <section className='InfoFundo border cor1'>
                        {sala.map(item => (
                            <img className='fundo' src={BuscarImagem(item.sala.imagem)} alt="imagem de fundo" />
                        ))}
                        <section className='Escuro'>
                            <h3>{sala.map(item => item.sala.nome)}</h3>
                            <button onClick={() => setCardpessoas(true)} className='b cor3 border min'>
                                <img src="/assets/images/icones/Avisos.png" />
                            </button>
                        </section>
                    </section>
                </section>
            
                <section className='SectionButtons'>
                    <button onClick={() => setSection(1)} className={`b nav cor3 ${section === 1 && "selecionado"}`}>
                        <img src={`/assets/images/icones/Trilhas${section === 1 ? "PE" : ""}.png`} />Trilhas
                    </button>
                    <button onClick={() => setSection(2)} className={`b nav cor3 ${section === 2 && "selecionado"}`}>
                        <img src={`/assets/images/icones/Avisos${section === 2 ? "PE" : ""}.png`} />Avisos
                    </button>
                    <button onClick={() => setSection(3)} className={`b nav cor3 ${section === 3 && "selecionado"}`}>
                        <img src={`/assets/images/icones/Lives${section === 3 ? "PE" : ""}.png`} />Transmissões
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
                                    idSala={sala.map(item => item.sala.id)}
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
        </div>
    );
}
