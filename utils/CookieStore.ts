import Cookies from 'js-cookie';

/**
 * 利用cookie存储一个Key,对应到localStorage或sessionStorage中存储的数据
 * 实现跨窗口访问localStorage或sessionStorage的效果
 */
class CookieStore {
    storePrefix = '';

    userMarkPrefix = '@user_';

    expires: number | undefined | Date = undefined;

    cookieKey = 'user-key';

    constructor(storePrefix: string) {
        this.storePrefix = storePrefix;
    }

    set(data: any) {
        this.clear();
        if (!data) return;
        const storeKey = this.getRealKey() + Date.now();
        localStorage.setItem(storeKey, window.JSON.stringify(data));
        Cookies.set(this.cookieKey, storeKey, {
            path: '/',
            expires: this.expires,
        });
    }

    get(): any {
        const storeKey = Cookies.get(this.cookieKey);
        if (!storeKey) return null;
        const user = localStorage.getItem(storeKey);
        if (!user) {
            Cookies.remove(this.cookieKey);
            return null;
        }
        return window.JSON.parse(user);
    }

    getRealKey(): string {
        return this.storePrefix + this.userMarkPrefix;
    }

    clear() {
        const regx = new RegExp(`^(${this.getRealKey()})`);
        const storage = localStorage;
        for (let i = 0; i < storage.length; i++) {
            const key: string = storage.key(i) || '';
            if (regx.test(key)) {
                storage.removeItem(key);
            }
        }
        Cookies.remove(this.cookieKey);
    }
}

export default CookieStore;
