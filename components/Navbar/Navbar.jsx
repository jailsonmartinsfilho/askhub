
import Cookies from 'js-cookie';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

import styles from './Navbar.module.css';
import { FaHome } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { FaBell } from "react-icons/fa";
import Link from 'next/link';

export default function Navbar({ podeBuscar }) {
    const [numeroNotificacoes, setNumeroNotificacoes] = useState(0); 

    useEffect(() => {
            const pagina = window.location.pathname.split('/')[1];

            if (pagina == 'notificacoes'){
                setNumeroNotificacoes(0);
            }else{
                const token = Cookies.get('askhub');
                axios.post('http://localhost:8080/buscarNumeroNotificacoes', {token})
                .then(response =>{
                    setNumeroNotificacoes(response.data);
    
                });
            }
    }, []); 

    return (
        <header className={styles.containerHeader}>
            <div className={styles.containerNavbar}>
            <Link  href={`/`}><FaHome /></Link>
            <Link  href={`/ask`}><FaPen /></Link>
            <Link  href={`/ranking`}><FaTrophy /></Link>
            <Link  href={`/notificacoes`}><FaBell /></Link>
            <Link  href={`/configuracoes`}><FaGear /></Link>
            <div className={styles.containerNotificacao} style={{display: numeroNotificacoes == 0 ? 'none' : 'flex'}}>{numeroNotificacoes}</div>
            </div>
        </header>
    )
}