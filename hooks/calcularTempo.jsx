export default function calcularTempo(tempo) {
    const agora = new Date();
    const tempoDate = new Date(tempo);
    let diferencaMilissegundos = Math.max(agora - tempoDate, 1);

    const segundos = Math.floor(diferencaMilissegundos / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    const semanas = Math.floor(dias / 7);
    const meses = Math.floor(semanas / 4); 
    const anos = Math.floor(meses / 12); 

    let resultado = '';

    if (anos > 0) {
        resultado = `${anos} ${anos === 1 ? 'ano' : 'anos'} atrás`;
    } else if (meses > 0) {
        resultado = `${meses} ${meses === 1 ? 'mês' : 'meses'} atrás`;
    } else if (semanas > 0) {
        resultado = `${semanas} ${semanas === 1 ? 'semana' : 'semanas'} atrás`;
    } else if (dias > 0) {
        resultado = `${dias} ${dias === 1 ? 'dia' : 'dias'} atrás`;
    } else if (horas > 0) {
        resultado = `${horas} ${horas === 1 ? 'hora' : 'horas'} atrás`;
    } else if (minutos > 0) {
        resultado = `${minutos} ${minutos === 1 ? 'minuto' : 'minutos'} atrás`;
    } else {
        resultado = `${segundos} ${segundos === 1 ? 'segundo' : 'segundos'} atrás`;
    }
    return resultado;
}

