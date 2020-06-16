export default class SimpleLogger {
    private readonly node!: HTMLDivElement;
    private logNodes: { [id: number]: HTMLParagraphElement } = {};
    private lastId: number = 0;

    constructor() {
        this.node = document.createElement('div');
        this.node.style.height = '200px';
        this.node.style.overflowY = 'auto';
        this.node.style.background = '#e62429';
        this.node.style.color = '#FFF';
    }

    public appendTo(node: HTMLElement): void {
        node.appendChild(this.node);
    }

    public reset() {
        this.logNodes = {};
        this.node.innerHTML = '';
    }

    public addLog(str: string, id?: number) {
        if (!id) {
            id = this.lastId++;
        }
        if (!this.logNodes[id]) {
            this.logNodes[id] =  document.createElement('p');
            this.logNodes[id].style.padding = '2px 5px';
            this.node.appendChild(this.logNodes[id]);
        }
        this.logNodes[id].innerHTML = str;
        return id;
    }

}
