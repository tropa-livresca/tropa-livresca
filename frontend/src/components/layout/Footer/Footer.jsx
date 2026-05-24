import {FaFacebook, FaInstagram, FaLinkedin} from 'react-icons/fa';
import { Link } from "react-router-dom";
import styles from './Footer.module.css';
import logo from "../../images/logo.png";

/**
 * Componente de rodapé
 * 
 * @component
 * @returns {JSX.Element}
 */
export default function Footer(){
    return (
    <footer className = {styles.footer}>
        <div className = {styles.logo}>
            <Link to="/">
              <img src={logo} alt="Tropa Livresca" width="100" />
            </Link>
        </div>
        <div className = {styles.mapa}>
            <h3>Mapa do Site</h3>
            <ul className={styles.mapalist}>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/">Sobre Nós</Link></li>
                <li><Link to="/">livros</Link></li>
                <li><Link to="/">Loja</Link></li>
                <li><Link to="/">Autores</Link></li>
                <li><Link to="/">Blog</Link></li>
                <li><Link to="/">Se Autopublique</Link></li>
            </ul>
        </div>
        <div className = {styles.atendimento}>
            <h3>Atendimento</h3>
            <ul className={styles.mapalist}>
                <li>(14)5983-9867</li>
                <li><Link to="/">Rua Dr. David Gabriel 667, Taquarituba-SP <br/> CEP: 18740-000</Link></li>
            </ul>
        </div>
        <div className = {styles.icons}>
        <ul className = {styles.social_list}>
            <li>
                <FaFacebook/>
            </li>
            <li>
                <FaInstagram/>
            </li>
            <li>
                <FaLinkedin/>
            </li>
        </ul>
        </div>

        {/*
        <p className = {styles.copy_right}>
            <span>Tropa Livresca</span> &copy; 2026
        </p>*/}
    </footer>);
}