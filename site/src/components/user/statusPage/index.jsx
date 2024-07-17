import './index.scss'

export default function StatusPage({status, mensagem}) {
    function RecarregarPagina() {
        window.location.reload()
    }

    return (
        <>
        <main className="FundoEmbacado">
            
            {status == "Loading" &&
            <img className='icon Load' src="/assets/images/icones/Loading.png" />}

            <main className={`Card min cor1 border ${mensagem == null ? "in" : ""}visible`}>
                <section className='Title cor2'>
                    {mensagem != null &&
                    <h3 className="cor2">{mensagem.titulo}</h3>}
                </section>
                <section className='Desc'>
                    <section className={`DescCard border cor2`}>
                        <div className='linha'></div>
                        {mensagem != null &&
                        <h4>{mensagem.mensagem}</h4>}
                    </section>
                    <button onClick={RecarregarPagina} className='b cor3 cem'>
                        Recarregar página
                    </button>
                </section>
            </main>
        </main>
        </>
    )
}