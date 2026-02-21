// resources/js/utils/Color.js
export function isColorDark(hexColor) {
    if (!hexColor) return false;

    // Quitar el # si existe
    const hex = hexColor.replace("#", "");

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Fórmula de luminancia
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance < 0.5; // true si es oscuro
}


export const getContrasteColor = (hexColor) => {
    if (!hexColor) return "#000000"; // Por defecto fondo oscuro

    // Limpiar el símbolo '#' si existe
    const color = hexColor.replace("#", "");

    // Verificar si es un código válido de 6 dígitos
    if (color.length !== 6) return "#000000";

    // Convertir a valores RGB
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    // Calcular luminancia (percepción de claridad)
    const luminancia = 0.299 * r + 0.587 * g + 0.114 * b;

    // Si es muy clara, usar texto oscuro; si es oscura, usar texto claro
    return luminancia > 150 ? "#000000" : "#ffffff";
};



export function suavizarColor(hex, intensidad = 0.85) {
    if (!hex) return "#f5f5f5"; // fallback ultra claro
    const color = hex.replace("#", "");

    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    // Mezclar con gris casi blanco (muy mate)
    const grisMate = 245; // casi blanco pero no 255

    const suavizadoR = Math.round(r + (grisMate - r) * intensidad);
    const suavizadoG = Math.round(g + (grisMate - g) * intensidad);
    const suavizadoB = Math.round(b + (grisMate - b) * intensidad);

    return `rgb(${suavizadoR}, ${suavizadoG}, ${suavizadoB})`;
}

/**
 * Ajusta la luminosidad de un color hex.
 * @param {string} date - Color hex (#RRGGBB)
 * @param {number} amount - Cantidad a ajustar (-1.0 a 1.0). Positivo aclara, negativo oscurece.
 */
export function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

// Versión más robusta usando manipulación RGB
export function shadeColor(color, percent) {
    if (!color) return "#ffffff";
    var f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}



