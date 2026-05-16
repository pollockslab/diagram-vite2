import { RemoconReset } from './remocon.reset'
import { RemoconDisplay } from './remocon.display'
import { RemoconButtons } from './remocon.buttons'
import './remocon.css'


export class Remocon {

    panel   : HTMLElement;
    reset   : RemoconReset; 
    display : RemoconDisplay;
    buttons : RemoconButtons;

    constructor(args: {parentNode: HTMLElement}) {

        this.panel = document.createElement('div');
        this.panel.id = 'remocon';
        args.parentNode.appendChild(this.panel);
        
        this.reset   = new RemoconReset({parentNode: args.parentNode , panel: this.panel});
        this.display = new RemoconDisplay({parentNode: this.panel});
        this.buttons = new RemoconButtons({parentNode: this.panel});

        this.selected = 'pointer';
    }

    get selected() {
        return this.buttons.selected.id;
    }
    set selected(id: string) {
        this.buttons.Select(id);
        this.display.text = this.buttons.selected.title;
    }
}


