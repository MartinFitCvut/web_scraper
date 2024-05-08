import React from "react";
import {Outlet} from "react-router-dom";
import '../css/docs.css';

import NavLinkDocs from "../components/docs/linknav";


function Docs(){
    
    return(
        <div style={{display: 'flex'}}>
            
            <NavLinkDocs/>

            <div className='document'>

                <Outlet/>

            </div>
            
    </div>
    );
}

export default Docs;
