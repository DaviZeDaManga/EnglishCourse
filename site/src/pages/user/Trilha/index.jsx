import './index.scss'
import { useState } from 'react'

//components
import BarraLateral from '../../../components/web/barraLateral'
import Titulo from '../../../components/web/titulo'

export default function Trilha() {
    const [section, setSection] = useState(1)

    return(
        <div className='Trilha'>
            <BarraLateral page={"Trilha"}/>
            <Titulo nome={"Trilha"}/>

            <main className='Video cor1 border'>
                <section className='FundoVideo cor2'>

                </section>
            </main>

            <section className='SectionsTrilha'>
                <button onClick={()=> setSection(1)} className={`cor3 ${section == 1 && "selecionado"}`}> 
                    <img src={`/assets/images/icones/Avisos${section == 1 ? "PE" : ""}.png`} />
                    Informações
                </button>
                <button onClick={()=> setSection(2)} className={`cor3 ${section == 2 && "selecionado"}`}> 
                    <img src={`/assets/images/icones/download.png`} />
                    Conteúdos
                </button>
            </section>

            {section == 1 &&
            <section className='Info'>
                <section className='CardInfo cor1 border'>
                    <section className='Title cor2'>
                        <h3>Descrição</h3>
                    </section>
                    <section className='Desc cor2'>
                        <div className='linha'></div>
                        <h4>Hoje, iremos nos aprofundar no uso do verbo "to be" para fazer perguntas em inglês. Este é um aspecto fundamental da gramática e essencial para a comunicação eficaz. Vamos aprender sobre os verbos "am," "are," e "is" e como usá-los corretamente nas perguntas. Aliás, how are you? Primeiramente, o verbo "to be" é extremamente versátil e é utilizado em diversas formas de comunicação. Quando queremos formular perguntas, usamos "am," "are," e "is" de acordo com o sujeito da frase.</h4>
                    </section>
                    <button className='cor3'>
                        Ver mais
                    </button>
                </section>

                <section className='CardInfo cor1 border'>
                    <section className='Title cor2'>
                        <h3>Palavras novas</h3>
                    </section>
                    <section className='Desc cor2'>
                        <div className='linha'></div>
                        <button className='cor3'>
                            How
                            <div className='ExplicacaoPalavra cor3 border'>

                            </div>
                        </button>                      
                    </section>
                </section>
            </section>}

            {section == 2 &&
            <section className='Info'>
                <section className='CardInfo cor1 border'>
                    <section className='Title cor2'>
                        <h3>Conteudos adicionais</h3>
                    </section>
                    <section className='Desc cor2'>
                        <div className='linha'></div>
                        
                    </section>
                </section>
            </section>}

            <main className='Controle'>
                <section className='AtividadeControle cor1 border'>
                    <button className='cor3'> <img src='/assets/images/icones/voltar.png'/> </button>
                </section>
                <section className='AtividadeEscolha cor1 border'>

                </section>
                <section className='AtividadeControle cor1 border'>
                    <button className='cor3 deg180'> <img src='/assets/images/icones/voltar.png'/> </button>
                </section>
            </main>
        </div>
    )
}