'use strict';
const Redis = require("ioredis");

const { REDIS_HOST, REDIS_PORT, REDIS_TTL, REDIS_TIMEOUT, REDIS_PASSWORD } = process.env;

let redis:any;

///*****************************************************************************/
///*****************************************************************************/
///******************** base 64 encode and decode       ************************/
///*****************************************************************************/
///*****************************************************************************/

export const base64_encode = (data:any) => {
    return Buffer.from(data).toString('base64');
}

export const base64_decode = (data:any) => {
    return Buffer.from(data, 'base64').toString('ascii');
}

///*****************************************************************************/
///*****************************************************************************/
///******************** Create a Redis instance ********************************/
///*****************************************************************************/
///*****************************************************************************/

(async () => {
    redis = new Redis({
        host: REDIS_HOST,
        port: REDIS_PORT,
        commandTimeout: REDIS_TIMEOUT,
        password: REDIS_PASSWORD
    });
    redis.on("error", (err:any) => {
        console.log(err);
    });
})();

export async function getCache(key:any) {
    try {
        const cacheData = await redis.get(key);
        if (cacheData) {
            return cacheData
        }

    } catch (err) {
        throw new Error(err);
    }
}

// Set Redis cache Key with a given expiry
export function setCache(key:any, data:any, ttl = REDIS_TTL) {
    try {
        redis.set(key, JSON.stringify(data), "EX", ttl);
    } catch (err) {
        throw new Error(err);
    }
}

// Remove given Redis cache key
export async function removeCache(key:any) {
    try {

        const cacheData = await redis.get(key);
        await redis.del(key);
        if (cacheData) {
            return cacheData
        }
    } catch (err) {
        throw new Error(err);
    }
}

export const parseJson = (str:any) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return str
    }
}