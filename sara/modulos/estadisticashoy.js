const { reporteHoy } = require("../../estadisticas/hoy");

module.exports = async function (texto) {

    texto = texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    if (

        !texto.includes("cuanta gente escribio hoy") &&
        !texto.includes("cuanta gente ha escrito hoy") &&
        !texto.includes("cuantas personas escribieron hoy") &&
        !texto.includes("cuantos escribieron hoy") &&
        !texto.includes("estadisticas de hoy") &&
        !texto.includes("como va hoy")

    ) {
        return null;
    }

    return `❤️ Amorcito, estas son las estadísticas de hoy:

${reporteHoy()}

💕 Seguimos trabajando para vender muchísimo.`;
};