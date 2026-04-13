
export class Dpr {
    value: number = 1;
    constructor() {
        this.Update();
    }
    Update(): void {
        this.value = Math.round(window.devicePixelRatio) || 1;
    }
}