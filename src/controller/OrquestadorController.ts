import { diasDto, pagoDto, transferenciaDTO } from 'dtos';
import express from 'express';

import { fetchSaldo, getDestinatarioId, getPromocion, getPromocionDias, getPromocionPago, postPago, postTransferencias, putCliente, putCliente2 } from '../server/api';

export const postMovimiento = async (req: express.Request, res: express.Response) => {
    try {
        const remitente_id = parseInt(req.params.remitente_id);
        const { destinatario_numero, monto, descripcion } = req.body;

        // Verificamos el saldo del remitente
        let saldo_remitente;
        try {
            saldo_remitente = await fetchSaldo(remitente_id);
        } catch (error) {
            return res.status(500).json({
                message: "Error obteniendo el saldo del remitente",
                error: error.message
            });
        }

        if (saldo_remitente < monto) {
            return res.status(400).json({
                message: "Saldo insuficiente"
            });
        }

        // Obtenemos el ID del destinatario
        let destinatario_id;
        try {
            destinatario_id = await getDestinatarioId(destinatario_numero);
        } catch (error) {
            return res.status(500).json({
                message: "Error obteniendo el ID del destinatario",
                error: error.message
            });
        }

        const data0: transferenciaDTO = {
            destinatario_id,
            monto,
        };

        const data: transferenciaDTO = {
            remitente_id,
            destinatario_id,
            monto,
            descripcion
        };

        // Realizamos la transferencia
        console.log(data)
        try {
            await postTransferencias(data);
        } catch (error) {
            return res.status(500).json({
                message: "Error al realizar la transferencia",
                error: error.message
            });
        }

        // Actualizamos el cliente
        try {
            await putCliente2(data0, remitente_id);
        } catch (error) {
            return res.status(500).json({
                message: "Error actualizando la información del cliente",
                error: error.message
            });
        }

        // Si todo salió bien, enviamos la respuesta
        res.status(200).json({
            message: "Movimiento creado exitosamente",
            data
        });
        
    } catch (error) {
        res.status(500).json({
            message: "Error procesando el movimiento",
            error: error.message
        });
    }
};

export const postPagoPromocion = async (req: express.Request, res: express.Response) => {
    try {
        let codigo;
        const promocion_id = parseInt(req.params.promocion_id);
        const { remitente_id } = req.body;

        // Obtener detalles de la promoción
        let data;
        try {
            data = await getPromocionPago(promocion_id);
        } catch (error) {
            return res.status(500).json({
                message: "Error obteniendo los detalles de la promoción",
                error: error.message
            });
        }

        // Obtener saldo del remitente
        let saldo_remitente;
        try {
            saldo_remitente = await fetchSaldo(remitente_id);
        } catch (error) {
            return res.status(500).json({
                message: "Error obteniendo el saldo del remitente",
                error: error.message
            });
        }

        const currentDate = new Date();
        const monto = data.precio - data.precio * data.descuento / 100;
        const diaFinalDate = new Date(data.dia_final);

        // Validar si la promoción está vencida
        if (data.dia_final && currentDate.getTime() > diaFinalDate.getTime()) {
            return res.status(404).json({
                message: "La promoción está vencida",
            });
        }

        // Validar si el saldo es suficiente
        if (saldo_remitente < monto) {
            return res.status(404).json({
                message: "El saldo es insuficiente"
            });
        }

        const pago: pagoDto = {
            remitente_id: remitente_id,
            destinatario_id: data.tienda_id,
            monto: monto,
            producto_id: data.producto_id
        };

        const transferencia: transferenciaDTO = {
            remitente_id: remitente_id,
            destinatario_id: data.tienda_id,
            monto: monto,
        };

        // Realizar el pago
        try {
            await postPago(pago);
        } catch (error) {
            return res.status(500).json({
                message: "Error al realizar el pago",
                error: error.message
            });
        }

        // Actualizar el cliente
        try {
            await putCliente(transferencia);
        } catch (error) {
            return res.status(500).json({
                message: "Error actualizando la información del cliente",
                error: error.message
            });
        }

        // Respuesta en caso de éxito
        res.status(200).json({
            message: "Pago realizado exitosamente"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error procesando el pago",
            error: error.message
        });
    }
};
