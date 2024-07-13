import './index.scss'

export default function ErrorCard({mensagem}) {
    return (
        <>
        <main className='errorCard cor1 border'>
            <h4>{mensagem}</h4>
        </main>
        </>
    )
}