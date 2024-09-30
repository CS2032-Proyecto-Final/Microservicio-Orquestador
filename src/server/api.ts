import axios from 'axios';

import { diasDto, pagoDto, transferenciaDTO } from '../dtos';

const MP_URL: string = "http://localhost:8002";
const MM_URL: string = "http://localhost:8000";
const MC_URL: string = "http://localhost:8080";

export const fetchSaldo = async (remitente_id: number): Promise<number | undefined> => {
    try {
        const res = await axios.get(`${MC_URL}/cliente`, {
            params: {
                remitente_id 
            }
        });

        return res.data.saldo_remitente;
    } catch (error) {
        console.error("Error fetching saldo:", error);
        return undefined; 
    }
};

export const postTransferencias = async( data: transferenciaDTO): Promise<void> => {
    console.log(data);
    try {
        await axios.post(MM_URL+'/transferencias', data)

    } catch (error) {
        console.error(error);
    }
}

export const putCliente = async (data: transferenciaDTO): Promise<void> => {
    try {
        await axios.put(`${MC_URL}/cliente/${data.remitente_id}/monto`, data);

    } catch (error) {
        console.error(error);
    }
}

export const getPromocion = async (promocion_id : number): Promise<number> => {
    try {
        const res = await axios.get(`${MP_URL}/promocion/${promocion_id}/tienda`);
        return res.data.tienda_id;
    } catch (error) {
        console.error(error);
    }
}

export const getPromocionDias = async (promocion_id: number): Promise<diasDto | null> => {
    try {
        const response = await axios.get(`${MP_URL}/promocion/${promocion_id}/dias`);

        const { dia_inicio, dia_final } = response.data;

        return {
            dia_inicio: new Date(dia_inicio), 
            dia_final: dia_final ? new Date(dia_final) : null, 
        };
    } catch (error) {
        console.error('Error fetching promocion dias:', error);
        return null; // Handle errors and return null if any
    }
};

export const postPago = async ( data: pagoDto): Promise<number> => {
    try {
        const codigo = await axios.post(MM_URL+'/pagos', data);
        return codigo.data;
    } catch (error){
        console.error();
    }
}

export const getDestinatarioId = async ( destinatario_numero : number): Promise<number> => {
    try {
        const response = await axios.get(`${MC_URL}/persona/telefono/${destinatario_numero}`)
        return response.data.id;
    } catch (error) {
        console.error(error);
    }
}


export const getPromocionPago = async (promocion_id :number ) => {
    try {
        const response = await axios.get(`${MP_URL}/promocion/${promocion_id}/pago`);
        return response.data;
    } catch (error) {
        console.error(error);
    }


}



