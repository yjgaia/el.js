export type Style = { [key: string]: string | number };

type EventHandler<EL, EV> = (event: EV, element: EL) => void;

interface Attributes<EL> {
    [name: string]: Style | string | undefined | EventHandler<EL, any>;
}

export type Child<EL> = Attributes<EL> | HTMLElement | DocumentFragment | string | undefined;

const el = <EL extends HTMLElement>(tag: string, ...children: Child<EL>[]) => {

    let id: string | undefined;
    const idIndex = tag.indexOf("#");
    if (idIndex !== -1) {
        id = tag.substring(idIndex + 1);
        tag = tag.substring(0, idIndex);

        const cindex = id.indexOf(".");
        if (cindex !== -1) {
            id = id.substring(0, cindex);
            tag += id.substring(cindex);
        }
    }

    let className: string | undefined;
    const classNameIndex = tag.indexOf(".");
    if (classNameIndex !== -1) {
        className = tag.substring(classNameIndex + 1).replace(/\./g, " ");
        tag = tag.substring(0, classNameIndex);
    }

    if (tag === "") {
        tag = "div";
    }

    const element: EL = document.createElement(tag) as EL;
    if (id !== undefined) {
        element.id = id;
    }
    if (className !== undefined) {
        element.className = className;
    }

    el.append(element, ...children);
    return element;
};

el.fragment = (...children: (HTMLElement | string)[]): DocumentFragment => {
    const fragment = new DocumentFragment();
    fragment.append(...children);
    return fragment;
};

el.append = <EL extends HTMLElement>(target: EL, ...children: Child<EL>[]) => {
    const fragment = new DocumentFragment();
    for (const child of children) {
        if (child !== undefined) {
            if (typeof child === "string") {
                const strs = child.split("\n");
                for (const [index, str] of strs.entries()) {
                    if (index > 0) {
                        fragment.append(document.createElement("br"));
                    }
                    fragment.append(str);
                }
            } else if (child instanceof HTMLElement || child instanceof DocumentFragment) {
                fragment.append(child);
            } else {
                for (const [name, value] of Object.entries(child)) {
                    if (value === undefined) {
                        target.removeAttribute(name);
                    } else if (typeof value === "string") {
                        target.setAttribute(name, value);
                    } else if (typeof value === "function") {
                        target.addEventListener(name, (event) => {
                            value(event, target);
                        });
                    } else if (name === "style") {
                        el.style(target, value);
                    }
                }
            }
        }
    }
    target.append(fragment);
};

el.clone = <EL extends HTMLElement>(target: EL): EL => {
    return target.cloneNode(true) as EL;
};

el.resImage = <EL extends HTMLElement, EV extends Event>(tag: string, src: string, ...children: Child<EL>[]) => {
    const src2x = src.substring(0, src.lastIndexOf(".png")) + "@2x.png";
    const src3x = src.substring(0, src.lastIndexOf(".png")) + "@3x.png";
    return el(tag, ...children, { src, srcSet: `${src2x} 2x, ${src3x} 3x` });
};

el.changeResImage = (target: HTMLImageElement, src: string) => {
    const src2x = src.substring(0, src.lastIndexOf(".png")) + "@2x.png";
    const src3x = src.substring(0, src.lastIndexOf(".png")) + "@3x.png";
    target.src = src;
    target.srcset = `${src2x} 2x, ${src3x} 3x`;
};

el.faraway = (...targets: HTMLElement[]) => {
    for (const target of targets) {
        if (target.dataset.originLeft === undefined) {
            target.dataset.originPosition = target.style.position;
            target.dataset.originLeft = target.style.left;
            target.dataset.originTop = target.style.top;
            target.style.position = "fixed";
            target.style.left = "-999999px";
            target.style.top = "-999999px";
        }
    }
};

el.bringback = (...targets: HTMLElement[]) => {
    for (const target of targets) {
        if (target.dataset.originLeft !== undefined) {
            target.style.position = target.dataset.originPosition!;
            target.style.left = target.dataset.originLeft!;
            target.style.top = target.dataset.originTop!;
            delete target.dataset.originPosition;
            delete target.dataset.originLeft;
            delete target.dataset.originTop;
        }
    }
};

el.empty = (...targets: HTMLElement[]) => {
    for (const target of targets) {
        while (target.firstChild) { target.removeChild(target.firstChild); }
    }
};

el.style = (target: HTMLElement, style: Style) => {
    for (const [key, value] of Object.entries(style)) {
        if (typeof value === "number" && key !== "zIndex" && key !== "opacity") {
            (target.style as any)[key] = `${value}px`;
        } else {
            (target.style as any)[key] = value;
        }
    }
};

el.distance = (target: HTMLElement, position: { left: number, top: number }): { rect: DOMRect, distance: number } => {

    const left = position.left; const top = position.top;
    const rect = target.getBoundingClientRect();
    const blLeft = rect.left; const blTop = rect.top;
    const trLeft = rect.right; const trTop = rect.bottom;

    if ((left >= blLeft && left <= trLeft) &&
        (top >= blTop && top <= trTop)) {
        return { rect, distance: 0 };
    }

    if ((left >= blLeft && left <= trLeft)) {
        return { rect, distance: Math.min(Math.abs(top - blTop), Math.abs(top - trTop)) };
    } else if ((top >= blTop && top <= trTop)) {
        return { rect, distance: Math.min(Math.abs(left - blLeft), Math.abs(left - trLeft)) };
    } else {
        return {
            rect, distance: Math.sqrt(
                (Math.pow(Math.min(Math.abs(left - blLeft), Math.abs(left - trLeft)), 2)) +
                (Math.pow(Math.min(Math.abs(top - blTop), Math.abs(top - trTop)), 2)),
            ),
        };
    }
};

el.fill = (templates: (HTMLElement | string)[], targetText: string, add: HTMLElement | string) => {
    let result: (HTMLElement | string)[] = [];
    for (const template of templates) {
        if (typeof template === "string") {
            const index = template.indexOf(targetText);
            if (index !== -1) {
                const first = template.substring(0, index);
                if (first !== "") {
                    result.push(first);
                }
                result.push(add);
                result = result.concat(el.fill([template.substring(index + targetText.length)], targetText, add));
            } else {
                result.push(template);
            }
        } else {
            result.push(template);
        }
    }
    return result;
};

export default el;
