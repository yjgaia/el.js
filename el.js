"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const el = (tag, ...children) => {
    let id;
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
    let className;
    const classNameIndex = tag.indexOf(".");
    if (classNameIndex !== -1) {
        className = tag.substring(classNameIndex + 1).replace(/\./g, " ");
        tag = tag.substring(0, classNameIndex);
    }
    if (tag === "") {
        tag = "div";
    }
    const element = document.createElement(tag);
    if (id !== undefined) {
        element.id = id;
    }
    if (className !== undefined) {
        element.className = className;
    }
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
            }
            else if (child instanceof HTMLElement || child instanceof DocumentFragment) {
                fragment.append(child);
            }
            else {
                for (const [name, value] of Object.entries(child)) {
                    if (value === undefined) {
                        element.removeAttribute(name);
                    }
                    else if (typeof value === "string") {
                        element.setAttribute(name, value);
                    }
                    else if (typeof value === "function") {
                        element.addEventListener(name, (event) => {
                            value(event, element);
                        });
                    }
                    else if (name === "style") {
                        el.style(element, value);
                    }
                }
            }
        }
    }
    element.append(fragment);
    return element;
};
el.fragment = (...children) => {
    const fragment = new DocumentFragment();
    fragment.append(...children);
    return fragment;
};
el.append = (parent, ...children) => {
    parent.append(...children.filter((c) => c !== undefined));
};
el.clone = (target) => {
    return target.cloneNode(true);
};
el.resImage = (tag, src, ...children) => {
    const src2x = src.substring(0, src.lastIndexOf(".png")) + "@2x.png";
    const src3x = src.substring(0, src.lastIndexOf(".png")) + "@3x.png";
    return el(tag, ...children, { src, srcSet: `${src2x} 2x, ${src3x} 3x` });
};
el.changeResImage = (target, src) => {
    const src2x = src.substring(0, src.lastIndexOf(".png")) + "@2x.png";
    const src3x = src.substring(0, src.lastIndexOf(".png")) + "@3x.png";
    target.src = src;
    target.srcset = `${src2x} 2x, ${src3x} 3x`;
};
el.faraway = (...targets) => {
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
el.bringback = (...targets) => {
    for (const target of targets) {
        if (target.dataset.originLeft !== undefined) {
            target.style.position = target.dataset.originPosition;
            target.style.left = target.dataset.originLeft;
            target.style.top = target.dataset.originTop;
            delete target.dataset.originPosition;
            delete target.dataset.originLeft;
            delete target.dataset.originTop;
        }
    }
};
el.empty = (target) => {
    while (target.firstChild) {
        target.removeChild(target.firstChild);
    }
};
el.style = (target, style) => {
    for (const [key, value] of Object.entries(style)) {
        if (typeof value === "number" && key !== "zIndex" && key !== "opacity") {
            target.style[key] = `${value}px`;
        }
        else {
            target.style[key] = value;
        }
    }
};
el.distance = (target, position) => {
    const left = position.left;
    const top = position.top;
    const rect = target.getBoundingClientRect();
    const blLeft = rect.left;
    const blTop = rect.top;
    const trLeft = rect.right;
    const trTop = rect.bottom;
    if ((left >= blLeft && left <= trLeft) &&
        (top >= blTop && top <= trTop)) {
        return { rect, distance: 0 };
    }
    if ((left >= blLeft && left <= trLeft)) {
        return { rect, distance: Math.min(Math.abs(top - blTop), Math.abs(top - trTop)) };
    }
    else if ((top >= blTop && top <= trTop)) {
        return { rect, distance: Math.min(Math.abs(left - blLeft), Math.abs(left - trLeft)) };
    }
    else {
        return {
            rect, distance: Math.sqrt((Math.pow(Math.min(Math.abs(left - blLeft), Math.abs(left - trLeft)), 2)) +
                (Math.pow(Math.min(Math.abs(top - blTop), Math.abs(top - trTop)), 2))),
        };
    }
};
el.fill = (templates, targetText, add) => {
    let result = [];
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
            }
            else {
                result.push(template);
            }
        }
        else {
            result.push(template);
        }
    }
    return result;
};
exports.default = el;
//# sourceMappingURL=el.js.map