const { obtener } = require("../estado");
const {
    registrarFotos
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    const estado = obtener(usuario);

    if (!estado?.producto) {
        return null;
    }

    const mensaje = texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    const patrones = [

        // Solicitudes directas
        /^foto$/,
        /^fotos$/,
        /^mas fotos$/,
        /^mas foto$/,
        /^enviame fotos$/,
        /^envie fotos$/,
        /^manda fotos$/,
        /^mandame fotos$/,
        /^muestrame fotos$/,
        /^mostrar fotos$/,
        /^quiero ver fotos$/,
        /^puedo ver fotos$/,

        // Variantes comunes
        /ver fotos/,
        /ver mas fotos/,
        /tienes fotos/,
        /me muestras fotos/,
        /me mandas fotos/,
        /enviame unas fotos/,
        /quiero ver el producto/,
        /quiero ver los tenis/,
        /quiero ver las zapatillas/
    ];

    const pideFotos = patrones.some(p =>
        p instanceof RegExp
            ? p.test(mensaje)
            : mensaje === p
    );

    if (!pideFotos) {
        return null;
    }

    registrarFotos(usuario);

    return `IMG_${estado.producto}`;
};