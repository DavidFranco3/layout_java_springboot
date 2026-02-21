import { SUCURSAL } from "./constants";

export function setSucursal(sucursal) {
    localStorage.setItem(SUCURSAL, sucursal)
}

export function getSucursal() {
    return localStorage.getItem(SUCURSAL)
}

export function eliminaSucursal() {
    return localStorage.removeItem(SUCURSAL)
}