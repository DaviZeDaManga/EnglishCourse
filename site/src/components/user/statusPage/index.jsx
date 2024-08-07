import './index.scss'
import { useEffect, useRef } from 'react'
import LoadingBar from 'react-top-loading-bar'

export default function StatusPage({loading, mensagem, children}) {
    function RecarregarPagina() {
        window.location.reload()
    }

    const ref = useRef()
    useEffect(()=> {
        if (loading == true) {
            ref.current.continuousStart()
        } else {
            ref.current.complete()
        }
    }, [loading])

    return (
        <>
        <LoadingBar color="#8A55CD" ref={ref} />

        {(loading == true || mensagem != null || children != null) &&
        <main className="FundoEmbacado">
            {mensagem != null &&
            <main className={`Card min cor1 border ${mensagem == null && "in"}visible`}>
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
            </main>}
            {children}
        </main>}
        </>
    )
}