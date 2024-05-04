import React from "react";
import source from "../../images/source.svg";
import { NavLink } from "react-router-dom";

function GeneralInfo() {
    return (
        <div style={{marginRight: '20px'}}>
            <h1 id="generalinfo">Dokumentácia</h1>

            <article>
                <h2>O čo sa to vlastne jedná</h2>
                <p>Táto stránka ponúka možnosť nastavovania webových scraperov pre extrahovanie dát zo spravodajských portálov.</p>
                <p>Aplikácia pracuje s RSS záznamami, ktoré má na starosti klient a umožňuje definovať HTML elementy extrakcie.</p>
                <p>Na základe článkov ktoré sú zverejnené v týchto RSS záznamov a základe nastavení scraperov sa budú extrahovať dáta z jednotlivých článkov.</p>
                <p>V nasledujúcich častiach sa dozvieš viac o jednotlivom fungovaní prvkov, aby si sa v aplikácií rýchlo zorientoval a vedel ju používať.</p>
            </article>

            <h1 id="teory">Trošku teórie na začiatok</h1>

            <article>
                <h2>RSS kanál</h2>
                <p>Jednou z metód na sledovanie aktualít na webových stránkach sú RSS (Really Simple Syndication) kanály. RSS je formát súborov vytvorených v XML (Extensible Markup Language), ktoré poskytujú informácie o novo pridaných súboroch alebo článkoch na danej webovej stránke. V RSS kanáli sú zahrnuté informácie ako titulky, popisy, obrázky, dátumy vytvorenia a ďalšie. RSS kanály sú distribuované v reálnom čase, čo znamená, že najnovšie pridané súbory sú v ich štruktúre zoradené od vrchu. RSS kanály nevyužívajú všetky webové stránky ale sú časté práve pri internetových spravodajstvách a prístup ku RSS záznamu je často možný tým, že k primárnej URL webovej stránky pridáme cestu „/rss“.</p>

                <h2>Sémantické Dáta</h2>
                <p>Sémantické dáta sú štruktúrované dáta, ktoré poskytujú zmysluplný a špecifický kontext informáciám na webovej stránke. Tieto dáta sú navrhnuté tak, aby boli strojovo čitateľné a umožnili lepšiu interpretáciu a porozumenie pre vyhľadávacie stroje, aplikácie a iné automatizované systémy. Ich podstata pramení v tvorbe Sémantického webu. </p>

                <h2>Web Scraper</h2>
                <p>Web scraper je softvér alebo skript navrhnutý na automatizované získavanie údajov z webových stránok. Tieto nástroje analyzujú HTML kód webových stránok a extrahujú z neho požadované informácie, ako sú textové údaje, obrázky, odkazy alebo iné dáta. Používa sa na rôzne účely, vrátane zbierania dát pre analytické účely, monitorovanie cien, agregáciu obsahu a mnoho ďalších.</p>
            </article>

            <h1 id="sources">Zdroje - scraper</h1>
            <article>   
                <h2>Na čo slúžia</h2>
                <p>Táto aplikácia využíva RSS záznamy pre získavanie článkov, a teda automaticky prechádza jednotlivé prvky v tomto RSS zázname a vykonáva pre nich extrakciu podľa nastavených pravidiel.</p>
                <p>Pridať nový zdroj web scrapera je možný a domovskej stránke a bližšie infomácie o pridávaní sú zobrazené v <NavLink to='/docs/tutorial#newsource'> tutoriály</NavLink></p>
                
                <article style={{ display: 'flex', flexDirection: 'column' }}>
                    <h2>Čo obsahuje zdroj</h2>
                    <p>Na domovskej stránke sú zobrazené všetky zdroje, ktoré ste si vytvorili a sú zobrazené v takejto podobe,</p>
                    <img src={source} alt="Your SVG" style={{ width: '70%', margin: 'auto', marginTop: '30px', marginBottom: '50px' }} />
                    <li> <b>Tlačidlo pre nastavenie scrapera: </b> Toto tlačidlo Vás presmeruje do konfiguračnej časti, kde budete mať možnosť nastavovať, spúštať scraper</li>
                    <li> <b>Názov zdroja: </b> Názov ktorý ste nastavili pri jeho vytváraní</li>
                    <li> <b>Stav scrapera: </b> Informácia o tom, v ako stave sa scraper nachádza</li>
                    <li> <b>Nastavená frekvencia: </b> Frekvenkcia ktorú ste nastavili scraperu pre opätovné spúšťanie</li>
                    <li> <b>Tlačidlo pre vymazanie zdroja: </b> Zmazanie zdroja</li>
                </article>
               <h3> Stavy scrapera </h3>
               <p>Scraper sa môže nachádzať v 3 stavoch</p>
               <li><b>Pracuje: </b> To znamená že scraper práve extrahuje údaje</li>
               <li><b>Čaká: </b> To znamená že ste scraper spustili s naplánovaním automatického spúšťania, avšak teraz scraper čaká na opetovné spustenie</li>
               <li><b>Je zastavený: </b>Scraper je neaktívny, nepracuje a nie je nastavená opätovné automatické spúšťanie</li>
            </article>
        </div>
    );
}

export default GeneralInfo