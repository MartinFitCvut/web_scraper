import React from "react";
import { NavLink } from "react-router-dom";


function Tutorial() {
    return (
        <div>
            <h1 id="tutorial">Tutoriál - Ako na to</h1>
            <article id="newsource">
                <h2>Pridanie zdroja</h2>
                <p>Nový zdroj je možné pridať na domovskej obrazovke.</p>
                <p>Pre pridanie nového zdroja je potrebné definovať jeho názov a RSS adresu.</p>
                <p>Názov zdroja musí byť unikátny a systém je nastavený tak, že nedovolí vytvoriť dva zdroje s rovnakým menom.</p>
                <p>Názov zdroja ktorý určíte bude slúžiť aj ako identifikátor pre stiahnuté články, aby ste vedeli z ktorého zdroja bol záznam stiahnutý, <b>preto odporúčam vybrať si taký názov aby ste rýchlo vedeli rozlíšiť jednotlivé zdroje</b>.</p>
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
                    <li>Systém Vás informuje o stave vašej požiadavky. Ak ste zadali správne informácie s RSS adresa je platná, systém Vás oboznámi o pridaní zdroja. Ak ste zadali nesprávne informácie tak Vás na to systém upozorní.</li>
                </ol>
                <img src={require('../../images/newsource.PNG')} style={{width: '40%', border: '1px solid'}}/>
            </article>
            <h1 id="template">Pripravené šablóny</h1>
            <article>
                <div style={{display: 'flex'}}>
                    <img src={require('../../images/sablony.PNG')} alt="Šablony" style={{width: '30%'}}/>   
                    <img src={require('../../images/sablona_hover.png')} alt="Šablony s tooltip" style={{width: '30%', marginLeft: '30px'}}/>
                </div>
                <p>Tieto šablóny sú predpripravené a z nich môžete vyberať.</p>
                <p>Každá šablóna ktorú si zvolíte, odošle požiadavku na server.</p>
                <p>Pri zmene šablóny sa berie do úvahy práve jej nastavenie a sú ignorované samostatné nastavenia extrakcie.</p>
                <p style={{color: "#ff8484"}}>Pre zmenu na samostatné nastavenia treba v jednej z položiek zmeniť hodnotu.</p>
                <p>Pri každom tlačidle je aj popis, ktorý zľahka popisuje o čom je šablóna.</p>
                <h3>Šablóna RSS</h3>
                <p>Táto šablóna zobrazí extrahované RSS dáta a pri jej zvolení a spustení extrakcie sa zo všetkých článkov z <b>RSS</b> kanálu extrahujú práve tieto RSS záznamy.</p>
                <h3>Šablóna Semantics</h3>
                <p>Táto šablóna zobrazí <b>sémantické</b> dáta, ktoré sú extrahované z článku. Jedná sa o dáta získané z <b>openGraph</b> sématického formátu. Zo všetkých článkov ktoré sú spomenuté z RSS sa extrahujú <b>sémantické dáta</b>.</p>
                <h3>Šablóna RSS a Semantické</h3>
                <p>Táto šablóna zobrazí <b>sémantické</b> a <b>RSS</b> dáta spoločne. Zo všetkých článkov z RSS kanálu sa extrahujú dáta podľa tejto šablóny.</p>
            </article>

            <h1 id="views">Zobrazenia dát</h1>
            <article>
                <div style={{display: 'flex'}}>
                    <img src={require('../../images/zobrazenie.PNG')} alt="Šablony" style={{width: '30%'}}/>   
                    <img src={require('../../images/zobrazenie_hover.png')} alt="Šablony s tooltip" style={{width: '30%', marginLeft: '30px'}}/>
                </div>
                <p>Rozdielne zobrazenia nad extrahované dáta.</p>
                <h3>Zobraziť dáta</h3>
                <p>Pri tomto zobrazení sa zobrazia dáta vo formáte key-value(kľúč-hodnota).</p>
                <img src={require('../../images/zobrazenie_data.PNG')} alt="Šablony" style={{width: '50%'}}/> 
                <h3>Zobraziť ako článok</h3>
                <p>Pri tomto sa zobrazia dáta vo forme podobnom článku.</p> 
                <img src={require('../../images/zobrazenie_clanok.PNG')} alt="Šablony" style={{width: '50%'}}/>
            </article>

            <h1 id="setting">Vlastné nastavenia</h1>
            <article>
                <img src={require('../../images/setting.png')} alt="Šablony" style={{width: '50%'}}/>
                <p>Vlastné nastavenia pre extrahovanie.</p>
                <p>Povinné časti ktoré je nutné definovať pri vlastných nastaveniach extrakcie sú:</p>
                <ul>
                    <li><b>title</b>: titulok alebo názov,</li>
                    <li><b>link</b>: link na článok,</li>
                    <li><b>description</b>: popis článku.</li>
                </ul>
                <p>Tieto časti je potrebné definovať kvôli následnému vyhľadávaniu a aby sa udržala aspoň malá štruktúra pre extrahovanie dát.</p>
                <p><b>Pre nepovinné časti je potreba definovať aj kľúč, až potom napísať selektor</b>.</p>
                <p>Za každým selektorom v nepovinnej časti sa píše <b style={{color: 'red'}}>";"</b>.</p>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <p>Napríklad: </p>
                    <img src={require('../../images/imgsrc.PNG')} alt="Šablony" style={{width: '20%', height: 'fit-content', marginLeft: '25px'}}/>
                </div>
                
                <p>Pri definovaní vlastných nastavení sú dve možnosti nastavenia.</p>
                <ul>
                    <li>! <b>CSS selektory,</b></li>
                    <li>! <b>Vyberanie prvkov zo šablóny</b>.</li>
                </ul>
                <h2>Vlastné selektory</h2>
                <p>Vlastné selektory sa píšu v podobe CSS selektorov.</p>
                <p>Nie je potrebné písať kompletné HTML tagy s &lt; a &gt;, iba ich obsah.</p>
                <p>Napríklad:</p>
                <ul>
                    <li>Správne: h1,</li>
                    <li style={{color: 'red'}}>Nesprávne: &lt;h1&gt;,</li>
                    <li>Správne: div p,</li>
                    <li style={{color: 'red'}}>Nesprávne: &lt;div&gt; &lt;p&gt;.</li>
                </ul>
                <p><b style={{fontSize:'30px', color:'red', marginRight: '15px'}}>!</b>Ak si nie ste istý ako sa selektor píše a čo znamená tak sa pozrite tu: <a href="/docs/selectors">selektory</a>.</p>
                <p>Selektory môžete taktiež skopírovať pri používaní DevTools.</p>            
                <img src={require('../../images/devtools.png')} alt="Šablony" style={{width: '60%'}}/>
                <p style={{fontSize: '14px'}}>Na obrázku je vidieť ako je možné si skopírovať CSS selektor pre prvok <b>&lt;h1&gt;</b>.</p>
                <li>Pri zobrazení DevTools si viete označiť prvok ktorý chete extrahovat;</li>
                <li>Kliknite pravím tlačidlom a zvoľte možnosť <b>kopírovať</b>;</li>
                <li>Vyberte zo zoznamu <b>kopírovať selektor</b>;</li>
                <li>Vložte selektor do požadovaného poľa.</li>
                <img src={require('../../images/devtoolsselector.PNG')} alt="Šablony" style={{width: '30%'}}/>
                <p style={{fontSize: '14px'}}>Obrázok zobrazuje vložený selektor<b>&lt;h1&gt;</b>.</p>
                <p>Selektor može vyzerať nasledovne: <i>body &gt; div.main-container.relative.mx-auto.bg-white &gt; div.content.overflow-hidden.px-4.lg\:px-6 &gt; article &gt; header &gt; h1</i></p>
                <p><b style={{fontSize:'30px', color:'red', marginRight: '15px'}}>!</b>Ak si nie ste istý ako sa selektor píše a čo znamená tak sa pozrite tu: <a href="/docs/selectors">selektory</a>.</p>
                
                <h2>Vyberanie prvkov zo šablóny</h2>
                <p>Pre vlastné nastavenie je možné využiť aj prvy z predpripravenej RSS šablóny alebo sémantickej šablóny.</p>
                <h3><b style={{fontSize:'30px', color:'red', marginRight: '15px'}}>!</b> Vyberanie z RSS</h3>
                <li>Pre povinný prvok stačí ak napíšete <b>RSS</b>,</li>
                <img src={require('../../images/rsstitle.PNG')} alt="Šablony" style={{width: '40%'}}/>
                <li>Pre nepovinný prvok je potrebné napísať presný názov kľúča a potom <b>RSS</b>,</li>
                <img src={require('../../images/imagerss.PNG')} alt="Šablony" style={{width: '40%'}}/>
                <h3><b style={{fontSize:'30px', color:'red', marginRight: '15px'}}>!</b> Vyberanie zo sémantických</h3>
                <li>Pre povinný prvok stačí ak napíšete <b>Semantics</b>,</li>
                <img src={require('../../images/dessemantic.PNG')} alt="Šablony" style={{width: '40%'}}/>
                <li>Pre nepovinný prvok je potrebné napísať presný názov kľúča a potom <b>Semantics</b>,</li>
                <img src={require('../../images/imageseman.PNG')} alt="Šablony" style={{width: '40%'}}/>
                <p><b style={{fontSize:'30px', color:'red', marginRight: '15px'}}>!</b>Ak si nie ste istý ako sa selektor píše a čo znamená tak sa pozrite tu: <a href="/docs/selectors">selektory</a>.</p>
            </article>

            <h1 id="changeviews">Zmena náhľadov</h1>
            <article>
                <img src={require('../../images/changeviews.png')} alt="Šablony" style={{width: '45%'}}/>
                <p><b>Náhľad extrakcie</b>: Zobrazuje náhľad nad vaše nastavenia extrakcie. <b>To čo vidíte v tomto náhľade, tak v takejto forme sa scraper bude pokúšať estrahovať dáta</b>.</p>
                <p><b>RSS</b>: Zobrazuje RSS dáta pre daný článok. <b style={{fontSize: '14px', color: 'red'}}>Tento náhľad avšak nie je funkcionalitov rovnaký ako keby ste si vybrali RSS šablónu. Po zvolení šablóny sa scraper nastaví na extrakciu týchto dát, avšak pri zvolení náhľadu nad RSS (teda toto), sa nijak nezmenia akékoľvek Vaše nastavenia ! !</b>.</p>
                <p><b>Sémantické dáta</b>: Zobrazuje Sémantické dáta openGraph pre daný článok. <b style={{fontSize: '14px', color: 'red'}}>Rovnako platí ako pre RSS, nijak nemení nastavenia extrakcie</b>.</p>
                <p><b>Článok na portály</b>: Toto zobrazí článok v podobe ako bol zverejnený na spravodajskom portále.</p>
            </article>

        <h1 id="startscraper">Spustenie extrakcie</h1>    
        <article>
            <p>Scraper na extrahovanie z tohto zdroja sa dá spustiť jednorázovo alebo naplánovať opakované automatické extrahovanie.</p>
            <h2>Jednorázové spustenie</h2>
            <img src={require('../../images/onetime.PNG')} alt="Šablony" style={{width: '65%'}}/>
            <p>Jednorázové spustenie znamená, že sa budú extrahovať dáta iba a raz a potom sa extrakcia ukončí. Informácie o extrakcii sú následne v časti <a href="#extraction">vykonané behy</a>.</p>  
            <h2>Opakované spustenie</h2>
            <p>Opakovanú extrakciu je možné nastaviť v minútach.</p>
            <img src={require('../../images/minutes.PNG')} alt="Šablony" style={{width: '40%'}}/>
            <p>Pri opakovaní v minútach nastavujete rádovú číslovku minút.</p>
            <p>Nastavenie 5 minút znamená:</p>
            <li>Každá 5. minúta v hodine: <i>09:00 / 09:05 / 09:10 / 09:15 / 09:20</i></li>
            <li style={{color: 'red'}}>Nesprávne: Každých 5 minút od momentu spustenia.</li>

            <h3>Opakovanú extrakciu je možné nastaviť aj hodinách</h3>
            <img src={require('../../images/hours.PNG')} alt="Šablony" style={{width: '40%'}}/>
            <p>Pri nastavení <b>presného času</b> sa extrakcia vykoná raz za 24h. v čas ktorý ste určili.</p>
            <p>Pri nastavení <b>opakovaného extrahovania</b> sa opäť nastavujú rádové číslovky.</p>
            <p>Každá <b>x-tá</b> hodina a každá <b>y-tá</b> minúta.</p>
            <p>Nastavenie 02:15 znamená: <i>V každej 2. hodine a 15. minúte.</i></p>
            <li><i>02:15 / 04:15 / 06:15 / 08:15 .... .</i></li>
            <p>Extrahovanie spustíte tlačidlom <b>Spustiť</b> a zastavíte tlačidlom <b>Zastaviť</b></p>
            <p>Informácie o extrakcii sú následne v časti <a href="#extraction">vykonané behy</a>.</p>  
        </article>

        <h1 id="extraction">Vykonané behy</h1>
        <article>
            <p>Vykonané behy zobrazujú úspešne ukončené extrakcie scraper pre daný zdroj.</p>
            <img src={require('../../images/runs.PNG')} alt="Šablony" style={{width: '70%'}}/>
            <p><b>Počet záznamov</b>: Zadajte počet záznamov ktoré chcete aby sa systém pokúsil vyhľadať. Scraper sa pokúsi vyhľadať presne toľko záznamov o ukončených behoch. Výsledky sú radené od najnovšieho.</p>
            <p>Stlačte tlačidlo <b>Vyhľadať</b> pre zobrazenie požadovaných behov.</p>
            <p>Pre viac informácií o posledných behov kliknite tu: < NavLink to="/docs/general#lastruns">posledné behy</NavLink></p>
        </article>

        <h1 id="filter">Filtrovanie výsledkov</h1>
        <p>Filtrovať výsledky je možné v samostatnej časti po kliknutí na tlačidlo <b>Zobraziť články</b> v hornom menu</p>
        <img src={require('../../images/filter.png')} alt="Šablony" style={{width: '70%'}}/>
        <p>Možnosti filtrovania</p>
        <ul>
            <li><b>Kľúčové slovo</b>: Vyhľadávanie bude prebiehať na základe kľúčového slova. Toto slovo sa musí nachádzať v <b>Nadpise(titulok)</b> alebo v <b>Popise</b>,</li>
            <li><b>Názov zdroja</b>: Toto vyhľadávanie sa obmedzí len na články z jedného zdroja. Je potrebné zadať presný názov zdroja, teda ten názov ktorý ste zadávali pri jeho vytvorení,</li>
            <li><b>Dátum a čas od(min)</b>: Spodná hranica filtra, teda od akého dátumu a času chcete získať novšie záznamy,</li>
            <li><b>Dátum a čas do(max)</b>: Vrchná hranica filtra, teda maximálny dátum a čas do ktorého chcete vyhľadávať záznamy</li>
            <li><b style={{color: 'red', marginRight: '10px'}}>!</b>Čas je možné nastaviť až potom čo si zvolíte dátum, nie je možné nastaviť čas bez toho aby ste k nemu určili dátum</li>
            <li><b>GUID</b>: Ak viete a chcete vyhľadať článok na základe jeho jedinečného identifikátora <b>GUID</b></li>
        
        </ul>
            
        </div>
    );
}

export default Tutorial