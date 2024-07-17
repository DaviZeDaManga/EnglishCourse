import './index.scss'

export default function ErrorCard({mensagem, margin}) {
    return (
        <>
        <main className={`errorCard cor1 border2 ${margin == "top" && "marginTop"}`}>
            {mensagem == "Loading"
            ? <img className='Load icon' src='/assets/images/icones/Loading.png' />
            : <h4>{mensagem}</h4>}
        </main>
        </>
    )
}