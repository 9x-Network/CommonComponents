import request from '@/utils/request';
import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';

/**
 * MD5加密
 * @param text
 * @param digestType
 */
export const md5 = (text: string, digestType: 'base64' | 'hex' = 'hex'): string => {
    const encryptedData = CryptoJS.MD5(text);
    const enc = {
        base64: CryptoJS.enc.Base64,
        hex: CryptoJS.enc.Hex,
    };
    return enc[digestType].stringify(encryptedData);
};
/**
 * sha256加密
 * @param text
 * @param digestType
 */
export const sha256 = (text: string, digestType: 'base64' | 'hex' = 'hex'): string => {
    const encryptedData = CryptoJS.SHA256(text);
    const enc = {
        base64: CryptoJS.enc.Base64,
        hex: CryptoJS.enc.Hex,
    };
    return enc[digestType].stringify(encryptedData);
};

/**
 * 转换成Base64
 * @param text
 */
export const base64 = (text: string): string => {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
};

/**
 * 解析Base64
 * @param text
 */
export const parseBase64 = (text: string): string => {
    return CryptoJS.enc.Base64.parse(text).toString(CryptoJS.enc.Utf8);
};

/**
 * 敏感数据加密
 * @param text
 * @constructor
 */
export const SensitiveDataEncrypt = (() => {
    const Encryptor = {
        publicKey: '',
        privateKey: '',
        async getPublicKey(cache: boolean = true): Promise<string> {
            if (cache && this.publicKey) {
                return Promise.resolve(this.publicKey);
            }
            const data = await request.post(`bis/${AppPkgName}/security/rsa/publickey/get`);
            this.publicKey = data.rsa_public_key;
            return this.publicKey;
        },

        async getPrivateKey(cache: boolean = true): Promise<string> {
            if (cache && this.privateKey) {
                return Promise.resolve(this.privateKey);
            }
            const pk = CryptoJS.PBKDF2(CryptoJS.lib.WordArray.random(128 / 8).toString(), '', {
                keySize: 128 / 32,
                iterations: 1000,
            }).toString();
            const base64Pk = base64(pk);

            const aes_key_cipher = await this.encrypt(base64Pk);
            await request.post(`bis/${AppPkgName}/security/aes256/key/upload`, {
                aes_key_cipher,
            });
            this.privateKey = pk;
            return this.privateKey;
        },
        async encrypt(text: string): Promise<string> {
            const publicKey = await this.getPublicKey();
            const jse = new JSEncryptWithLong();
            jse.setPublicKey(publicKey);
            const rs = jse.encryptLong(text);
            if (rs === false) {
                throw new Error('Encrypt failed!');
            }
            return rs;
        },
        async decrypt(sensitiveDataIndex: string): Promise<string> {
            const pk = await this.getPrivateKey();
            const res = await request.post(`bis/${AppPkgName}/security/sensitiveData/get`, {
                sensitive_data_index: sensitiveDataIndex,
            });
            const encryptedData = CryptoJS.AES.decrypt(
                res.sensitive_data,
                CryptoJS.enc.Base64.parse(base64(pk)),
                {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7,
                },
            );
            return encryptedData.toString(CryptoJS.enc.Utf8);
        },
    };
    window.addEventListener('load', () => {
        // 用户退出登录后清空缓存的key
        window.eventCenter.on('userSignedOut', () => {
            console.log('[SensitiveDataEncrypt]', 'clear keys');
            Encryptor.publicKey = '';
            Encryptor.privateKey = '';
        });
    });

    return Encryptor;
})();

export class JSEncryptWithLong extends JSEncrypt {
    encryptLong(text: string): string | false {
        if (!text) return '';
        let maxChunkLength = 100,
            output = '',
            inOffset = 0;
        while (inOffset < text.length) {
            const encrypted = this.encrypt(text.substring(inOffset, inOffset + maxChunkLength));
            if (encrypted === false) return false;
            output += encrypted;
            inOffset += maxChunkLength;
        }
        return output;
    }

    decryptLong(text: string): string | false {
        let maxChunkLength = 172,
            output = '',
            inOffset = 0;
        while (text && inOffset < text.length) {
            output += this.decrypt(text.substring(inOffset, inOffset + maxChunkLength));
            inOffset += maxChunkLength;
        }
        return output;
    }
}
