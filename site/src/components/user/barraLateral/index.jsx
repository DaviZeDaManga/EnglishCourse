import { useNavigate, useParams } from 'react-router-dom'
import './index.scss'
import { useEffect, useState, useRef } from 'react'
import storage from 'local-storage';
import React from 'react';

//conexoes
import { dadosAtividadesAlunoCon, dadosMinhaSalaCon, dadosTrilhaAlunoCon } from '../../../connection/alunoConnection';

//outros
import { toast } from 'react-toastify';
import LoadingBar from "react-top-loading-bar";
import StatusPage from '../statusPage';

export default function BarraLateral({page}) {
    const aluno = storage.get('aluno') || [];
    const {idsala, idtrilha, idatividade} = useParams()
    const [sala, setSala] = useState("Loading")
    const [trilha, setTrilha] = useState("Loading")
    const [cardativ, setCardativ] = useState("-100%")
    const [atividades, setAtividades] = useState("Loading")

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
            try {
                await dadosMinhaSala();
            } catch (error) {
                console.error('Erro ao carregar dados da minha sala:', error);
                toast.dark("Erro ao carregar dados da minha sala.");
            } 
        }
        fetchData();
    }, []);

    async function dadosTrilha() {
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
    }, [idsala, idtrilha, idatividade]);

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




    const navigate = useNavigate()
    const ref = useRef()

    function navegacao(para, id, outro) {
        ref.current.continuousStart()

        try {
            if (para == 0) {
                toast.dark("Você não pode acessar isso.")
            }
            if (para == 1) {
                navigate(`/aluno/minhasala/${idsala}/trilha/${idtrilha}/atividade/${id}${outro != null && "/" + outro}`)
            }
            if (para == 2) {
                navigate(`/aluno/minhasala`)
            }
            if (para == 3) {
                navigate(`/aluno/minhaconta`)
            }
            if (para == 4) {
                navigate(`/aluno/minhasala/${idsala}/trilha/${id}`)
            }
            if (para == 5) {
                navigate(`/aluno/salas`)
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
        <>
            <LoadingBar color="#8A55CD" ref={ref} />
            {cardativ != "-100%" &&
            <StatusPage/>}
            
            <section className='BarraLateral border cor1'>
                <div className='ButtonSections cor4'>
                    <button onClick={()=> navegacao(3)} className={`b cor3 cem ${page == "minhaconta" && "selecionado"}`}> 
                        <img src={`/assets/images/icones/user${page === "minhaconta" ? "PE" : ""}.png`} />
                        Conta 
                    </button>
                </div>

                <div className='ButtonSections cor4'>
                    <button onClick={()=> navegacao(5)} className={`b cem cor3 ${page == "salas" && "selecionado"}`}> 
                        <img src={`/assets/images/icones/salas${page === "salas" ? "PE" : ""}.png`} />
                        Salas
                    </button>
                </div>

                {(sala != "Loading" && sala != "Nenhuma sala encontrada.") &&
                <div className='ButtonSections cor4'>
                    <button onClick={()=> navegacao(2)} className={`b cem cor3 ${page == "minhasala" && "selecionado"}`}> 
                        <img src={`/assets/images/icones/minhasala${page === "minhasala" ? "PE" : ""}.png`} />
                        Minha Sala 
                    </button>
                </div>}

                {(page === "Trilha" || page === "Assistir" || page === "Lições") &&
                <div className='ButtonSections cor4'>
                    {(trilha === "Loading" || trilha === "Nenhuma trilha encontrada.") ? (
                        <button className={`b cem cor3 ${(page === "Trilha" || page === "Assistir" || page === "Lições") && "selecionado"}`}> 
                            <img src={`/assets/images/icones/TrilhasPE.png`} />
                            {trilha}
                        </button>  
                    ) : (
                        <button onClick={()=> navegacao(4, trilha.map(item=> item.id))} className={`b cem cor3 ${(page === "Trilha" || page === "Assistir" || page === "Lições") && "selecionado"}`}> 
                            <img src={`/assets/images/icones/TrilhasPE.png`} />
                            {trilha.map( item=> item.nome)}
                        </button>  
                    )}
                </div>
                }

                {(page === "Trilha" || page === "Assistir" || page === "Lições") &&
                <section className='Atividades cor4'>
                    <section style={{ left: cardativ}} className='CardAtividades cor3 selecionado'>
                        {(atividades === "Loading" || atividades == "Parece que não tem nada aqui.") ? (
                            <button className='b selecionado cem'>{atividades}</button>
                        ) : <>
                        {atividades.map((item, index) => (
                            <React.Fragment key={item.id}>
                                <button 
                                    onClick={() => navegacao(
                                        ((item.status === "Fazendo" || item.status === "Feito") ? 1 : 0), 
                                        item.id, 
                                        ((item.conteudo == false || (item.conteudo == true && item.licoes == true)) ? "assistir" : "lições")
                                    )} 
                                    className={`b cem ${idatividade == item.id ? "selecionado" : "mostrando"}`}
                                > 
                                    <h3>{(index + 1).toString().padStart(2, '0')}</h3>
                                    {item.nome}
                                    {idatividade != item.id && 
                                        <div className={`bolinha ${(item.conteudo == true && item.licoes == true) && "preenchido"}`}></div>
                                    }
                                </button>
                                {idatividade == item.id && (
                                    <section className='AtividadeButtons cor4'>
                                        <section className='Atividades'>
                                            {item.status === "Não feita" ? (
                                                <button className='b cem mostrando'>Você não pode acessar isso.</button> 
                                            ) : (
                                                <>
                                                    <button 
                                                        onClick={() => navegacao(1, item.id, "assistir")} 
                                                        className={`b cem mostrando ${page == "Assistir" && "ContLight"}`}
                                                    > 
                                                        <img src={`/assets/images/icones/LivesPE.png`} alt="Assistir vídeo" />
                                                        Assistir
                                                        <h4>{item.conteudo == true ? "Concluído" : "Fazendo"}</h4>
                                                    </button>
                                                    <button 
                                                        onClick={() => navegacao((item.conteudo == true ? 1 : 0), item.id, "lições")} 
                                                        className={`b cem mostrando ${page == "Lições" && "ContLight"}`}
                                                    > 
                                                        <img src={`/assets/images/icones/atividadesPE.png`} alt="Fazer lições" />
                                                        Lições
                                                        {item.conteudo == true && (
                                                            <h4>{item.licoes == true ? "Concluído" : "Fazendo"}</h4>
                                                        )}
                                                    </button>
                                                </>
                                            )}
                                        </section>
                                    </section>
                                )}
                            </React.Fragment>
                        ))}
                        </>}
                    </section>
                    <button onClick={()=> setCardativ(cardativ === "-100%" ? "6px" : "-100%")} className='b cem mostrando MostrarAtividades'>
                        <h3>{cardativ === "-100%" ? "Mostrar atividades" : "Ocultar atividades"}</h3>
                    </button>   
                </section>}
            </section>
        </>
    )
}