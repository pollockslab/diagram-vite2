import * as DiagramsType from '@/diagrams/diagrams.type'

export class SpaceDiagrams {

    map: Map<string, DiagramsType.Instance> = new Map();

    constructor() {

    }

    Init() {
        this.map.clear();
    }

    
}