import './index.scss'

export default function Card({name, desc, link, img}) {
    return (
        <>
            <main className='Card cor1 border'>
                {img == null &&
                <>
                    <section className='Title border cor2'>
                        <h3>{name}</h3>
                    </section>
                    <section className='Desc'>
                        <section className='DescCard border cor2'>
                            <div className='linha'></div>
                            <h4>{desc}</h4>
                        </section>
                        <button className='b cor3'>
                            Acessar
                        </button>
                    </section>
                </>}
                {img != null &&
                <>
                    <section className='Img cor2'>
                        <img src={img} className='fundo'/>
                        <section className='Escuro'>
                            <h3>{name}</h3>
                        </section>
                    </section>
                </>}
            </main>
        </>
    )
}