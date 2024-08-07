import './index.scss';
import { useEffect, useState } from 'react';
import storage from 'local-storage';

// conexoes
import { dadosMinhaSalaCon, dadosSalasAlunoCon, entrarSalaCon, pedirEntrarSalaCon, sairSalaCon } from '../../../connection/alunoConnection';
import { BuscarImagem } from '../../../connection/userConnection';

// components
import BarraLateral from '../../../components/user/barraLateral';
import Card from '../../../components/user/card';
import StatusCard from '../../../components/user/statusCard';
import StatusPage from '../../../components/user/statusPage';
import Titulo from '../../../components/user/titulo';

// outros
import { toast } from 'react-toastify';

export default function Salas() {
    const aluno = storage.get('aluno') || [];
    const [loading, setLoading] = useState(false);
    const [section, setSection] = useState(1);
    const [buttons, setButtons] = useState(false);
    const [joinByCode, setJoinByCode] = useState(false);
    const [codigo, setCodigo] = useState("");
    const [salas, setSalas] = useState("Loading");
    const [salasolicitada, setSalasolicitada] = useState([]);
    const [paisagem, setPaisagem] = useState(0);

    async function dadosSalas() {
        setSalas("Loading");
        try {
            const resposta = await dadosSalasAlunoCon(aluno.map(item => item.id));
            setSalas(resposta);
        } catch (error) {
            console.error('Erro ao buscar dados das salas:', error);
            setSalas("Nenhuma sala encontrada.");
        }
    }

    async function salaSolicitada() {
        if (salas !== "Loading" && salas !== "Nenhuma sala encontrada.") {
            const resposta = salas.filter(item => item.statusAluno === "Solicitado");
            setSalasolicitada(resposta);
        }
    }

    console.log(salas)

    useEffect(() => {
        async function fetchSectionData() {
            setLoading(true)
            try {
                await dadosSalas()
            } catch (error) {
                console.error("Erro ao buscar dados das salas:", error);
                toast.dark("Erro ao buscar dados das salas.")
            } finally {
                setLoading(false)
            }
        }
        fetchSectionData();
    }, []);

    useEffect(() => {
        setPaisagem(Math.floor(Math.random() * 6) + 1);
    }, []);




    async function entrarSala() {
        try {
            await entrarSalaCon(aluno.map(item => item.id), codigo);
            toast.dark("Seja bem-vindo(a)!");
        } catch (error) {
            console.error("Erro ao entrar na sala:", error);
            toast.dark("Erro ao entrar na sala.");
        }
    }

    async function sairSala() {
        try {
            await sairSalaCon(aluno.map(item => item.id));
            toast.dark("Você saiu da sala!");
            dadosSalas();
        } catch (error) {
            console.error("Erro ao sair da sala:", error);
            toast.dark("Erro ao sair da sala.");
        }
    }

    async function pedirEntrarSala(idsala) {
        try {
            await pedirEntrarSalaCon(aluno.map(item => item.id), idsala);
            toast.dark("Entrada solicitada!");
            dadosSalas();
        } catch {
            toast.dark("Algo deu errado.");
        }
    }

    return (
        <div className='PageSize'>
            <BarraLateral page={"salas"} />
            <StatusPage loading={loading} />

            {(salas === "Loading" || salas === "Nenhuma sala encontrada.") ? (
                <StatusCard className={"marginTop"} mensagem={salas} reload={true}/>
            ) : (
                <>
                    {joinByCode && (
                        <StatusPage>
                            <main className={`Card cor1 border visible normalPadding`}>
                                <section className='Title cor2'>
                                    <h3 className="cor2">Inserir código</h3>
                                </section>
                                <section className='Desc'>
                                    <section className={`DescCard border fix cor2`}>
                                        <div className='linha'></div>
                                        <h4>Olá, já contém o código da sala? Perfeito! Apenas insira e aperte em entrar! Vamos começar nossas aulas, sem perda de tempo. Como entrar na minha sala por código? Faça login em sua conta, pegue o código com seu professor, insira no campo abaixo e inicie seus estudos!</h4>
                                    </section>
                                </section>
                                <input onChange={(e) => setCodigo(e.target.value)} value={codigo} placeholder='Código da sala' className='cor2 border'></input>
                                <section className='SectionButtons default'>
                                    <button onClick={() => setJoinByCode(false)} className='b cem cor3'>Cancelar</button>
                                    <button onClick={() => entrarSala()} className='b cem cor3'>Participar</button>
                                </section>
                            </main>
                        </StatusPage>
                    )}

                    <section className='Info marginTop'>
                        <section className='InfoFundo border cor1'>
                            <img className='fundo' src={`/assets/images/paisagens/fundo${paisagem}.jpg`} />
                            <section className='Escuro'></section>
                        </section>
                    </section>

                    <section className='SectionButtons'>
                        <button onClick={() => setButtons(!buttons)} className='b min cor3'><img src={`/assets/images/icones/3pontos.png`} /></button>
                        {buttons && (
                            <section className='Buttons cor2 border'>
                                <h3>Outros</h3>
                                <section className='SectionItems cor3 autoH'>
                                    <button onClick={() => setJoinByCode(true)} className='b transparente cem'>
                                        Entrar com código
                                    </button>
                                </section>
                            </section>
                        )}
                        <button onClick={() => setSection(1)} className={`b nav cor3 ${section === 1 && "selecionado"}`}>
                            <img src={`/assets/images/icones/Salas${section === 1 ? "PE" : ""}.png`} />Salas disponíveis
                        </button>
                        <button onClick={() => setSection(2)} className={`b nav cor3 ${section === 2 && "selecionado"}`}>
                            <img src={`/assets/images/icones/Avisos${section === 2 ? "PE" : ""}.png`} />Solicitada
                        </button>
                        <button onClick={() => setSection(3)} className={`b nav cor3 ${section === 3 && "selecionado"}`}>
                            <img src={`/assets/images/icones/minhasala${section === 3 ? "PE" : ""}.png`} />Minha sala
                        </button>
                    </section>

                    <main className='SectionCards'>
                        {section === 1 && (
                            <>
                                {salas === "Loading" || salas === "Nenhuma sala encontrada." ? (
                                    <StatusCard mensagem={salas} />
                                ) : (
                                    <>
                                        {salas.map(item => (
                                            <Card
                                                key={item.id}
                                                estilo={3}
                                                id={item.id}
                                                name={item.nome}
                                                desc={item.descricao}
                                                img={item.imagem}
                                                video={item.video}
                                                acao={0}
                                                statusAluno={item.statusAluno}
                                                nomeProf={item.nomeProfessor}
                                                emailProf={item.emailProfessor}
                                                imgProf={item.imagemProfessor}
                                            >
                                                <button onClick={() => pedirEntrarSala(item.statusAluno !== "Solicitado" ? item.id : "Solicitado")} className='b cor3 cem'>
                                                    {item.statusAluno == "Solicitado" && "Solicitado"}
                                                    {item.statusAluno == "Ativo" && "Ativo"}
                                                    {(item.statusAluno != "Ativo" && item.statusAluno != "Solicitado") && "Pedir para entrar"}
                                                </button>
                                            </Card>
                                        ))}
                                    </>
                                )}
                            </>
                        )}

                        {section === 2 && (
                            <>
                                {salasolicitada.length === 0 ? (
                                    <StatusCard mensagem={"Nenhuma sala solicitada."} />
                                ) : (
                                    <>
                                        {salasolicitada.map(item => (
                                            <Card
                                                key={item.id}
                                                estilo={2}
                                                id={item.id}
                                                name={item.nome}
                                                desc={item.descricao}
                                                img={item.imagem}
                                                video={item.video}
                                                acao={0}
                                                statusAluno={item.statusAluno}
                                            >
                                                <button onClick={() => sairSala()} className='b cor3 cem'>
                                                    Cancelar
                                                </button>
                                            </Card>
                                        ))}
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
