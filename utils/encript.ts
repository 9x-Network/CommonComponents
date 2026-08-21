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
            // 服务端 rsa_public_key 是可选配置，缺失时会返回 null。若把空值交给
            // setPublicKey，JSEncrypt 的 setKey 会因为 `if (key)` 直接跳过，随后
            // getKey() 静默生成一对临时 1024 位密钥并用它加密：前端加密“成功”，
            // 服务端 100% 解不开。所以在这里就失败掉，而不是把问题推到后端。
            if (!publicKey || typeof publicKey !== 'string') {
                throw new Error('Encrypt failed: rsa_public_key is not configured!');
            }
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

/**
 * RSA 分段加解密。
 *
 * 服务端（BIS securityRSADecrypt）把整个字段当作**一个** Base64 串解码，再按
 * 密钥长度切分密文块。所以这里必须拼接**原始字节**、最后统一做一次 Base64，
 * 不能把每一块的 Base64 结果直接相加——那样会在中间留下 '=' 填充，服务端
 * 解码会直接失败（illegal base64 data）。
 */
export class JSEncryptWithLong extends JSEncrypt {
    /**
     * 已设置公钥的 RSA 块长度（字节）；没有可用公钥时返回 0。
     *
     * 这里刻意不调用 getKey()：公钥为空时它会静默生成一对临时密钥。parseKey
     * 解析失败时 this.key 存在但 n 为 null，同样按“无可用公钥”处理。
     */
    private rsaBlockSize(): number {
        const key = (this as unknown as { key?: { n?: { bitLength(): number } | null } }).key;
        const modulus = key?.n;
        if (!modulus) return 0;
        // 与 RSAKey.prototype.encrypt 内部的算法保持一致。
        return (modulus.bitLength() + 7) >> 3;
    }

    /** 按 jsencrypt 自己的编码规则计算单个 UTF-16 码元占用的字节数。 */
    private static byteLength(code: number): number {
        if (code < 128) return 1;
        if (code < 2048) return 2;
        return 3;
    }

    /**
     * @param padding 默认 PKCS#1 v1.5（BIS 现有契约）。切换到 OAEP-SHA256 时传
     *                'OAEP'，需要 jsencrypt >= 3.5（package.json 的 ^3.3.2 要一起抬）。
     */
    encryptLong(text: string, padding: 'PKCS1V15' | 'OAEP' = 'PKCS1V15'): string | false {
        if (!text) return '';

        const blockSize = this.rsaBlockSize();
        if (blockSize === 0) return false;

        if (
            padding === 'OAEP' &&
            typeof (this as unknown as { encryptOAEP?: unknown }).encryptOAEP !== 'function'
        ) {
            return false;
        }
        const encryptChunk =
            padding === 'OAEP'
                ? (chunk: string) => this.encryptOAEP(chunk)
                : (chunk: string) => this.encrypt(chunk);

        // PKCS#1 v1.5 固定 11 字节开销；OAEP-SHA256 是 2 * 32 + 2。
        const maxChunkBytes = blockSize - (padding === 'OAEP' ? 2 * 32 + 2 : 11);
        if (maxChunkBytes <= 0) return false;

        let raw = '';
        let chunk = '';
        let chunkBytes = 0;

        const flush = (): boolean => {
            if (!chunk) return true;
            const encrypted = encryptChunk(chunk);
            if (!encrypted) return false;
            // atob 得到定长 blockSize 的二进制串，拼接后统一 btoa，
            // 服务端 base64 解码的结果正好是密钥长度的整数倍。
            raw += atob(encrypted);
            chunk = '';
            chunkBytes = 0;
            return true;
        };

        // 必须按字节而不是按字符分段：pkcs1pad2 的长度校验用的是 s.length
        // （UTF-16 码元数），超长时它不报错，而是从末尾倒着填充、静默截断明文。
        for (let i = 0; i < text.length; i += 1) {
            const code = text.charCodeAt(i);
            // 代理对必须整体落在同一分段里，否则会加密出半个字符。
            const paired = code >= 0xd800 && code <= 0xdbff && i + 1 < text.length;
            const unit = paired ? text.slice(i, i + 2) : text.charAt(i);
            const unitBytes = paired
                ? JSEncryptWithLong.byteLength(code) +
                  JSEncryptWithLong.byteLength(text.charCodeAt(i + 1))
                : JSEncryptWithLong.byteLength(code);

            if (unitBytes > maxChunkBytes) return false;
            if (chunkBytes + unitBytes > maxChunkBytes && !flush()) return false;

            chunk += unit;
            chunkBytes += unitBytes;
            if (paired) i += 1;
        }
        if (!flush()) return false;

        return btoa(raw);
    }

    /**
     * encryptLong 的逆运算，块长度同样从密钥推导（原实现把 172 写死，那是
     * 1024 位密钥的值，2048 位应为 344）。JSEncrypt 只有 PKCS#1 v1.5 解密。
     */
    decryptLong(text: string): string | false {
        if (!text) return '';

        const blockSize = this.rsaBlockSize();
        if (blockSize === 0) return false;

        let raw = '';
        try {
            raw = atob(text);
        } catch (err) {
            return false;
        }
        if (raw.length === 0 || raw.length % blockSize !== 0) return false;

        let output = '';
        for (let offset = 0; offset < raw.length; offset += blockSize) {
            const block = this.decrypt(btoa(raw.slice(offset, offset + blockSize)));
            if (block === false) return false;
            output += block;
        }
        return output;
    }
}
