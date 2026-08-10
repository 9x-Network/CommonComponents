export type Listener = (...args: any) => any;

class EventBus {
    private listeners = {};

    on(name: string, listener: Listener) {
        const { listeners } = this;
        if (!listeners[name]) listeners[name] = [];
        listeners[name].push(listener);
    }

    off(name: string, listener?: Listener): boolean {
        const { listeners } = this;
        const callbacks = listeners[name];
        if (!callbacks) return false;
        if (!listener) {
            return delete listeners[name];
        }
        const index = callbacks.findIndex((item: Listener) => item === listener);
        if (index < 0) return false;
        callbacks.splice(index, 1);
        return true;
    }

    emit(name: string, ...args: any) {
        const { listeners } = this;
        const callbacks = listeners[name];
        if (!callbacks) return;
        callbacks.forEach((cb: (..._args: any) => any) => {
            cb(...args);
        });
    }

    destroy() {
        this.listeners = {};
    }
}

export default EventBus;
