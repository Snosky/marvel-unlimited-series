export default class SimpleLogger {
    protected readonly node!: HTMLDivElement
    protected logNodes: { [id: number]: HTMLParagraphElement } = {}
    protected lastId: number = 0
    protected rateUrl?: string
    protected displayed = false

    constructor(rateUrl?: string) {
        this.node = document.createElement('div')
        this.node.style.height = '200px'
        this.node.style.overflowY = 'auto'
        this.node.style.background = '#e62429'
        this.node.style.color = '#FFF'
        this.rateUrl = rateUrl
        this.addDefaultText()
    }

    protected addDefaultText() {
        this.addLog('Thank you for using Marvel Unlimited Series.')
        if (this.rateUrl) {
            this.addLog(`If you want to support me, <a href="${this.rateUrl}" style="color: white; text-decoration: underline" target="_blank">please rate MUS !</a>`)
        }
        this.addLog('Bug or Idea ? Submit it on <a href="https://github.com/Snosky/marvel-unlimited-series" style="color: white; text-decoration: underline" target="_blank">GitHub</a>.')
        this.addLog('---')
    }

    public appendTo(node: HTMLElement): SimpleLogger {
        if (!this.displayed) {
            node.appendChild(this.node)
            this.displayed = true
        }
        return this
    }

    public reset(defaultText = true): SimpleLogger{
        this.logNodes = {}
        this.node.innerHTML = ''
        if (defaultText) {
            this.addDefaultText()
        }
        return this
    }

    public destroy(): SimpleLogger {
        this.displayed = false
        this.node.remove()
        this.reset(false)
        return this
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
