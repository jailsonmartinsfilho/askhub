import { useState, useEffect } from 'react';

const useCarregarImagens = (idUsuario) => {
  const [fotoPerfilCarregada, setFotoPerfilCarregada] = useState('');
  const [fotoCapaCarregada, setFotoCapaCarregada] = useState('');

  useEffect(() => {
    const extensoes = ['.jpg', '.jpeg', '.png', '.gif'];

    const carregarFotoPerfil = async () => {
      for (const extensao of extensoes) {
        const resposta = await fetch(`/icons/${idUsuario}${extensao}`);
        if (resposta.ok) {
          setFotoPerfilCarregada(`/icons/${idUsuario}${extensao}`);
          break;
        }
      }
    };

    const carregarFotoCapa = async () => {
      for (const extensao of extensoes) {
        const resposta = await fetch(`/capas/${idUsuario}${extensao}`);
        if (resposta.ok) {
          setFotoCapaCarregada(`/capas/${idUsuario}${extensao}`);
          break;
        }
      }
    };

    if (idUsuario) {
      carregarFotoPerfil();
      carregarFotoCapa();
    }
  }, [idUsuario]);

  return { fotoPerfilCarregada, fotoCapaCarregada };
};

export default useCarregarImagens;