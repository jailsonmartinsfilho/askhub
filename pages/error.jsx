import React from 'react';
import styles from '../styles/error.module.css';
import { MdNearbyError } from "react-icons/md";
import { BiError } from "react-icons/bi";

export default function Error({ mensagemErro }) {

    return (
        <section className={styles.mainContainer}>
            <div className={styles.errorContainer}>
            <BiError style={{ fontSize: '80px'}}/>
                <h1 className={styles.errorTitle}>
                    Ocorreu um erro!
                </h1>
                <p>Por favor, volte para a tela inicial e informe o erro aos desenvolvedores.</p>
                <p>Agradecemos sua colaboração.</p>
                <img className={styles.albedo} src="albedo2.png" alt=""/>

            </div>
        </section>
    );
};

