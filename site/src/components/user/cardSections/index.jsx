import React, { useState } from "react";

export default function CardSections({ buttons, children }) {
    const [section, setSection] = useState(buttons[0][0]);

    const filteredChildren = React.Children.toArray(children).filter(child => {
        return child.props['data-category'] === section;
    });

    const voltar = React.Children.toArray(children).filter(child => {
        return child.props['data-category'] === "Voltar";
    });

    return (
        <section className='CardSections cor1 border'>
            <section className='SectionButtons cor1 column border2'>
                {voltar}
                {buttons.map(([label, image]) => (
                    <button
                        key={label}
                        onClick={() => setSection(label)}
                        className={`b cor3 ${section === label ? "selecionado" : ""}`}
                    >
                        <img src={section === label ? image.replace('.png', 'PE.png') : image} />
                    </button>
                ))}
            </section>
            <section className="SectionCards column cor1 border2">
                <h3>{section}</h3>
                {filteredChildren.length === 0 ? (
                    <h4>Nada encontrado.</h4>
                ) : (
                    <>
                        {filteredChildren}
                    </>
                )}
            </section>
        </section>
    );
}
