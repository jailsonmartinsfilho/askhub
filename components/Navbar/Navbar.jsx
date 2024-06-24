
import Cookies from 'js-cookie';
import styles from './Navbar.module.css';
import { FaHome } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { FaBell } from "react-icons/fa";
import Link from 'next/link';

export default function Navbar({ }) {
    return (
        <header className={styles.containerHeader}>
            <div className={styles.containerNavbar}>
            <Link  href={`/`}><FaHome /></Link>
            <Link  href={`/ask`}><FaPen /></Link>
            <Link  href={`/ranking`}><FaTrophy /></Link>
            <Link  href={`/notificacoes`}><FaBell /></Link>
            <Link  href={`/configuracoes`}><FaGear /></Link>
            </div>
        </header>
    )
}