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
            <article>
                <h1>Menu</h1>
                <img src={require('../../images/menu.png')} style={{width: '90%'}}/>   
                <p><b>Tlačidlo domov</b>: Toto tlačidlo slúži na to, aby ste sa dostali na domovskú obrazovku.</p>
                <p><b>Zobraziť zdroje</b>: Toto je výber medzi Vašimi uloženými zdrojmi. Toto tlačidlo Vám zobrazí zoznam uložených zdrojov cez ktorý sa môžete prepínať medzi jednotlivými nastaveniami zdrojov.</p>
                <p><b>Dokumentácia</b>: Toto tlačidlo zobrazí dokumentáciu.</p>
                <p><b>Zobraziť články</b>: Toto tlačidlo Vám zobrazí všetky extrahované články. Ak sa prekliknete na túto stránku, tak tu si môžete filtrovať svoje extrahované články</p>

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

            <h1 id="templates">Šablóny</h1>
            <article>
                <p>Aby sa zdroj nemusel konfigurovať od nuly, sú pripravené 3 šablóny z ktorých si môžete vybrať.</p>
                <p>Tieto šablóny obsahujú dáta, ktoré sú získané automaticky pri načítaní si stránky z príslušným zdrojom.</p>
                <p>Pri používaní šablón sa zmenia akékoľvek nastavenia pre zdroj aké ste mali. Pri zvolení si šablóny sa vykoná nová požiadavka na server aby ste získali relevantné dáta. Tieto dáta sa Vám zobrazia napravo od šablón, v náhľade extrakcie.</p>
                <p>Aktívna šablóna je graficky znázornená a to tak, že jej tlačidlo sa <b>podfarbí modrou farbou.</b></p>
                <img src={require('../../images/rssactive.png')} style={{width: '40%'}}/> 
                <p>Šablóny <b>nie je</b> možné medzi sebou kombinovať a vždy môže byť <b>aktívna</b> len jedna alebo budú neaktívne <b>všetky</b></p>
                <div>
                    <img src={require('../../images/templaterss.PNG')} style={{width: '65%'}}/> 
                    <p style={{fontSize: '14px', marginTop: '0px'}}>Aktívna <b>RSS</b> šablóna, aj s náhľadom nad získané dáta</p>
                </div>
                <p>Ak si zvolíte šablónu ale mali ste predtým definované aj vlastné pravidlá extrakcie, nestačí šablónu vypnuť <b>ale je potrebné aby ste aspoň do jedného textového poľa niečo zadali, stačí len medzera</b>. Tým sa opäť aktivujú nastavenia ktoré máte ručne definované</p>
            </article>

            <h1 id="dwnsettings">Vlastné nastavenia extrakcie</h1>
            <article>
                <p>Vlastné nastavenia extrakcie spočívajú v tom že definujete vlastné selektory alebo použite jednotlivé hodnoty zo šablón.</p>
                <p>Pri vlastných nastaveniach je potrebné definovať <b>minimálne</b> povinné prvky ktorými sú:</p>
                <li>title,</li>
                <li>link,</li>
                <li>description.</li>
                <p>Zbytok je už na Vás, čo chcete a čo nechcete konfigurovať.</p>
                <p>Vlastné dáta môžete konfigurovať pomocou CSS selektorov, alebo využiť hodnoty zo šablón.</p>
                <p>🛈 Pre viac informácií o selektoroch kliknite na tento odkaz: <a href="/docs/selectors">selektory</a></p>
                <p>Pri každej zmene ktorú vykonáte pri určovaní vlastných nastavení extrakcie, systém odosiela požiadavku na server a snaží sa vyhľadať hodnotu zadaného prvku, ktorý ste definovali. Vaše nastavenie extrakcie sú viditeľné v náhľade, ktorý Vám priamo zobrazuje, či Vaše nastavenie sú správne alebo nie.</p>
                <p>Ak máte v selektoroch <b style={{color: 'red', fontWeight: 'normal'}}>chybu alebo ste nevyplnili všetky povinné prvky a nepoužívate šablónu</b>, systém Vám nedovolí spustiť extrakciu údajov.</p>
            </article>

            <h1 id="lastruns">Posledné behy - extrakcie</h1>
            <article>
                <p>Posledné behy zobrazujú úspešné extrakcie, ktoré scraper vykonal. Skrz toto viete nahliadnuť na to, čo sa podarilo extrahovať počas daného behu.</p>
                <img src={require('../../images/lastrun.png')} style={{width: '65%'}}/> 
                <li style={{marginTop: '25px'}}><b>Názov:</b> meno zdroja, to ktoré ste mu určili pri jeho pridávaní,</li>
                <li><b>RSS URL</b>: RSS adresa z ktorej sú tieto dáta extrahované,</li>
                <li><b>Nové články</b>: Počet novo pridaných článkov, teda článkov ktoré ešte neboli vo Vašej lokálnej databáze,</li>
                <li><b>Upravené články</b>: Počet článkov, ktorých obsah sa zmenil od poslednej extrakcie. Môže sa jednať o zmeny ktoré vykonali novinári(slovosled, iné slová a pod.) ale aj o zmeny, ktoré ste vykonali Vy, pri nastavovaní extrakcie zdroja,</li>
                <li><b>Dátum a čas extrakcie</b>: Akonáhle scraper začne vykonávať extrakciu dát, vytvorí sa čsaová značka, kedy scraper začal. Táto značka je potom zapísaná do záznamu do extrakcie, rovnako tak aj do upravených článkov.</li>
            </article>
            <article>
                <h2>Náhľad nad ukončenú extrakciu</h2>
                <p>V náhľade ukončenej extrakcie si viete pozrieť aké záznamy boli pridané ako nové a rovnako tak aj aké záznamy sa zmenili a aké sú ich novšie verzie, oproti tým, ktoré boli zmenené počas extrakcie.</p>
                <p><b>Novo pridané záznamy</b></p>
                <img src={require('../../images/newadd.PNG')} style={{width: '70%'}}/>
                <p><b>Upravené záznamy</b></p>
                <img src={require('../../images/newupd.PNG')} style={{width: '70%'}}/>
                <img src={require('../../images/verupd.PNG')} style={{width: '70%', marginTop: '0px'}}/>
                <p>Pri zmene v jednotlivých článkoch sa zvýraznia časti ktoré sú rozdielne</p>
                <p>Červeno označené časti sú časti, ktoré sú navyše oproti aktuálnemu článku. Teda to čo v novom zázname je ale vo verzii nie.</p>
                <p>Zeleno označené časti sú časti, ktoré sú vo verzií ale nie sú v aktuálnom článku.</p>
            </article>
            
            
        </div>
    );
}

export default GeneralInfo