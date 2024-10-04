import { diasDto, pagoDto, transferenciaDTO } from 'dtos';
import express from 'express';

import { fetchSaldo, getDestinatarioId, getPromocion, getPromocionDias, getPromocionPago, postPago, postTransferencias, putCliente } from '../server/api';


export const postMovimiento = async (req: express.Request, res: express.Response) => {
    try {
        const remitente_id = parseInt(req.params.remitente_id);

        const { destinatario_numero, monto, descripcion } = req.body;

        const saldo_remitente = await fetchSaldo(remitente_id);
        
        if (saldo_remitente < monto) {
            res.status(400).json({
                message: "Saldo insuficiente"
            })
        } 
        
        const destinatario_id = await getDestinatarioId(destinatario_numero);

        const data: transferenciaDTO = {
            remitente_id, 
            destinatario_id,
            monto,
            descripcion
        };

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
        let codigo;
        const promocion_id = parseInt(req.params.promocion_id);
        console.log(req.params)

        const { remitente_id} = req.body;

        const data = await getPromocionPago(promocion_id);

        const saldo_remitente = await fetchSaldo(remitente_id);

        const currentDate = new Date();

        const monto = data.precio - data.precio * data.descuento / 100;
        if (data.dia_final && currentDate.getTime() > data.dia_final.getTime()) {
            res.status(404).json({
                message: "La promocion está vencida",
            });
        } else if (saldo_remitente < monto) {
            res.status(404).json({
                message: "El saldo es insuficiente"
            }) 
        } else {
            const pago: pagoDto = {
                remitente_id: remitente_id,
                destinatario_id: data.tienda_id,
                monto: monto,
                producto_id: data.producto_id
            }
            const transferencia: transferenciaDTO = {
                remitente_id: remitente_id,
                destinatario_id: data.tienda_id,
                monto: monto,
            }
            codigo = await postPago(pago);
            await putCliente(transferencia);
        }
        return codigo;
    }
    catch {

    }    
}
