// drawing.js
import fs from "fs";

class GenericElement{ 
    constructor(name) {
        this.name = name;
        this.attributes = {};
        this.children =[];
        this.content = ""
    }
    addAttr(name, value) {
        this.attributes[name] = value;
    }
    setAttr(name, value) {
        this.attributes[name] = value;
    }
    addAttrs(obj) {
        this.attributes = {...this.attributes, ...obj};
    }
    removeAttrs(arr) {
        const attributeKeys = Object.keys(this.attributes);
        this.attributes = attributeKeys.reduce((newAttributes, key) => {
            if (!arr.includes(key)) {
                newAttributes[key] = this.attributes[key];
            }
            return newAttributes;
        }, {});
    }
           
    addChild(child) {
        this.children.push(child);
    }

    toString() {
        const attrs = Object.entries(this.attributes).map(([key, value]) => `${key}="${value}"`).join(" ");

        const childrenStr = this.children.map(child => child.toString()).join("");
        if (attrs.length > 0) {
            return `<${this.name} ${attrs}>${this.content}${childrenStr}</${this.name}>`;
        }
        else {
            return `<${this.name}>${this.content}${childrenStr}</${this.name}>`;
        }
        
    }

    write(fileName, cb){
        fs.writeFile(fileName, this.toString(), 'utf-8', cb)
    }
}

class RootElement extends GenericElement{
    constructor() {
        super("svg");
        this.addAttr("xmlns", "http://www.w3.org/2000/svg");
    }
}

class RectangleElement extends GenericElement {
    constructor(x, y, width, height, fill) {
        super("rect");
        this.addAttr("x", x);
        this.addAttr("y", y);
        this.addAttr("width", width);
        this.addAttr("height", height);
        this.addAttr("fill", fill);
    }
}

class TextElement  extends GenericElement {
    constructor(x, y, fontSize, fill, content) {
        super("text");
        this.addAttr("x", x);
        this.addAttr("y", y);
        this.addAttr("font-size", fontSize);
        this.addAttr("fill", fill);
        this.content = content
    }

}

// create root element with fixed width and height
const root = new RootElement();
root.addAttrs({width: 800, height: 170, abc: 200, def: 400});
root.removeAttrs(['abc','def', 'non-existent-attribute']);

// create circle, manually adding attributes, then add to root element
const c = new GenericElement('circle');
c.addAttr('r', 75);
c.addAttr('fill', 'yellow');
c.addAttrs({'cx': 200, 'cy': 80});
root.addChild(c);

// create rectangle, add to root svg element
const r = new RectangleElement(0, 0, 200, 100, 'blue');
root.addChild(r);

// create text, add to root svg element
const t = new TextElement(50, 70, 70, 'red', 'wat is a prototype? 😬');
root.addChild(t);

// show string version, starting at root element
console.log(root.toString());

// write string version to file, starting at root element
root.write('test.svg', () => console.log('done writing!'));
export {
    GenericElement,
    RootElement,
    RectangleElement,
    TextElement
}