import './index.scss'

//components
import BarraLateral from '../../../components/web/barraLateral'
import Titulo from '../../../components/web/titulo'

export default function MinhaSala() {
    return (
        <div className='MinhaSala'>
            <BarraLateral/>
            <Titulo nome={"Minha Sala"}/>

            <section className='Info'>
                <section className='InfoCard cor2'>
                    <div className='Sala cor4'>
                        <img src='/assets/images/icones/chapeuPE.png' />
                        <h3>Info A</h3>
                    </div>
                </section>
                <section className='InfoFundo cor2'>
                    
                </section>
            </section>
        </div>
    )
}