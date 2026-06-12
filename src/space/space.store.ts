import * as DiagramsType from '@/diagrams/diagrams.type'
import * as Diagrams from '@/diagrams/diagrams'
import * as SpaceType from './space.type'

const layerNames: SpaceType.LayerName[] = ['Axis', 'Line', 'Square', 'Point'];

export class SpaceStore {

    store: Map<string, DiagramsType.Instance> = new Map();

    constructor() {}

    Init() {
        this.store.clear();
    };

    Select(id: string): undefined | DiagramsType.Instance {
        return this.store.get(id);
    }

    SelectByList(idList: string[]): DiagramsType.Instance[] {
        const layer = this.SelectByLayer(idList);
        const list: DiagramsType.Instance[] = Object.values(layer).flat();
        return list;
    }

    SelectByLayer(idList: string[]): SpaceType.Layer {
        const layer: SpaceType.Layer = { Axis: [], Line: [], Square: [], Point: [] };
        for(const id of idList) {
            const diagram = this.store.get(id);
            if(!diagram) {continue;}

            const layerName = this.GetLayerName(diagram);
            layer[layerName].push(diagram);
        }

        layerNames.forEach((name) => {
            layer[name].sort((a, b) => a.zIndex - b.zIndex);
        });
        return layer;
    }

    Insert(input: DiagramsType.Instance | DiagramsType.Instance[]) {
        const list = Array.isArray(input)? input:[input];

        for(const diagram of list) {
            if(diagram.id === null || this.store.has(diagram.id)) {continue;}
            this.store.set(diagram.id, diagram);
        }
    }
   

    Update(input: DiagramsType.Instance | DiagramsType.Instance[]) {
        const list = Array.isArray(input)? input:[input];

        for(const diagram of list) {
            if(diagram.id === null || !this.store.has(diagram.id)) {continue;}
            this.store.set(diagram.id, diagram);
        }
    }

    Delete(input: DiagramsType.Instance | DiagramsType.Instance[]) {
        const list = Array.isArray(input)? input:[input];

        for(const diagram of list) {
            if(!diagram.id) {continue;}
            this.store.delete(diagram.id);
        }
    }

    GetLayerName(diagram: DiagramsType.Instance): SpaceType.LayerName {
        if(diagram instanceof Diagrams.Class.Line) {
            return 'Line';
        }
        else if(diagram instanceof Diagrams.Class.Square) {
            return 'Square';
        }
        else if(diagram instanceof Diagrams.Class.Point) {
            return 'Point';
        }
        else {
            return 'Axis';
        }
    }
}