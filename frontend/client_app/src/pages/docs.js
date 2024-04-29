import React from "react";
import { useState } from "react";
import {Outlet} from "react-router-dom";
import '../css/docs.css';
import source from "../images/source.svg";
import Tutorial from "../components/docs/tutorial";
import GeneralInfo from "../components/docs/generelInfo";

function Docs(){
    
    const [docs, setDoct] = useState({
        doc: true,
        tutorial: false,
        commands: false
    })


      const handleDocuments = (name) => {
        setDoct(prevState => {
            const updatedDocs = {};
            Object.keys(prevState).forEach(key => {
                updatedDocs[key] = key === name ? true : false;
            });
            return updatedDocs;
        });
    }
    
    const handleGeneralClick = () => {
        setDoct({
            ...docs,
            doc: true
        });
    }

    const handleTutorialClick = () => {
        setDoct({
            ...docs,
            tutorial: true
        });
    }

    return(
        <div style={{display: 'flex'}}>
            <div className="navbar">
                <div className="menu-items"> 
                        <a href="#generalinfo" onClick={() => handleDocuments('doc')}><h3>Dokumentácia</h3></a>
                        <a href="#teory" onClick={handleGeneralClick}><li>Info</li></a>
                        <a href="#sources" onClick={handleGeneralClick}><li>Zdroje</li></a>

                        <a href="#tutorial" onClick={() => handleDocuments('tutorial')}><h3>Tutoriál</h3></a>
                        <a href="#newsource" onClick={() => handleDocuments('tutorial')}><li>Pridanie zdroja</li></a>
                </div>
            </div>

            <div className="document">
                {docs.doc ? <GeneralInfo handleDocuments={handleDocuments}/> : docs.tutorial ? <Tutorial handleDocuments={handleDocuments}/> : ''}
            </div>
    </div>
    );
}

export default Docs;