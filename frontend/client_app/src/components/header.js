import React, { useState, useEffect, useRef } from "react";
import {Outlet} from "react-router-dom";
import '../css/header.css'
import logo from '../images/homeIcon.png'
import { Link } from "react-router-dom";
function Header(){
    return(
        <>
        <div className="header">
            
            <nav className="menu">
                <span className='homeButtonIcon'>
                    <Link to='/' style={{textDecoration: 'none', color: 'black'}}>
                        <img src={logo} className="homeIcon"/>  
                    </Link>
                </span> 
                <div className="homeButtonText">
                    <span className="homeButtonTextElements">
                        <Link to='/docs'style={{textDecoration: 'none', color: 'black'}} state={'search'}>Dokumentácia</Link>
                    </span>
                        
                    <span className="homeButtonTextElements">
                        <Link to='/search'style={{textDecoration: 'none', color: 'black'}} state={'search'}>Zobraziť články</Link>
                    </span>
                </div>
            </nav>        
        </div>
        
        <Outlet/>
        </>
        
    );
}

export default Header;