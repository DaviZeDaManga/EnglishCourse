import './index.scss'

export default function BarraLateral({page}) {
    return ( 
        <>
            <section className='BarraLateral border cor1'>
                <div className='ButtonSections cor4'>
                    <button className={`b cor3 ${page == "inicio" && "selecionado"}`}> 
                        <img src={`/assets/images/icones/inicio${page === "inicio" ? "PE" : ""}.png`} />
                        Inicio 
                    </button>
                </div>
                <div className='ButtonSections cor4'>
                    <button className={`b cor3 ${page == "calendario" && "selecionado"}`}> 
                        <img src={`/assets/images/icones/calendario${page === "calendario" ? "PE" : ""}.png`} />
                        Calendário 
                    </button>
                </div>
                <div className='ButtonSections cor4'>
                    <button className={`b cor3 ${page == "minhasala" && "selecionado"}`}> 
                        <img src={`/assets/images/icones/minhasala${page === "minhasala" ? "PE" : ""}.png`} />
                        Minha Sala 
                    </button>
                    {page == "minhasala" &&
                    <>
                    <button className="b selecionado"> 
                        <img src={`/assets/images/icones/TrilhasPE.png`} />
                        Acessar ultima trilha
                    </button>
                    <button className="b selecionado"> 
                        <img src={`/assets/images/icones/LivesPE.png`} />
                        Entrar na chamada
                    </button>
                    </>}
                </div>

                {page == "Trilha" &&
                <section className='Atividades cor4'>
                    <button className="b selecionado"> 
                        <img src={`/assets/images/icones/TrilhasPE.png`} />
                        Trilha 2 - No ritmo certo
                    </button>

                    <section className="CardAtividades">
                        <button className="b monstrando"> 
                            1. Introdução ao curso de inglês
                        </button>
                        <button className="b monstrando"> 
                            2. TOme toma la
                        </button>
                    </section>

                    <section className='CardAtividades'>
                        <button className="b selecionado"> 
                            3. Essa licao é muita legal
                        </button>
                        <button className="b selecionado"> 
                            <img src={`/assets/images/icones/LivesPE.png`} />
                            Assistir vídeo
                        </button>
                        <button className="b selecionado"> 
                            <img src={`/assets/images/icones/atividadesPE.png`} />
                            Fazer lições
                        </button>
                    </section>
                </section>}
            </section>
        </>
    )
}