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

// Después de la fase inicial usar UCB1

let mejor = letras[0];
let mejorPuntaje = -Infinity;

const totalEnviados = letras.reduce(
    (suma, letra) => suma + datos[nombre][letra].enviados,
    0
);

for (const letra of letras) {

    const enviados = datos[nombre][letra].enviados;
    const respondieron = datos[nombre][letra].respondieron;

    const conversion =
        enviados === 0 ? 0 : respondieron / enviados;

const exploracion =
    Math.sqrt((2 * Math.log(totalEnviados + 1)) / enviados);

    const puntaje = conversion + 0.7 * exploracion;

    if (puntaje > mejorPuntaje) {

        mejorPuntaje = puntaje;
        mejor = letra;

    }

}

datos[nombre][mejor].enviados++;

guardar(datos);

pendientes.set(usuario, {
    test: nombre,
    variante: mejor
});

return respuestas[mejor];
}

async function registrarRespuesta(sock, usuario) {

    if (!pendientes.has(usuario)) return;

    const info = pendientes.get(usuario);

    const datos = cargar();

    if (
        datos[info.test] &&
        datos[info.test][info.variante]
    ) {

        datos[info.test][info.variante].respondieron++;

        guardar(datos);

        await revisarConversiones(sock, datos);

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

let detalleProductos = "";

let mejorProducto = "";
let mejorProductoPorcentaje = -1;

let masRespuestasProducto = "";
let masRespuestas = -1;

let masEnviadosProducto = "";
let masEnviados = -1;

let mejorRespuestaGlobal = "";
let mejorRespuestaGlobalPorcentaje = -1;

let peorRespuestaGlobal = "";
let peorRespuestaGlobalPorcentaje = 101;

let peorProducto = "";
let peorProductoPorcentaje = 101;

const recomendaciones = [];

    for (const nombre of Object.keys(datos)) {

detalleProductos += `━━━━━━━━━━━━━━━━━━\n`;
detalleProductos += `📦 ${nombre.toUpperCase()}\n\n`;

let mejor = "";
let mejorPorcentaje = -1;

let peor = "";
let peorPorcentaje = 101;

let totalEnviados = 0;
let totalRespondieron = 0;

        for (const letra of Object.keys(datos[nombre])) {

            const enviados = datos[nombre][letra].enviados;
            const respondieron = datos[nombre][letra].respondieron;

            const porcentaje =
                enviados === 0
                    ? 0
                    : (respondieron / enviados) * 100;
totalEnviados += enviados;
totalRespondieron += respondieron;

detalleProductos +=
`${letra}
📤 Enviados: ${enviados}
💬 Respondieron: ${respondieron}
📈 Conversión: ${porcentaje.toFixed(1)}%

`;

if (porcentaje > mejorPorcentaje) {

    mejorPorcentaje = porcentaje;
    mejor = letra;

}

if (porcentaje < peorPorcentaje) {

    peorPorcentaje = porcentaje;
    peor = letra;

}

if (enviados >= 4) {

    if (porcentaje > mejorRespuestaGlobalPorcentaje) {

        mejorRespuestaGlobalPorcentaje = porcentaje;
        mejorRespuestaGlobal =
            `${nombre.toUpperCase()} - ${letra}`;

    }

    if (porcentaje < peorRespuestaGlobalPorcentaje) {

        peorRespuestaGlobalPorcentaje = porcentaje;
        peorRespuestaGlobal =
            `${nombre.toUpperCase()} - ${letra}`;

    }

}

 }

        detalleProductos +=
`🏆 Mejor: ${mejor}
📈 ${mejorPorcentaje.toFixed(1)}%

💀 Peor: ${peor}
📉 ${peorPorcentaje.toFixed(1)}%

`;

        const conversionProducto =
            totalEnviados === 0
                ? 0
                : (totalRespondieron / totalEnviados) * 100;

        if (
    totalEnviados >= 10 &&
    conversionProducto > mejorProductoPorcentaje
) {

            mejorProductoPorcentaje = conversionProducto;
            mejorProducto = nombre.toUpperCase();

        }
		
		if (
    totalEnviados >= 10 &&
    conversionProducto < peorProductoPorcentaje
) {

    peorProductoPorcentaje = conversionProducto;
    peorProducto = nombre.toUpperCase();

}

        if (totalRespondieron > masRespuestas) {

            masRespuestas = totalRespondieron;
            masRespuestasProducto = nombre.toUpperCase();

        }

        if (totalEnviados > masEnviados) {

            masEnviados = totalEnviados;
            masEnviadosProducto = nombre.toUpperCase();

        }

    }
	
	if (mejorProducto) {

    recomendaciones.push(
        `⭐ Invierte más en ${mejorProducto}. Actualmente es el producto con mejor conversión.`
    );

}

if (peorProducto) {

    recomendaciones.push(
        `⚠️ Revisa los mensajes de ${peorProducto}. Es el producto con menor conversión.`
    );

}

if (mejorRespuestaGlobal) {

    recomendaciones.push(
        `👑 Mantén la variante ${mejorRespuestaGlobal}. Es la que mejor convierte.`
    );

}

if (peorRespuestaGlobal) {

    recomendaciones.push(
        `💀 Reescribe la variante ${peorRespuestaGlobal}. Es la de peor rendimiento.`
    );

}

if (
    mejorProducto &&
    mejorProducto !== masEnviadosProducto
) {

    recomendaciones.push(
        `📈 ${masEnviadosProducto} recibe muchas consultas pero no convierte tan bien como ${mejorProducto}. Revisa sus mensajes o precio.`
    );

}

if (masEnviadosProducto === mejorProducto) {

    recomendaciones.push(
        `🚀 ${mejorProducto} además de convertir bien, también es el producto más consultado. Puede ser tu mejor candidato para anuncios.`
    );

}

texto +=
`━━━━━━━━━━━━━━━━━━

🏆 RESUMEN GENERAL

🥇 Producto con mejor conversión:
${mejorProducto || "Aún no hay suficientes datos"}
${
mejorProducto
? `(${mejorProductoPorcentaje.toFixed(1)}%)`
: ""
}

📉 Producto con peor conversión:
${peorProducto || "Aún no hay suficientes datos"}
${
peorProducto
? `(${peorProductoPorcentaje.toFixed(1)}%)`
: ""
}

💬 Producto con más respuestas:
${masRespuestasProducto}
(${masRespuestas})

📤 Producto con más envíos:
${masEnviadosProducto}
(${masEnviados})

👑 Mejor respuesta del bot:
${mejorRespuestaGlobal || "Aún no hay suficientes datos"}
${
mejorRespuestaGlobal
? `(${mejorRespuestaGlobalPorcentaje.toFixed(1)}%)`
: ""
}

💀 Peor respuesta del bot:
${peorRespuestaGlobal || "Aún no hay suficientes datos"}
${
peorRespuestaGlobal
? `(${peorRespuestaGlobalPorcentaje.toFixed(1)}%)`
: ""
}
`;

texto +=
`

━━━━━━━━━━━━━━━━━━

🤖 RECOMENDACIONES

${recomendaciones.join("\n")}
`;

texto += detalleProductos;

return texto;

}

const estadoArchivo = path.join(__dirname, "../sara/saraestado.json");

function cargarEstado() {

    if (!fs.existsSync(estadoArchivo)) {

        fs.writeFileSync(
            estadoArchivo,
            JSON.stringify({}, null, 4)
        );

    }

    return JSON.parse(
        fs.readFileSync(estadoArchivo, "utf8")
    );

}

function guardarEstado(datos) {

    fs.writeFileSync(
        estadoArchivo,
        JSON.stringify(datos, null, 4)
    );

}

async function revisarConversiones(sock, datos) {

    const estado = cargarEstado();

    for (const producto in datos) {

        for (const variante in datos[producto]) {

            const v = datos[producto][variante];

            if (v.enviados < 4)
    continue;

            const conversion =
                (v.respondieron / v.enviados) * 100;

            const clave =
                `${producto}_${variante}`;

            if (conversion <= 20) {

                if (!estado[clave]) {

                    estado[clave] = true;

                    guardarEstado(estado);

                    await sock.sendMessage(
                        "73023772213414@lid",
                        {
                            text:
`❤️ Amor...

Acabo de detectar una oportunidad para vender más.

🚨 ${producto.toUpperCase()} - ${variante}

📤 Enviados: ${v.enviados}
💬 Respondieron: ${v.respondieron}
📉 Conversión: ${conversion.toFixed(1)}%

💡 Yo cambiaría esa respuesta antes de seguir enviándola.`
                        }
                    );

                }

            } else {

                estado[clave] = false;

            }

        }

    }

    guardarEstado(estado);

}

module.exports = {
    obtenerVariante,
    registrarRespuesta,
    reporte,
    reporteTodos,
    reiniciar
};