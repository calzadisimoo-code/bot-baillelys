const { obtenerVariante } = require("../estadisticas/ab");

module.exports = function (usuario) {

    return obtenerVariante("enviofotos", usuario, {

A: `📸 ¡Claro! Ya mismo te envío las fotos. 😊

👀 ¿Sí eran las que estabas buscando?`,

B: `🤩 ¡Con gusto! Aquí tienes las fotos.

💬 ¿Qué te parecieron?`,

C: `🔥 Ya te envío las fotos.

👟 ¿Te gustaron?`,

D: `📷 Aquí están las fotos del producto.

✨ ¿Cuál fue la que más te gustó?`,

E: `😊 Perfecto, aquí tienes las fotos.

👀 ¿Te las llevarías en ese modelo?`,

F: `📸 ¡Listo! Ya te envié las fotos. 😊

🚚 ¿Prefieres recoger en el local o recibirlas por envío?

📍 Dime tu barrio o ciudad y te digo cómo te las hacemos llegar.`

    });

};