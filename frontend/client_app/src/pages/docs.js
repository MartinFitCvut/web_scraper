import React from "react";
import {Outlet} from "react-router-dom";
import '../css/docs.css'

function Docs(){
    return(
        <div>
            <div class="navbar">
                <div class="menu-icon">
                    <p>M</p>
                </div>
                <div class="menu-items">
                    <p>Pridávanie zdroja</p>
                </div>
            </div>

            <div className="document">
                <div className="firstBorder">
                    <h2>Dokuemntácia</h2>
                    <h3>O čo sa to vlastne jedná</h3>
                </div>
                <article>
                    <p>Táto stránka ponúka možnosť nastavovania webových scraperov pre extrahovanie dát zo spravodajských portálov.</p>
                    <p>Aplikácia pracuje s RSS záznamami, ktoré má na starosti klient a umožňuje definovať HTML elementy extrakcie.</p>
                    <p>Na základe článkov ktoré sú zverejnené v týchto RSS záznamov a základe nastavení scraperov sa budú extrahovať dáta z jednotlivých článkov.</p>
                    <p>V nasledujúcich častiach sa dozvieš viac o jednotlivom fungovaní prvkov, aby si sa v aplikácií rýchlo zorientoval a vedel ju používať </p>
                </article>

                <article>
                    <h2>Trošku teórie na začiatok</h2>
                    <h3>RSS kanál</h3>
                    <p>RSS je formát súborov vytvorených v XML (Extensible Markup Language), ktoré poskytujú informácie o novo pridaných súboroch alebo článkoch na danej webovej stránke. V RSS kanáli sú zahrnuté informácie ako titulky, popisy, obrázky, dátumy vytvorenia a ďalšie. RSS kanály sú distribuované v reálnom čase, čo znamená, že najnovšie pridané súbory sú v ich štruktúre zoradené od vrchu. Prístup k RSS súborom je možný jednoducho tým, že k primárnej URL webovej stránky pridáme cestu „/rss“.</p>

                    <h3>Sémantické Dáta</h3>
                    <p>Sémantické dáta sú štruktúrované dáta, ktoré poskytujú zmysluplný a špecifický kontext informáciám na webovej stránke. Tieto dáta sú navrhnuté tak, aby boli strojovo čitateľné a umožnili lepšiu interpretáciu a porozumenie pre vyhľadávacie stroje, aplikácie a iné automatizované systémy. Ich podstata pramení v tvorbe Sémantického webu. </p>

                    <h3>Web Scraper</h3>
                    <p>Web scraper je program ktorý na základe špecifikovaných nastavení dokáže extrahovať rôzne dáta z webových stránok</p>
                </article>

                <article>
                    <h3>Pridanie zdroja</h3>
                    <p>Nový zdroj je možné pridať na domovskej obrazovke</p>
                    <p>Pre pridanie nového zdroja je potrebné definovať jeho názov a RSS adresu</p>
                    <p>Názov zdroja musí byť unikátny a systém je nastavený tak, že nedovolí vytvoriť dva zdroje s rovnakým menom.</p>
                    <p>Taktiež tento názov ktorý určíte, bude slúžiť aj ako identifikátor pre jednotlivé extrahované dáta, aby bolo neskôr pri vyhľadávaní možné určiť z ktorého spravodajského portálu sa článok stiahol</p>
                    <p>Druhým parametrom je RSS záznam. Ten je po väčšine času možné nájsť, ak za URL adresu spravodajského portálu zadáte /rss </p>
                    <p>Napríklad: 'https://cnn.iprima.cz/rss' je záznam pre RSS kanál spravodajského portálu Prima CNN</p>
                    <p>Ako nájsť RSS záznam</p>
                    <li>Zobraz te si spravodajský portál z ktorého by ste chceli extrahovať dáta</li>
                    <li>Zobrazte si hlavnú stránku a vyskúšajte v priehliadači doplniť "/rss" za pôvodnú URL adresu</li>
                    <li>Ak RSS záznam existuje, budete bud to na neho priamo presmerovaný alebo je veľká pravdepodobnosť, že  Vás spravodajský portál informuje o tom, na akej URL ponúkajú RSS záznam</li>
                    <li>Ak sa Vám ho podarí nájsť, zadajte názov do príslušného okna, pod akým chcete aby dáta boli ulkladané a doložte URL RSS adresu </li>
                    <li>Stlačte tlačidlo pridať.</li>
                    <li>Systém Vás následne informuje o tom, či sa záznam úspešne pridal alebo nastala niekde v procese chyba</li>
                    <li>Ak je zdroj pridaný, môžte prejsť ku konfigurácií, ktorú si zobrazíte tlačidlom pre nastanie v náhľade zdroju</li>
                </article>

            

            
            
        </div>
    </div>
    );
}

export default Docs;