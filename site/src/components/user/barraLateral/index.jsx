import { useNavigate, useParams } from 'react-router-dom'
import './index.scss'
import { useEffect, useState, useRef } from 'react'
import storage from 'local-storage';
import React from 'react';

//conexoes
import { dadosAtividadesAlunoCon, dadosMinhaSalaCon, dadosTrilhaAlunoCon } from '../../../connection/alunoConnection';

//outros
import { toast } from 'react-toastify';
import StatusPage from '../statusPage';

export default function BarraLateral({page, refetchMinhaSala}) {
    const aluno = storage.get('aluno') || [];
    const {idsala, idtrilha, idatividade} = useParams()
    const [sala, setSala] = useState("Loading")
    const [trilha, setTrilha] = useState("Loading")
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

    useEffect(()=> {
        if (refetchMinhaSala) {
            refetchMinhaSala.current = dadosMinhaSala
        }
    }, [refetchMinhaSala])

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





    const navigate = useNavigate()
    const ref = useRef()

    function navegacao(para, id, outro) {
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

    return ( 
        <>       
            <section className={`BarraLateral border cor1`}>

                <div className='ButtonSections cor4'>
                    <button onClick={()=> navegacao(3)} className={`b cor3 cem ${page == "minhaconta" && "selecionado"}`}> 
                        <img src={`/assets/images/icones/user${page === "minhaconta" ? "PE" : ""}.png`} />
                    </button>
                </div>

                <div className='ButtonSections cor4'>
                    <button onClick={()=> navegacao(5)} className={`b cem cor3 ${page == "salas" && "selecionado"}`}> 
                        <img src={`/assets/images/icones/salas${page === "salas" ? "PE" : ""}.png`} />
                    </button>
                </div>

                {(sala != "Loading" && sala != "Nenhuma sala encontrada.") &&
                <div className='ButtonSections cor4'>
                    <button onClick={()=> navegacao(2)} className={`b cem cor3 ${page == "minhasala" && "selecionado"}`}> 
                        <img src={`/assets/images/icones/minhasala${page === "minhasala" ? "PE" : ""}.png`} />
                    </button>
                </div>}

                {(page === "Trilha" || page === "Assistir" || page === "Lições") &&
                <div className='ButtonSections cor4'>
                    {(trilha === "Loading" || trilha === "Nenhuma trilha encontrada.") ? (
                        <button className={`b cem cor3 ${(page === "Trilha" || page === "Assistir" || page === "Lições") && "selecionado"}`}> 
                            <img src={`/assets/images/icones/TrilhasPE.png`} />
                        </button>  
                    ) : (
                        <button onClick={()=> navegacao(4, trilha.map(item=> item.id))} className={`b cem cor3 ${(page === "Trilha" || page === "Assistir" || page === "Lições") && "selecionado"}`}> 
                            <img src={`/assets/images/icones/TrilhasPE.png`} />
                        </button>  
                    )}
                </div>
                }
            </section>
        </>
    )
}