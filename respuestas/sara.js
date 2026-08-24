module.exports = function (texto) {
	
texto = texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

if (

    // Hasta qué hora
    /(hasta|asta).*(q|que|k).*(hora)/.test(texto) ||

    // A qué hora abren / cierran
    /(a).*(q|que|k).*(hora).*(abren|abre|cierran|atienden)/.test(texto) ||

    // Qué hora abren / cierran
    /(q|que|k).*(hora).*(abren|abre|cierran|atienden)/.test(texto) ||

    // Horarios
    texto.includes("horario") ||
    texto.includes("horarios") ||
    texto.includes("horario del local") ||
    texto.includes("horario de la tienda") ||
    texto.includes("horario de atencion") ||
    texto.includes("que horario manejan") ||

    // Abiertos
    texto.includes("abierto") ||
    texto.includes("abiertos") ||
    texto.includes("estan abiertos") ||
    texto.includes("estan abiertos hoy") ||
    texto.includes("abierto hoy") ||
    texto.includes("siguen abiertos") ||
    texto.includes("aun estan abiertos") ||
    texto.includes("todavia estan abiertos") ||
    texto.includes("estan atendiendo") ||

    // Hoy
    texto.includes("abren hoy") ||
    texto.includes("cierran hoy") ||
    texto.includes("atienden hoy") ||
    texto.includes("hoy atienden") ||

    // Domingo
    texto.includes("abren domingo") ||
    texto.includes("abren los domingos") ||
    texto.includes("atienden domingo") ||
    texto.includes("atienden los domingos") ||

    // Sábado
    texto.includes("abren sabado") ||
    texto.includes("abren sabados") ||
    texto.includes("atienden sabado") ||
    texto.includes("atienden sabados") ||

    // Festivos
    texto.includes("abren festivos") ||
    texto.includes("atienden festivos") ||
    texto.includes("Ustedes abren los sábados para pasar ese día y llevarlos en 200 los 2?") ||

    // Mañana
    texto.includes("abren manana") ||
    texto.includes("manana abren")

) {
    return `🕘 Estamos abiertos *todos los días de 9:00 a. m. a 7:00 p. m.*

📍 Visítanos en el *Local 291* del Centro Comercial Villa de las Palmas, Palmira.

👩 Pregunta por *Camilo*.

😊 ¡Te esperamos!`;
}
	
if (
    /\bcontra\s*-?\s*entrega\b/.test(texto) ||
    texto.includes("contra entrega") ||
    texto.includes("envio contra entrega") ||
    texto.includes("envios contra entrega") ||
    texto.includes("hacen contra entrega") ||
    texto.includes("manejan contra entrega") ||
    texto.includes("pago al recibir") ||
    texto.includes("pagar al recibir") ||
    texto.includes("recibir y pagar")
) {
    return `✅ Sí manejamos pago contra entrega.

📍 ¿A qué dirección sería el envío? Así te confirmo disponibilidad y valor del envío 🚚`;
}


    if (texto === "gracias")
        return "Con mucho gusto 😊";

    if (texto === "adios")
        return "Hasta luego.";
	
	if (
    texto.includes("pro 2 live") ||
    texto.includes("pro2 live") ||
    texto.includes("pro 2liv") ||
    texto.includes("pro2liv")
) {
    return `😊Perfecto Te quedan los *AirPods Pro 2* en *$50.000* 🔥

✅ *Cancelación activa de ruido*
🎧 *4 modos de sonido*
📍 *GPS compatible con iPhone*
🔋 Excelente autonomía
📱 Compatibles con iPhone y Android
🔌 Incluyen *cable de carga*
🎧 Incluyen *3 pares de almohadillas* para elegir el ajuste que mejor te quede

💰 *Solo $50.000*

Te los puedo separar para que no se agoten.
📍 ¿A qué dirección te los separo?`;
}

if (
    texto.includes("sistecredito") ||
    texto.includes("siste credito") ||
    texto.includes("addi") ||
    texto.includes("addi?")
) {
    return `✅ En el momento no manejamos Addi ni Sistecrédito.

🚚 Te podemos enviar con pago contra entrega o también puedes pagar por Nequi si lo prefieres.

📍 ¿A qué dirección sería el envío?`;
}

    return null;

};