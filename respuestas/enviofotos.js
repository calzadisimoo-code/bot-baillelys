const { obtenerVariante } = require("../estadisticas/ab");

module.exports = function (usuario) {

    return obtenerVariante("enviofotos", usuario, {

A: `📸 ¡Listo! Ya te envié las fotos. 😊

📍 Dime tu barrio o ciudad y te digo cómo te las hacemos llegar.`,

B: `🤩 ¡Con gusto! Aquí tienes las fotos.

💬 ¿Qué te parecieron?`,

C: `🔥 Ya te envío las fotos.

👟 ¿Te gustaron?`,

D: `📷 Aquí están las fotos del producto.

✨ ¿Cuál fue la que más te gustó?`,

E: `📸¡Listo! Ya te envié las fotos. 😊

🚚 ¿Prefieres recoger en el local o recibirlas por envío?`,

F: `📸 ¡Listo! Ya te envié las fotos. 😊

🚚 ¿Prefieres recoger en el local o recibirlas por envío?

📍 Dime tu barrio o ciudad y te digo cómo te las hacemos llegar.`

    });

};