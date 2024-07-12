import './index.scss'
import { useState } from 'react'

//components
import BarraLateral from '../../../components/web/barraLateral'
import Titulo from '../../../components/web/titulo'
import Card from '../../../components/web/card'

export default function MinhaSala() {
    const [section, setSection] = useState(1)

    return (
        <div className='MinhaSala'>
            <BarraLateral page={"minhasala"}/>
            <Titulo nome={"Minha Sala"}/>

            <section className='Info'>
                <section className='Card min cor1 border'>
                    <section className='Title border cor2'>
                        <h3>Ingles A</h3>
                    </section>
                    <div className='Desc'>
                        <section className='DescCard border cor2'>
                            <div className='linha cor3'></div>
                            <h4>Uma aventura de aprendizado para que possamos dominar a lingua. Passaremos pelo verbo to be, simple past, present continuos, entre outros.</h4>
                        </section>
                        <button className='b cor3'> 
                            <img src='/assets/images/icones/pessoas.png' />
                            Pessoas
                        </button>
                    </div>
                </section>
                <section className='InfoFundo border cor1'>
                    <img className='fundo' src='https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg' />
                </section>
            </section>

            <section className='SectionButtons'>
                <button onClick={()=> setSection(1)} className={`b cor3 ${section == 1 && "selecionado"}`}> <img src={`/assets/images/icones/Trilhas${section == 1 ? "PE" : ""}.png`}/> Trilhas</button>
                <button onClick={()=> setSection(2)} className={`b cor3 ${section == 2 && "selecionado"}`}> <img src={`/assets/images/icones/Avisos${section == 2 ? "PE" : ""}.png`}/> Avisos</button>
                <button onClick={()=> setSection(3)} className={`b cor3 ${section == 3 && "selecionado"}`}> <img src={`/assets/images/icones/Lives${section == 3 ? "PE" : ""}.png`}/> Transmissões</button>
            </section>

            <main className='SectionCards'>
                <Card
                name={"Ambientação"}
                desc={"Nessa trilha voce vai entender melhor sobre o curso de Ingles e quais sao os passos para se tornar fluente na lingua! Ensinaremos como funciona a plataforma, entrega, nota, certificado, etc. Venha com a gente para essa aventura na lingua, estou te esperando!"}
                />
            </main>
        </div>
    )
}