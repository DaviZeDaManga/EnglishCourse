import './index.scss'

export default function BarraLateral() {
    return ( 
        <>
            <section className='BarraLateral cor1'>
                <button className='cor3'> 
                    <img src='/assets/images/icones/casa.png' />
                    Inicio 
                </button>
                <button className='cor3'> 
                    <img src='/assets/images/icones/calendario.png' />
                    Calendário 
                </button>
                <button className='cor3'> 
                    <img src='/assets/images/icones/chapeu.png' />
                    Minha Sala 
                </button>
            </section>
        </>
    )
}