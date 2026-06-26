

export class ColorPickerDatalist {
    constructor(args: {
        parentNode: HTMLElement,
        inputNode: HTMLInputElement,
        colorList: string[]
    }) {
        const id = crypto.randomUUID();
        const datalist = document.createElement('datalist');
        datalist.id = id;
        args.inputNode.setAttribute('list', id);
        
        for(const color of args.colorList) {
            const option = document.createElement('option');
            option.value = color;
            datalist.appendChild(option);
        }
        args.parentNode.appendChild(datalist);
    }
}