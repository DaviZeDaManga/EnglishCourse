import './index.scss'

export default function ErrorCard({mensagem}) {
    return (
        <>
        <main className='errorCard cor1 border'>
            <section className={`DescCard h100 border cor2`}>
                <div className='linha'></div>
                {mensagem == "Loading"
                ? <img className='Load icon' src='/assets/images/icones/Loading.png' />
                : <h4>{mensagem}</h4>}
            </section>
        </main>
        </>
    )
}