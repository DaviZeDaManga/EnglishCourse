import './index.scss'

//components
import BarraLateral from '../../../components/web/barraLateral'
import Titulo from '../../../components/web/titulo'
import Cards from '../../../components/web/cards'

export default function MinhaSala() {
    return (
        <div className='MinhaSala'>
            <BarraLateral page={"minhasala"}/>
            <Titulo nome={"Minha Sala"}/>

            <section className='Info'>
                <section className='InfoCard cor1'>
                    <div className='Sala cor4'>
                        <img src='/assets/images/icones/minhasalaPE.png' />
                        <h3>Ingles A</h3>
                    </div>
                    <div className='Desc'>
                        <section className='DescCard cor2'>
                            <div className='linha cor3'></div>
                            <h4>Uma aventura de aprendizado para que possamos dominar a lingua. Passaremos pelo verbo to be, simple past, present continuos, entre outros.</h4>
                        </section>
                        <button className='cor3 border'> 
                            <img src='/assets/images/icones/pessoas.png' />
                            Pessoas
                        </button>
                    </div>
                </section>
                <section className='InfoFundo cor1'>
                    <img className='fundo' src='https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg' />
                </section>
            </section>

            <Cards
            conteudo={[["Trilhas", [1,1,1,1,1,1,1,1]], ["Avisos", [1,1,1]], ["Lives", [1]]]}
            />
        </div>
    )
}