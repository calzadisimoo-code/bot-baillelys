const sara = require("./sara");
const catalogo = require("./catalogo");
const direccion = require("./direccion");
const envio = require("./envio");
const carg67w = require("./carg67w");
const af1bi = require("./af1bi");
const paris = require("./paris");
const talla = require("./talla");
const fotos = require("./fotos");
const pro4 = require("./pro4");
const af1ni = require("./af1ni");
const carg120w = require("./carg120w");
const af1b50 = require("./af1b50");
const af1b = require("./af1b");
const r4bd = require("./r4bd");
const pago = require("./pago");
const saludo = require("./saludo");

module.exports = function (texto, usuario) {

    if (typeof texto !== "string") {
        return null;
    }

texto = texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

return (
    // Funciones generales
    saludo(texto, usuario) ||
    catalogo(texto, usuario) ||
    envio(texto, usuario) ||
    direccion(texto, usuario) ||

    // Productos
    carg67w(texto, usuario) ||
    carg120w(texto, usuario) ||

    af1bi(texto, usuario) ||
    af1ni(texto, usuario) ||
    r4bd(texto, usuario) ||
    af1b50(texto, usuario) ||
    af1b(texto, usuario) ||

    paris(texto, usuario) ||
    pro4(texto, usuario) ||

    // Después del producto
    talla(texto, usuario) ||
    fotos(texto, usuario) ||
    pago(texto, usuario) ||

    // Respuestas generales
    sara(texto)
);
};