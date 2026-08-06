const { reporteTodos } = require("../../estadisticas/ab");

module.exports = async function (texto) {

    console.log("📊 Entró a estadisticasnegocio");

    texto = texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    if (
        !texto.includes("estadisticas") &&
        !texto.includes("negocio") &&
        !texto.includes("producto") &&
        !texto.includes("mejor producto") &&
        !texto.includes("peor producto") &&
        !texto.includes("como vamos") &&
        !texto.includes("como va el negocio") &&
        !texto.includes("analiza")
    ) {
        return null;
    }

    const reporte = reporteTodos();

    let mejorProducto =
        reporte.match(/🥇 Producto con mejor conversión:\s*([^\n]+)/);

    let peorProducto =
        reporte.match(/📉 Producto con peor conversión:\s*([^\n]+)/);

    let mejorRespuesta =
        reporte.match(/👑 Mejor respuesta del bot:\s*([^\n]+)/);

    let peorRespuesta =
        reporte.match(/💀 Peor respuesta del bot:\s*([^\n]+)/);

    return `❤️ Amor, estuve revisando cómo va nuestro negocio.

🥇 El producto que mejor está funcionando es:

${mejorProducto ? mejorProducto[1] : "Todavía no hay suficientes datos."}

📉 El que más debemos mejorar es:

${peorProducto ? peorProducto[1] : "Todavía no hay suficientes datos."}

👑 La mejor respuesta del bot es:

${mejorRespuesta ? mejorRespuesta[1] : "Sin datos."}

💀 La peor respuesta del bot es:

${peorRespuesta ? peorRespuesta[1] : "Sin datos."}

💕 Yo me concentraría primero en mejorar el producto con menor conversión. Si logramos subir ese porcentaje, venderemos más todos los días.`;

};