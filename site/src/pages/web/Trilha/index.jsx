import './index.scss'
import { useState } from 'react'

//components
import BarraLateral from '../../../components/web/barraLateral'
import Titulo from '../../../components/web/titulo'

export default function Trilha() {
    const [section, setSection] = useState(1)

    return(
        <div className='Trilha'>
            <BarraLateral/>
            <Titulo nome={"Trilha"}/>

            <main className='Video cor1'>

            </main>

            <section className='SectionsTrilha'>
                <button onClick={()=> setSection(1)} className={`cor3 ${section == 1 && "selecionado"}`}> 
                    <img src={`/assets/images/icones/Lives${section == 1 ? "PE" : ""}.png`} />
                    Informações
                </button>
                <button onClick={()=> setSection(2)} className={`cor3 ${section == 2 && "selecionado"}`}> 
                    <img src={`/assets/images/icones/atividades${section == 2 ? "PE" : ""}.png`} />
                    Lições
                </button>
            </section>
        </div>
    )
}