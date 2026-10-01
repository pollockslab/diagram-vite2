import { _DPR } from '@/main'
import * as DiagramsType from '../diagrams.type'
import { Axis } from './axis'

export class Chain extends Axis {
    chain = {
        diagram1: {
            id: null as DiagramsType.ID,
            x : 0    as number,
            y : 0    as number,
        }, 
        diagram2: {
            id: null as DiagramsType.ID,
            x : 0    as number,
            y : 0    as number,
        },
    };
    constructor() {super();}

    static get origin(): DiagramsType.serialize.core.Chain {
        return {
            ...super.origin,
            chain: {
                diagram1: {
                    id: null,
                    x : 0,
                    y : 0,
                },
                diagram2: {
                    id: null,
                    x : 0,
                    y : 0,
                },
            },
        };
    }
    get serialize(): DiagramsType.serialize.core.Chain {
        return {
            ...super.serialize,
            chain: {
                diagram1: {
                    id: this.chain.diagram1.id,
                    x : this.chain.diagram1. x,
                    y : this.chain.diagram1. y,
                },
                diagram2: {
                    id: this.chain.diagram2.id,
                    x : this.chain.diagram2. x,
                    y : this.chain.diagram2. y,
                },
            }
        };
    }
    set serialize(data: DiagramsType.serialize.core.Chain) {
        // [Axis]
        super.serialize = data; 

        // [Chain]
        this.chain.diagram1.id = data.chain.diagram1.id;
        this.chain.diagram1. x = data.chain.diagram1. x;
        this.chain.diagram1. y = data.chain.diagram1. y;

        this.chain.diagram2.id = data.chain.diagram2.id;
        this.chain.diagram2. x = data.chain.diagram2. x;
        this.chain.diagram2. y = data.chain.diagram2. y;
    }
}