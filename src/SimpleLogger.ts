export default class SimpleLogger {
    protected readonly node!: HTMLDivElement
    protected logNodes: { [id: number]: HTMLParagraphElement } = {}
    protected lastId: number = 0
    protected rateUrl?: string
    protected displayed = false

    constructor(template: HTMLElement, rateUrl?: string) {
        this.node = template.querySelector('#mus-simpleLogger')
        this.rateUrl = rateUrl
        this.addDefaultText()
    }

    public show() {
        this.node.style.display = 'block'
        return this
    }

    public hide() {
        this.node.style.display = 'none'
        return this
    }

    /**
     * Add default messages
     * @protected
     */
    protected addDefaultText() {
        this.addLog('Thank you for using Marvel Unlimited Series.')
        if (this.rateUrl) {
            this.addLog(`If you want to support me, <a href="${this.rateUrl}" style="color: white; text-decoration: underline" target="_blank">please rate MUS !</a>`)
        }
        this.addLog('Bug or Idea ? Submit it on <a href="https://github.com/Snosky/marvel-unlimited-series" style="color: white; text-decoration: underline" target="_blank">GitHub</a>.')
        this.addLog('---')
    }

    /**
     * Delete all logs
     * @param defaultText
     */
    public reset(defaultText = true): SimpleLogger{
        this.logNodes = {}
        this.node.innerHTML = ''
        if (defaultText) {
            this.addDefaultText()
        }
        return this
    }

    /**
     * Add a log
     * @param str
     * @param id
     */
    public addLog(str: string, id?: number) {
        if (!id) {
            id = this.lastId++;
        }
        if (!this.logNodes[id]) {
            this.logNodes[id] = document.createElement('p');
            this.logNodes[id].classList.add('mus-simpleLog')
            this.node.appendChild(this.logNodes[id]);
        }
        this.logNodes[id].innerHTML = str;
        return id;
    }

}
