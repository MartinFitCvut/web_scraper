import React from "react";
import { useState } from "react";
import {Outlet} from "react-router-dom";
import '../css/docs.css';
import source from "../images/source.svg";
import Tutorial from "../components/docs/tutorial";
import GeneralInfo from "../components/docs/generelInfo";
import {useNavigate} from "react-router-dom";
import { Link } from "react-router-dom";
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

{/*
            <div className="document">
                {docs.doc ? <GeneralInfo handleDocuments={handleDocuments}/> : docs.tutorial ? <Tutorial handleDocuments={handleDocuments}/> : ''}
</div>*/}