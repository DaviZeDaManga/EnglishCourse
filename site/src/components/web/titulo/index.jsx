import './index.scss'

export default function Titulo({nome}) {
    return (
        <>
            <div className='Titulo'>
                <button className='cor3 border'> <img src='/assets/images/icones/voltar.png'/> </button>
                <section className='PageTitulo cor3 border'>
                    <h3>{nome}</h3>
                </section>
            </div>
        </>
    )
}