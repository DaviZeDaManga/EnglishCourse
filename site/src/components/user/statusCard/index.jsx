import './index.scss'

export default function StatusCard({mensagem, children}) {
    return (
        <>
        <main className={`StatusCard cor1 border2`}>
            {mensagem == "Loading"
            ? <img className='Load icon' src='/assets/images/icones/Loading.png' />
            : <h4>{mensagem}</h4>}
            {children}
        </main>
        </>
    )
}