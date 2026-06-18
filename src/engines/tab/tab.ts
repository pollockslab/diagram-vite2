import { TabPanels } from "./tab.panels";
import { TabTabs } from "./tab.tabs";
import * as TabType from './tab.type'

export class Tab {
    parentNode: HTMLElement;
    cover: HTMLElement;
    tabs: TabTabs;
    panels: TabPanels;
    list: TabType.List;

    constructor(args: {parentNode: HTMLElement}) {
        this.parentNode = args.parentNode;
        this.cover = document.createElement('wd-tab');


        this.tabs = new TabTabs();
        this.panels = new TabPanels();

       

        // [Cover]
        this.parentNode.appendChild(this.cover);
    }

    Add() {
        // 관리 리스트
    }

    // 선택
}

/**
 * [할일 ]
 * 1. 탭 모듈 만든다
 * 2. 컬러픽커 적용
 * 
 * [탭모듈 기능]
 * 1. 탭버튼에 색상표, 타이틀을 적용하는데 순서가변적이게(기호도 포함)
 *  블록으로 넣는 형식으로 
 * 2. x버튼도 넣을 수 있고 블록식인지.
 * 3. 자물쇠는 불필요해보이는데
 * 4. 
 */