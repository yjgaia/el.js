declare type EventHandler<EL, EV> = (event: EV, element: EL) => void;
interface Attributes<EL> {
    [name: string]: string | undefined | EventHandler<EL, any>;
}
export declare type Child<EL> = Attributes<EL> | HTMLElement | DocumentFragment | string | undefined;
declare const el: {
    <EL extends HTMLElement>(tag: string, ...children: Child<EL>[]): EL;
    fragment(...children: (string | HTMLElement)[]): DocumentFragment;
    append(parent: HTMLElement, ...children: (string | HTMLElement | undefined)[]): void;
    clone<EL_1 extends HTMLElement>(target: EL_1): EL_1;
    resImage<EL_2 extends HTMLElement, EV extends Event>(tag: string, src: string, ...children: Child<EL_2>[]): EL_2;
    changeResImage(target: HTMLImageElement, src: string): void;
    faraway(...targets: HTMLElement[]): void;
    bringback(...targets: HTMLElement[]): void;
    empty(target: HTMLElement): void;
    style(target: HTMLElement, style: {
        [key: string]: string | number;
    }): void;
    distance(target: HTMLElement, position: {
        left: number;
        top: number;
    }): {
        rect: DOMRect;
        distance: number;
    };
    fill(templates: (string | HTMLElement)[], targetText: string, add: string | HTMLElement): (string | HTMLElement)[];
};
export default el;
//# sourceMappingURL=el.d.ts.map