
/**
 * [Class] ElementCustom
 * @param args.tag 엘리먼트 타입. (예: div, header, custom)
 * @param args.parentElement 부모 엘리먼트.
 * @param args.style 엘리먼트에 적용할 클래스네임. (※ 빈 칸 한개로 구분하여 적으면 각자 적용됨.)
 * @description 커스텀 엘리먼트 생성.
 * @example 
    this.cover  = El.create({tag: 'engines-tabsingle', parentElement: args.parentElement});
    this.header = El.create({tag: 'tab-header', parentElement: this.cover});
    this.panel  = El.create({
        tag: 'tab-panel', 
        parentElement: this.cover,
        style: 'style1 style2' // style1, style2 각각 스타일 적용됨.
    });
 */
export class ElementCustom {
    static create(args: {
        tag: string, 
        parentElement: HTMLElement,
        style? : string,
    }): HTMLElement {

        const element = document.createElement(args.tag);
        if(args.style !== undefined) {
            // [Split] 빈공간을 기준으로 배열로 나누어 각각 스타일 적용.
            const classList = args.style.split(' ').filter(Boolean);
            if(classList.length > 0) {
                element.classList.add(...classList);
            }
        }
        args.parentElement.appendChild(element);
        return element;
    }
}