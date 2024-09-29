import { diasDto, pagoDto, transferenciaDTO } from 'dtos';
import express from 'express';

import { fetchSaldo, getPromocion, getPromocionDias, postPago, postTransferencias, putCliente } from 'server/api';



export const postMovimiento = async (req: express.Request, res: express.Response) => {
    try {
        const remitente_id = parseInt(req.params.remitente_numero);

        const { destinatario_numero, monto, descripcion } = req.body;

        const data: transferenciaDTO = {
            remitente_id, 
            destinatario_numero,
            monto,
            descripcion
        };

        const saldo_remitente = await fetchSaldo(data.remitente_id);
        
        if (saldo_remitente < monto) {
            res.status(400).json({
                message: "Saldo insuficiente"
            })
        } 

        await postTransferencias(data);

        await putCliente(data);
            
            
        // Send some response (adjust as needed)
        res.status(200).json({
            message: "Movimiento created successfully",
            data
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating movimiento",
            error: error.message
        });
    }
};

export const postPagoPromocion = async (req: express.Request, res: express.Response) => {

    try {
        const promocion_id = parseInt(req.params.id);

        const { remitente_id, destinatario_numero, monto, descripcion, codigo  } = req.body;

        const data: pagoDto  = {
            remitente_id, 
            destinatario_numero,
            monto, 
            descripcion, 
            codigo
        }
        const put : transferenciaDTO = {
            remitente_id, 
            destinatario_numero, 
            monto,
            descripcion
        }

        const tienda_id = await getPromocion(promocion_id);

        const saldo = await fetchSaldo(remitente_id);

        const dias: diasDto = await getPromocionDias(promocion_id);
        
        await postPago(data);

        await putCliente(put);

    }
    catch {

    }    
}
