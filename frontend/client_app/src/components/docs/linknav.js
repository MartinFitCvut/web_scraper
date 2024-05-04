import React from "react";
import { Link } from "react-router-dom";

function NavLinkDocs(){
    return(
        <div className="navbar">
                <div className="menu-items"> 
 
                        <Link to="/docs/general"><h3>Dokumentácia</h3></Link>
                        <Link to="/docs/general#teory"><li>Info</li></Link>
                        <Link to="/docs/general#sources"><li>Zdroje</li></Link>

                        <Link to="/docs/tutorial"><h3>Tutoriál</h3></Link>
                        <Link to="/docs/tutorial#newsource"><li>Pridanie zdroja</li></Link>
                </div>
            </div>
    );
}

export default NavLinkDocs;