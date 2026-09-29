import { _DPR } from '@/main'
import * as DiagramsType from '../diagrams.type'
import { Axis } from './axis'

export class Chain extends Axis {
    chain = {
        diagram1: {
            id: null as DiagramsType.ID,
        }, 
        diagram2: {
            id: null as DiagramsType.ID,
        },
    };
    constructor() {super();}

    static get origin(): DiagramsType.serialize.core.Chain {
        return {
            ...super.origin,
            chain: {
                diagram1: {
                    id: null,
                },
                diagram2: {
                    id: null,
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
                },
                diagram2: {
                    id: this.chain.diagram2.id,
                },
            }
        };
    }
    set serialize(data: DiagramsType.serialize.core.Chain) {
        // [Axis]
        super.serialize = data; 

        // [Chain]
        this.chain.diagram1.id = data.chain.diagram1.id;
        this.chain.diagram2.id = data.chain.diagram2.id;
    }
}