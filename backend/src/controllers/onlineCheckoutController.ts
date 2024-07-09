import asyncHandler from 'express-async-handler';
import e, { RequestHandler } from "express";
import axios from 'axios';
import cryptoJS from 'crypto-js';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import Payment from '../models/Payment';
import Order from '../models/Order';

const createPayment: RequestHandler = asyncHandler(async (req: any, res: any): Promise<any> => {
    try {
        const { orderId, amount } = req.body;
        var accessKey = 'F8BBA842ECF85';
        var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
        var orderInfo = 'pay with MoMo';
        var partnerCode = 'MOMO';
        // var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c60';
        var redirectUrl = `http://localhost:5173/order-confirmation?orderId=${orderId}`;
        var ipnUrl = 'https://a9a9-115-73-131-38.ngrok-free.app/api/momo/callback';
        var requestType = "captureWallet";
        var requestId = orderId;
        var extraData = '';
        var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
        var orderGroupId = '';
        var autoCapture = true;
        var lang = 'vi';

        //before sign HMAC SHA256 with format
        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
        //puts raw signature
        console.log("--------------------RAW SIGNATURE----------------")
        console.log(rawSignature)
        //signature
        const crypto = require('crypto');
        var signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');
        console.log("--------------------SIGNATURE----------------")
        console.log(signature)

        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature
        });

        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/create',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            },
            data: requestBody
        }
        let result;
        try {
            result = await axios(options);
            console.log('result', result.data)
            return res.status(200).json(result.data)
        } catch (error) {
            console.log(error);
            res.status(500).json('call api error.')
        }
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal server error.')
    }
});

const callback: RequestHandler = asyncHandler(async (req: any, res: any): Promise<any> => {
    console.log('gọi tới call back')
    console.log('call back', req.body);
    try {
        const checkPaymentStatus = req.body.resultCode;
        let status;
        if (checkPaymentStatus === 0) {
            status = "Paid";
            const order = await Order.findOneAndUpdate(
                { _id: req.body.orderId },
                { order_status_id: "666c24fef787959e8ad3c51c" }, 
                { new: true }
            );

            if (!order) {
                return res.status(400).json({ message: 'Order not found' });
            }
        } else {
            status = "Unpaid";
            return res.status(200).json({ message: 'Payment failed, order remains unpaid' });
        }

        const payment = await Payment.findOneAndUpdate(
            { order_id: req.body.orderId },
            { payment_status: status },
            { new: true }
        );

        if (!payment) {
            return res.status(400).json({ message: 'Payment not found' });
        }

        // res.status(200).json(payment);
        res.redirect("/order-confirmation");
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal server error.');
    }
});


const createPaymentZaloPay: RequestHandler = asyncHandler(async (req: any, res: any): Promise<any> => {
    try {
        const config = {
            appid: "554",
            key1: "8NdU5pG5R2spGHGhyO99HN1OhD8IQJBn",
            key2: "uUfsWgfLkRLzq6W2uNXTCxrfxs51auny",
            endpoint: "https://sandbox.zalopay.com.vn/v001/tpe/createorder"
        };

        const embeddata = {
            merchantinfo: "embeddata123"
        };

        const items = [{
            itemid: "knb",
            itemname: "kim nguyen bao",
            itemprice: 198400,
            itemquantity: 1
        }];

        const order: any = {
            appid: config.appid,
            apptransid: `${moment().format('YYMMDD')}_${uuidv4()}`, // mã giao dich có định dạng yyMMdd_xxxx
            appuser: "demo",
            apptime: Date.now(), // miliseconds
            item: JSON.stringify(items),
            embeddata: JSON.stringify(embeddata),
            amount: 50000,
            description: "ZaloPay Integration Demo",
            bankcode: "zalopayapp",
        };

        // appid|apptransid|appuser|amount|apptime|embeddata|item
        const data = config.appid + "|" + order.apptransid + "|" + order.appuser + "|" + order.amount + "|" + order.apptime + "|" + order.embeddata + "|" + order.item;
        order.mac = cryptoJS.HmacSHA256(data, config.key1).toString();

        const result = await axios.post(config.endpoint, null, { params: order });
        console.log('result', result.data)
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal server error.')
    }
})

const onlineCheckoutController = { createPayment, createPaymentZaloPay, callback }

export default onlineCheckoutController;