import React from "react";

function Selectors(){
    return(
        <div style={{marginRight: '25px'}}>
            <h1>Selektory</h1>
            <article>
                <p>CSS selektory sú kľúčovými časťami jazyka CSS (Cascading Style Sheets), ktorý sa používa na definovanie vzhľadu a formátovania webových stránok. Selektory sú používané na identifikáciu a vybratie určitých HTML prvkov, na ktoré sa majú aplikovať štýly.</p>  
                <h2>Vyberanie elementov</h2>
                <p>CSS selektory umožňujú vybrať určité HTML elementy na základe ich typu.</p>
                <p>Napríklad pre HTML tag &lt;p&gt; sa napíše selektor iba <b>p</b></p>
                <li>HTML tag <b>&lt;div&gt;</b> - selektor: <b>div</b></li>
                <li>HTML tag <b>&lt;li&gt;</b> - selektor: <b>li</b></li>
                <h2>Vyberanie tried a id</h2>
                <p>Okrem samotných elementov je možné definovať v selektoroch aj <b>triedy</b> alebo <b>id</b> atribúty na vybratie kontrétnych prvkov.</p>
                <p><b>Triedy</b></p>
                <p>Definovanie <b>tried - class</b> je možné cez <b style={{color: '#009d00'}}>" . "</b>. Teda <b style={{color: '#009d00'}}>" . "</b> definuje že sa jedná o triedu a následne je potrebné určiť názov tej triedy</p>
                <p>Napríklad ak je v HTML definované: &lt;p class="atributeClass"&gt; tak CSS selektor je: <b>p.atributeClass</b></p>
                <li>HTML: <b>&lt;div class="styleCSS"&gt;</b></li>
                <li style={{color: '#009d00'}}>CSS selektor: <b>div.styleCSS</b></li>
                <li>HTML: <b>&lt;article class="newArticleClass"&gt;</b></li>
                <li style={{color: '#009d00'}}>CSS selektor: <b>article.newArticleClass</b></li>
                <p><b>ID</b></p>
                <p>Definovanie <b>ID</b> je možné cez <b style={{color: '#009d00'}}>" # "</b>. Teda <b style={{color: '#009d00'}}>" # "</b> definuje že sa jedná o id a následne je potrebné určiť názov toho id</p>
                <p>Napríklad ak je v HTML definované: &lt;p id="atributeId"&gt; tak CSS selektor je: <b>p#atributeId</b></p>
                <li>HTML: <b>&lt;div id="idElement"&gt;</b></li>
                <li style={{color: '#009d00'}}>CSS selektor: <b>div#idElement</b></li>
                <li>HTML: <b>&lt;article id="newArticleId"&gt;</b></li>
                <li style={{color: '#009d00'}}>CSS selektor: <b>article#newArticleId</b></li>
                <h2>Hierarchia</h2>
                <p>Selektory umožňujú vybrať prvky na základe ich vzťahov k iným prvkom v dokumente. Napríklad, selektor <b>div p</b> vyberie všetky odstavce <b>p</b>, ktoré sú vnorené v <b>div</b> elementy.</p>
                <p>Príklad HTML kódu:</p>
                <div style={{lineHeight: '5px'}}>
                    <p>&lt;div&gt;</p>
                    <p>&emsp; &lt;article&gt;</p>
                    <p>&emsp; &emsp; &lt;p&gt;</p>
                    <p>&emsp; &emsp; &emsp; Nejaký text</p>
                    <p>&emsp; &emsp; &lt;\p&gt;</p>
                    <p>&emsp; &lt;\article&gt;</p>
                    <p>&lt;\div&gt;</p>
                </div>
                <p>Ak chceme získať obsah elementu &lt;p&gt; tak môžme napísať selektor: <b>div p</b> alebo <b>div article p</b>.</p>
                <p>Takže nemusíme definovať priame vzťahy ale postupom selektoru definujeme aké vnorené prvky v DOM chceme získať.</p>
                <p>Vždy ľavý element je nadradený nad tým právým. Teda v <b>div article p</b>:</p>
                <li><b>div</b> je nadradené nad <b>article</b> a súčasne nad <b>p</b></li>
                <li><b>article</b> je nadradené <b>p</b></li>
                <h3>Vzťahy</h3>
                <p>Priame vzťahy parent - child sa dá jednoducho definovať pomocou <b style={{color: '#009d00'}}>"&gt;"</b>.</p>
                <p>Pri použití <b style={{color: '#009d00'}}>"&gt;"</b> sa definuje priame vzťahy, teda ak sa zadá <b>div &gt; article</b>, tak to je definovanie kedy <b>article</b> je priamym potomok elementu <b>div</b>.</p>

                <h2>Atribúty</h2>
                <p>Ak do selektora chcete definovať atribút danáho elementu ako napríklad &lt;a href='url...'&gt; alebo &lt;img src='address'&gt; tak sa píše cez zátvorky <b>[ ]</b></p>
                <p>HTML: &lt;a href='url...' &gt;</p>
                <p>CSS selektor: <b>a[url...]</b></p>

                <h2>Pohybovanie v štruktúre</h2>
                <p>Pri určovaní selektorov môžete určovať presné prvky ktoré chcete sťahovať</p>
                <p>Ak je napríklad text tvorený z &lt;p&gt; elementov a Vy chcete získať jeden konkrétny, môžete to docieliť nasledovne</p>
                <li><b>:first</b> - určí prvý element &emsp; Zápis: <b>div p:first</b></li>
                <li><b>:last</b> - určí poslený element &emsp; Zápis: <b>div p:last</b></li>
                <li><b>:eq()</b> - určí presný prvok (eq = equivalent) &emsp; Zápis: <b>div p:eq(0)</b> alebo <b>div p:eq(5)</b></li>
            </article>
            <article>
                <h2>Dodatočné parametre</h2>
                <h3>trim()</h3>
                <p>Tento príkaz vám odstráni prázdne riadky ktoré sa môžu vyskytovať v niektorých elementoch</p>
                <p>Použitie: <b>div p trim()</b></p>
                <h3>onlyValue()</h3>
                <p>Získa iba hodnoty daného elementu, resp. všetkých child elementov.</p>
                <p>Príklad na HTML kóde:</p>
                <div style={{lineHeight: '5px'}}>
                    <p>&lt;div&gt;</p>
                    <p>&emsp; &lt;article&gt;</p>
                    <p>&emsp; &emsp; &lt;p&gt;</p>
                    <p>&emsp; &emsp; &emsp; Nejaký text</p>
                    <p>&emsp; &emsp; &lt;\p&gt;</p>
                    <p>&emsp; &lt;\article&gt;</p>
                    <p>&lt;\div&gt;</p>
                </div>
                <p>Ak sa v tejto HTML štruktúre nachádza viacero <b>p</b> elementov a chcete získať ich hodnoty tak môžete použiť: </p>
                <p>Selektor: <b>div onlyValue()</b></p>
                <p>Výsledok: <b>"Nejaký text"</b></p>

                <h2>children()</h2>
                <p>Používa sa na získanie child elementov. Tento <b>vráti nový výber obsahujúci všetky priame potomky aktuálneho výberu</b> </p>
                <p>Selektor: <b>div children(p)</b></p>
            </article>
        </div>
    );
}

export default Selectors;