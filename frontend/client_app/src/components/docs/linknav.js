import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

function NavLinkDocs(){
    return(
        <div className="navbar">
                <div className="menu-items"> 
 
                        <a href="/docs/general"><h3>Dokumentácia</h3></a>
                        <a href="/docs/general#teory"><li>Info</li></a>
                        <a href="/docs/general#templates"><li>Šablóny</li></a>
                        <a href="/docs/general#dwnsettings"><li>Vlastné nastavenia</li></a>
                        <a href="/docs/general#lastruns"><li>Posledné behy</li></a>
                        


                        <a href="/docs/tutorial"><h3>Tutoriál</h3></a>
                        <a href="/docs/tutorial#newsource"><li>Pridanie zdroja</li></a>
                        <a href="/docs/tutorial#template"><li>Predpripravené šablóny</li></a>
                        <a href="/docs/tutorial#views"><li>Rozličné zobrazenia</li></a>
                        <a href="/docs/tutorial#setting"><li>Vlastné nastavenia </li></a>
                        <a href="/docs/tutorial#changeviews"><li>Zmena náhľadov</li></a>
                        <a href="/docs/tutorial#startscraper"><li>Spustenie extrakcie</li></a>
                        <a href="/docs/tutorial#extraction"><li>Vykonané behy</li></a>
                        <a href="/docs/tutorial#filter"><li>Filtrovanie</li></a>

                        <a href="/docs/selectors"><h3>Selektory</h3></a>
                </div>
            </div>
    );
}

export default NavLinkDocs;