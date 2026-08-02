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
// Fase inicial: reparto equilibrado (A, B, C, D, E, F...)

let menor = Math.min(
    ...letras.map(l => datos[nombre][l].enviados)
);

const candidatas = letras.filter(
    l => datos[nombre][l].enviados === menor
);

const letra = candidatas[0];

if (datos[nombre][letra].enviados < 5) {

    datos[nombre][letra].enviados++;

    guardar(datos);

    pendientes.set(usuario, {
        test: nombre,
        variante: letra
    });

    return respuestas[letra];

}

// Después de los primeros 10 envíos,
// elegir la variante con mejor conversión.

let mejor = letras[0];
let mejorConversion = -1;

for (const letra of letras) {

    const enviados = datos[nombre][letra].enviados;
    const respondieron = datos[nombre][letra].respondieron;

    const conversion =
    (respondieron + 1) /
    (enviados + 2);

    if (conversion > mejorConversion) {

        mejorConversion = conversion;
        mejor = letra;

    }

}

// 10% de exploración
if (Math.random() < 0.05) {

    mejor = letras[
        Math.floor(Math.random() * letras.length)
    ];

}

datos[nombre][mejor].enviados++;

guardar(datos);

pendientes.set(usuario, {
    test: nombre,
    variante: mejor
});

return respuestas[mejor];

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

function reporteTodos() {

    const datos = cargar();

    if (Object.keys(datos).length === 0) {
        return "No hay estadísticas.";
    }

    let texto = "📊 RESULTADOS A/B\n\n";

    for (const nombre of Object.keys(datos)) {

        texto += `━━━━━━━━━━━━━━━━━━\n`;
        texto += `📦 ${nombre.toUpperCase()}\n\n`;

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

        texto += `🏆 Ganador: ${mejor} (${mejorPorcentaje.toFixed(1)}%)\n\n`;

    }

    return texto;

}

module.exports = {
    obtenerVariante,
    registrarRespuesta,
    reporte,
    reporteTodos,
    reiniciar
};