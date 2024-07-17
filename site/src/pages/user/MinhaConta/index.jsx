import './index.scss';
import { useEffect, useState } from 'react';
import storage from 'local-storage';

// components
import BarraLateral from '../../../components/user/barraLateral';
import Titulo from '../../../components/user/titulo';
import ErrorCard from '../../../components/user/error';
import StatusPage from '../../../components/user/statusPage'; 

// outros
import { BuscarImagem, dadosAlunoCon } from '../../../connection/alunoConnection';

export default function MinhaConta() {
    const aluno = storage.get('aluno');
    const [alunoDados, setAlunoDados] = useState([]);
    const [nome, setNome] = useState("");
    const [imagem, setImagem] = useState();
    const [paisagem, setPaisagem] = useState(Math.floor(Math.random() * 6) + 1);
    const [section, setSection] = useState(1);
    const [loading, setLoading] = useState(true); 

    async function AlunoDados() {
        setAlunoDados("Loading");
        try {
            let resposta = await dadosAlunoCon(aluno.map(item => item.id));
            setAlunoDados(resposta);
            setLoading(false); 
        }
        catch {
            setAlunoDados("Nenhum aluno encontrado.");
            setLoading(false);
        }
    }

    useEffect(() => {
        async function load() {
            await AlunoDados();
        }
        load();
    }, []);

    useEffect(() => {
        setPaisagem(Math.floor(Math.random() * 6) + 1);
    }, []);

    return (
        <section className='MinhaConta'>
            <BarraLateral page={"minhaconta"} />
            <Titulo margin={"left"} nome={"Minha conta"} />

            {loading ? (
                <StatusPage status={"Carregando"} /> 
            ) : (
                <>
                <section className='FundoConta marginTop cor1 border'>
                    {(alunoDados == "Loading" || alunoDados == "Nenhum aluno encontrado.") || alunoDados.map(item => item.imagem)
                        ? <img className='fundo' src={`/assets/images/paisagens/fundo${paisagem}.jpg`} />
                        : <>{alunoDados.map(item => <img className='fundo' key={item.id} src={BuscarImagem(item.imagemSala)} />)}</>}
                </section>

                <section className='SectionButtons'>
                    <section className='PerfilImage cor1 border'>
                        <section className='imgPerfilImage cor2 border'>
                            {(alunoDados === "Loading" || alunoDados == "Nenhum aluno encontrado")
                                ? <img className='Load icon' src='/assets/images/icones/Loading.png' />
                                : <img src={BuscarImagem(alunoDados.map(item => item.imagem))} />}
                        </section>
                    </section>
                    <button onClick={() => setSection(1)} className={`b cor3 ${section == 1 && "selecionado"}`}>
                        <img src={`/assets/images/icones/Avisos${section == 1 ? "PE" : ""}.png`} />Dados
                    </button>
                    <button onClick={() => setSection(2)} className={`b cor3 ${section == 2 && "selecionado"}`}>
                        <img src={`/assets/images/icones/Trilhas${section == 2 ? "PE" : ""}.png`} />Meu rendimento
                    </button>
                </section>
                <section className='SectionCards'>
                    {section == 1 &&
                        <ErrorCard mensagem={"Essa função ainda não está disponível."} />
                    }

                    {section == 2 &&
                        <ErrorCard mensagem={"Essa função ainda não está disponível."} />}
                </section>
                </>
            )}
        </section>
    );
}
