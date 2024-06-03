import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        const verificarToken = async () => {
            const token = Cookies.get('askhub');
            if (!token) return router.push('/login');
        };
        verificarToken();
    }, []);

    return (
        <div>
            <Head>
                <title>AskHub</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
        </div>
    )
}