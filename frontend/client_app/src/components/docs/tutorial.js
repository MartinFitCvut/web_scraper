import React from "react";


function Tutorial() {
    return (
        <div>
            <h1 id="tutorial">Tutoriál - Ako na to</h1>
            <article id="newsource">
                <h2>Pridanie zdroja</h2>
                <p>Nový zdroj je možné pridať na domovskej obrazovke.</p>
                <p>Pre pridanie nového zdroja je potrebné definovať jeho názov a RSS adresu.</p>
                <p>Názov zdroja musí byť unikátny a systém je nastavený tak, že nedovolí vytvoriť dva zdroje s rovnakým menom.</p>
                <p>Názov zdroja ktorý určíte bude slúžiť aj ako identifikátor pre stiahnuté články, aby ste vedeli z ktorého zdroja bol záznam stiahnutý, <b>preto odporúčam vybrať si taký názov aby ste rýchlo vedeli rozlíšiť jednotlivé zdroje</b></p>
                <p>Druhým parametrom je RSS záznam. Ten je po väčšine času možné nájsť, ak za URL adresu spravodajského portálu zadáte /rss.</p>
                <p>Napríklad: <b><i>'https://cnn.iprima.cz/rss'</i></b> je záznam pre RSS kanál spravodajského portálu <b>Prima CNN</b>.</p>
                
                <h3>Ako nájsť RSS záznam</h3>
                <li>Zobrazte si spravodajský portál z ktorého by ste chceli extrahovať dáta,</li>
                <li>Zobrazte si hlavnú stránku a vyskúšajte v prehliadači doplniť <b>"/rss"</b> za pôvodnú URL adresu,</li>
                <li>Ak RSS záznam existuje, budete buď to na neho priamo presmerovaný alebo je veľká pravdepodobnosť, že  Vás spravodajský portál informuje o tom, na akej URL ponúkajú RSS záznam,</li>
                
                <h3>Pridať zdroj</h3>
                <ol style={{lineHeight: '1.6'}}>
                    <li>Zadajte názov pre zdroj do príslušného poľa <b>Názov</b>,</li>
                    <li>Zadajte RSS adresu zdroja do príslušného poľa <b>URL</b>,</li>
                    <li>Stkačte tlačidlo <b>Pridať zdroj</b>,</li>
                    <li>Systém Vás informuje o stave vašej požiadavky. Ak ste zadali správne informácie s RSS adresa je platná, systém Vás oboznámi o pridaní zdroja. Ak ste zadali nesprávne informácie tak Vás na to systém upozorní</li>
                </ol>
                <img src={require('../../images/newsource.PNG')} style={{width: '70%'}}/>
            </article>

            
        </div>
    );
}

export default Tutorial