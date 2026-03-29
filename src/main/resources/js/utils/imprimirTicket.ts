import qz from 'qz-tray';

export const imprimirTicket = async (productos, mesa) => {
    try {
        if (!productos || productos.length === 0 || !mesa) {
            console.error("No hay datos para imprimir.");
            return;
        }

        // Asegura conexión con QZ Tray
        if (!qz.websocket.isActive()) {
            await qz.websocket.connect();
        }

        // Establece la impresora por defecto
        const impresoras = await qz.printers.find();
        await qz.printers.set(impresoras); // Usa la predeterminada

        const fecha = new Date().toLocaleString();
        const linea = "------------------------------------------";
        const encabezado = `
            <h3 style="text-align:center;margin:0;">RESTAURANTE</h3>
            <p style="text-align:center;margin:0;">Ticket Mesa ${mesa.numero}</p>
            <p style="text-align:center;margin:0;">${fecha}</p>
            <p>${linea}</p>
        `;

        const cuerpo = productos.map(p => `
            <div style="display:flex;justify-content:space-between;font-size:12px;">
                <span>${p.cantidad} x ${p.nombre}</span>
                <span>$${(p.precio * p.cantidad).toFixed(2)}</span>
            </div>
        `).join("");

        const total = productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0).toFixed(2);

        const pie = `
            <p>${linea}</p>
            <div style="text-align:right;"><strong>Total: $${total}</strong></div>
            <p style="text-align:center;">¡Gracias por su compra!</p>
        `;

        const htmlTicket = `
            <div style="font-family:monospace;width:250px;">
                ${encabezado}
                ${cuerpo}
                ${pie}
            </div>
        `;

        await qz.printHTML({
            html: htmlTicket,
            options: {
                pageWidth: "75mm",
                pageHeight: "auto",
                margins: { top: 0, right: 0, bottom: 0, left: 0 }
            }
        });

        console.log("Ticket enviado a impresión");
    } catch (error) {
        console.error("Error al imprimir el ticket:", error);
        alert("Error al imprimir el ticket: " + error.message);
    }
};
