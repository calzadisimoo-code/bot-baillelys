const fs = require("fs");
const path = require("path");

const archivo = path.join(__dirname, "datos.json");

function cargar() {
    if (!fs.existsSync(archivo)) {
        fs.writeFileSync(archivo, JSON.stringify({}, null, 4));
    }

    return JSON.parse(fs.readFileSync(archivo, "utf8"));
}

function guardar(datos) {
    fs.writeFileSync(archivo, JSON.stringify(datos, null, 4));
}

// Guarda qué variante recibió cada usuario
const pendientes = new Map();

function obtenerVariante(nombre, usuario, respuestas) {

    const datos = cargar();

    if (!datos[nombre]) {
        datos[nombre] = {};
    }

    const letras = Object.keys(respuestas);

    for (const letra of letras) {

        if (!datos[nombre][letra]) {

            datos[nombre][letra] = {
                enviados: 0,
                respondieron: 0
            };

        }

    }

    const letra = letras[Math.floor(Math.random() * letras.length)];

    datos[nombre][letra].enviados++;

    guardar(datos);

    pendientes.set(usuario, {
        test: nombre,
        variante: letra
    });

    return respuestas[letra];

}

function registrarRespuesta(usuario) {

    if (!pendientes.has(usuario)) return;

    const info = pendientes.get(usuario);

    const datos = cargar();

    if (
        datos[info.test] &&
        datos[info.test][info.variante]
    ) {

        datos[info.test][info.variante].respondieron++;

        guardar(datos);

    }

    pendientes.delete(usuario);

}

function reiniciar(nombre) {

    const datos = cargar();

    if (!datos[nombre]) return false;

    for (const variante in datos[nombre]) {

        datos[nombre][variante].enviados = 0;
        datos[nombre][variante].respondieron = 0;

    }

    guardar(datos);

    return true;

}
function reporte(nombre) {

    const datos = cargar();

    if (!datos[nombre]) {
        return "No hay estadísticas.";
    }

    let texto = `📊 RESULTADOS A/B ${nombre.toUpperCase()}\n\n`;

    let mejor = "";
    let mejorPorcentaje = -1;

    for (const letra of Object.keys(datos[nombre])) {

        const enviados = datos[nombre][letra].enviados;
        const respondieron = datos[nombre][letra].respondieron;

        const porcentaje =
            enviados === 0
                ? 0
                : (respondieron / enviados) * 100;

        texto +=
`${letra}
📤 Enviados: ${enviados}
💬 Respondieron: ${respondieron}
📈 Conversión: ${porcentaje.toFixed(1)}%

`;

        if (porcentaje > mejorPorcentaje) {
            mejorPorcentaje = porcentaje;
            mejor = letra;
        }

    }

    texto += `🏆 Ganador: ${mejor} (${mejorPorcentaje.toFixed(1)}%)`;

    return texto;

}

module.exports = {
    obtenerVariante,
    registrarRespuesta,
    reporte,
	reiniciar
};