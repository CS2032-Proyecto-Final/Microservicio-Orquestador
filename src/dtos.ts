export interface transferenciaDTO {
    remitente_id ?: number,
    destinatario_numero: number, 
    monto: number,
    descripcion: string
}

export interface diasDto {
    dia_inicio : Date, 
    dia_final : Date
}

export interface pagoDto {
    remitente_id : number,
    destinatario_numero: number, 
    monto: number,
    descripcion: string,
    codigo : string,
}