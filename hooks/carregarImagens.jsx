import { useState, useEffect } from 'react';

const useCarregarImagens = (idUsuario, extensaoFotoPerfilUsuario, extensaoFotoCapaUsuario) => {
  const [fotoPerfilCarregada, setFotoPerfilCarregada] = useState('/icons/default.png');
  const [fotoCapaCarregada, setFotoCapaCarregada] = useState('');

  useEffect(() => {
    const carregarFotoPerfil = async () => {
      setFotoPerfilCarregada(`/icons/${idUsuario}${extensaoFotoPerfilUsuario}`);
    };

    const carregarFotoCapa = async () => {
      setFotoCapaCarregada(`/capas/${idUsuario}${extensaoFotoCapaUsuario}`);
    };

    if (extensaoFotoPerfilUsuario) {
      carregarFotoPerfil();
    }
    if (extensaoFotoCapaUsuario) {
      carregarFotoCapa();
    }
  }, [idUsuario]);

  return { fotoPerfilCarregada, fotoCapaCarregada };
};

export default useCarregarImagens;