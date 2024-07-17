import './index.scss'

export default function Titulo({nome, voltar}) {
    function voltarPage() {
        window.history.back()
    }

    return (
        <>
            <div className='Titulo'>
                <button onClick={voltarPage} className='b cor3'> <img src='/assets/images/icones/voltar.png'/> </button>
                <section className='NomeTitulo cor3'>
                    <h3>{nome}</h3>
                </section>
            </div>
        </>
    )
}