'server only';

import { env } from './env';
import { PinataSDK } from 'pinata';

export const pinata = new PinataSDK({
   pinataJwt: `${env.PINATA_JWT_TOKEN}`,
   pinataGateway: `${env.NEXT_PUBLIC_PINATA_GATEWAY_URL}`,
});
