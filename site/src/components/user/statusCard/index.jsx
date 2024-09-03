import { useRef, useState } from 'react'
import './index.scss'
import LoadingBar from 'react-top-loading-bar';

export default function StatusCard({className, mensagem, children, reload}) {
    const [carregando, setCarregando] = useState(false)
    const ref = useRef()
    
    function reloadPage() {
        setCarregando(true)

        setTimeout(() => {
            window.location.reload() 
        }, 1500);
    }

    return (
        <>
        <LoadingBar color="#8A55CD" ref={ref} />

        <main className={`StatusCard cor1 border2 ${className}`}>
            {mensagem == "Loading" ? ( 
                <button className='b min transparente'>
                    <img className='Load LoadIcon' src='/assets/images/icones/Loading.png' />
                </button>
            ) : (
                <>
                <section className='StatusCardButtons'>
                    <h4>{mensagem}</h4>
                    
                    {reload == true &&  
                    <button onClick={reloadPage} className='b min transparente'>
                        <img className={`LoadIcon ${carregando == true && "Load"}`} src='/assets/images/icones/Loading.png' />
                    </button>} 
                </section>
                <section className='StatusCardButtons'>
                    {children}
                </section>
                </>
            )}
            
        </main>
        </>
    )
}