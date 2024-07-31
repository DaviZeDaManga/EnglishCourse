import './index.scss'

export default function Titulo({nome, voltar}) {
    function voltarPage() {
        window.history.back()
    }

    return (
        <>
            {/* <div className='Titulo cor1'>
                {voltar != false &&
                <button onClick={voltarPage} className='b cor2'> <img src='/assets/images/icones/voltar.png'/> </button>}
                <section className='NomeTitulo cor2 border'>
                    <h3>{nome}</h3>
                </section>
            </div> */}
        </>
    )
}