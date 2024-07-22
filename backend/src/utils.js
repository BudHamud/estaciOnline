import { MercadoPagoConfig, Payment } from "mercadopago";
import 'dotenv/config'

const client = new MercadoPagoConfig({ accessToken: process.env.MP_TOKEN });
const payments = new Payment(client);

export { client, payments }