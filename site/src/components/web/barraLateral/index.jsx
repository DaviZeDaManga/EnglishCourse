import './index.scss'

export default function BarraLateral({page}) {
    return ( 
        <>
            <section className='BarraLateral cor1'>
                <button className={`cor3 border ${page == "inicio" && "selecionado"}`}> 
                    <img src={`/assets/images/icones/${page === "inicio" ? "inicioPE" : "inicio"}.png`} />
                    Inicio 
                </button>
                <button className={`cor3 border ${page == "calendario" && "selecionado"}`}> 
                    <img src={`/assets/images/icones/${page === "calendario" ? "calendarioPE" : "calendario"}.png`} />
                    Calendário 
                </button>
                <button className={`cor3 border ${page == "minhasala" && "selecionado"}`}> 
                    <img src={`/assets/images/icones/${page === "minhasala" ? "minhasalaPE" : "minhasala"}.png`} />
                    Minha Sala 
                </button>
            </section>
        </>
    )
}