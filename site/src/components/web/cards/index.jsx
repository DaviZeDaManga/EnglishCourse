import { useState } from 'react'
import './index.scss'

//components
import Card from '../card'

export default function Cards({conteudo}) {
    const [contSection, setContSection] = useState(conteudo[0])
    const [section, setSection] = useState(contSection[0])
    
    return (
        <>
            <section className='Cards'>
                <section className='Buttons'>
                    {conteudo.map( item =>
                        <button onClick={()=> (setSection(item[0]), setContSection(item))} className={`cor3 ${item[0] == section && "selecionado"}`}>
                            <img src={`/assets/images/icones/${item[0]}${item[0] == section ? "PE" : ""}.png`} />
                            {item[0]}
                        </button>
                    )}
                </section>
                <main className='Conteudo'>
                    {contSection[1].map( item =>
                        <Card/>
                    )}
                </main>
            </section>
        </>
    )
}