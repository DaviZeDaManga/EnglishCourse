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
                        <button onClick={()=> (setSection(item[0]), setContSection(item))} className={`cor3 border ${item[0] == section && "selecionado"}`}>
                            <img src={`/assets/images/icones/${item[0]}${item[0] == section ? "PE" : ""}.png`} />
                            {item[0]}
                        </button>
                    )}
                </section>
                <main className='Conteudo'>
                    {/* {contSection[1].map( item =>
                        <Card/>
                    )} */}
                    {section == "Trilhas" &&
                    <>
                    <Card
                    name={"Ambientacao"}
                    desc={"Nessa trilha voce vai entender melhor sobre o curso de Ingles e quais sao os passos para se tornar fluente na lingua! Ensinaremos como funciona a plataforma, entrega, nota, certificado, etc. Venha com a gente para essa aventura na lingua, estou te esperando!"}
                    link={"https://www.youtube.com/watch?v=MGFMEQMXQSU"}
                    />

                    <Card
                    name={"Trilha 1 - Primeiros passos"}
                    desc={"Agora voce ja sabe como funciona a plataforma, entao, esta na hora de iniciar seu exercicios para se tornar expert na lingua. Vamos debater sobre o verbo to be entre outras coisas."}
                    link={"https://www.youtube.com/watch?v=MGFMEQMXQSU"}
                    />

                    <Card
                    name={"Trilha 2 - No ritmo certo"}
                    desc={"Voce ta indo bem, é como se isso tudo fosse uma dança, e seus passos são magnificos! Porem, ainda existem muitos passos a fazer e descobrir nesse caminho, que tal irmos em busca de passos de danca extremos? Bora!"}
                    link={"https://www.youtube.com/watch?v=MGFMEQMXQSU"}
                    />
                    </>
                    } 

                    {section == "Avisos" &&
                    <>
                    <Card
                    name={"Sejam todos bem-vindos!"}
                    img={"https://i.pinimg.com/736x/8a/ed/07/8aed075b2259a6f2bace5c4924ceb0a3.jpg"}
                    />

                    <Card
                    name={"Haverá um grupo no zap a partir de agora!"}
                    desc={"Caros alunos, por demanda da maioria, será criado um grupo no zap para que todos possam entrar e conversar sobre as atividades, mandem o numero de voces no privado para eu adiciona-los. Boa tarde."}
                    />

                    <Card
                    name={"Boas Férias!"}
                    desc={"Oi alunos, até agora foi bem puxado, vcs aprenderam bastante coisa e estou grato por isso, mas agora é momento de descansar, aproveitem as ferias! e sempre estuddem um pouquinho pra n perder a manha ne. Mas é isso, depois voltamos com tudo, tchauu!"}
                    link={"https://www.youtube.com/watch?v=MGFMEQMXQSU"}
                    />

                    <Card
                    name={"Aviso"}
                    desc={"Gente, tem alguns alunos que n enviaram algumas tarefas, bora bora bora, qualquer coisa me manda msg.!"}
                    link={"https://www.youtube.com/watch?v=MGFMEQMXQSU"}
                    />

                    <Card
                    name={"Quem ta afim de competir pra ver quem ganha essa via..."}
                    img={"https://c4.wallpaperflare.com/wallpaper/967/1010/443/paisagem-wallpaper-preview.jpg"}
                    />
                    </>
                    } 

                    {section == "Lives" &&
                    <>
                    <Card
                    name={"Sejam todos bem-vindos!"}
                    img={"https://i.pinimg.com/736x/8a/ed/07/8aed075b2259a6f2bace5c4924ceb0a3.jpg"}
                    />

                    <Card
                    name={"Quem ta afim de competir pra ver quem ganha essa via..."}
                    img={"https://c4.wallpaperflare.com/wallpaper/967/1010/443/paisagem-wallpaper-preview.jpg"}
                    />
                    </>
                    } 
                </main>
            </section>
        </>
    )
}