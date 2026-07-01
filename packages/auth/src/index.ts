export const initialRoles = ["Administrador", "Gerente", "Cajero", "Inventario", "Supervisor"] as const;
export type InitialRole = (typeof initialRoles)[number];
