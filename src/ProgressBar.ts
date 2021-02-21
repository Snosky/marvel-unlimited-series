export default class ProgressBar {
    protected containerNode!: HTMLDivElement
    protected progressBarNode!: HTMLDivElement
    protected displayed = false

    protected done = 0
    protected total = 0

    constructor(template: HTMLElement) {
        this.containerNode = template.querySelector('#mus-progressBarContainer')
        this.progressBarNode = template.querySelector('#mus-progressBar')
        this.progressBarNode.innerText = '0/' + this.total
    }

    public show(): this {
        this.containerNode.style.display = 'block'
        return this
    }

    public hide(): this {
        this.containerNode.style.display = 'none'
        return this
    }

    public addProgress(step:number = 1): this {
        this.done += step
        this.progressBarNode.style.width = (100 * this.done) / this.total + '%'
        this.progressBarNode.innerText = this.done + '/' + this.total
        return this
    }

    public reset(): this {
        this.done = 0
        this.total = 0
        this.progressBarNode.style.width = '0%'
        this.progressBarNode.innerText = '0/??' + this.total
        return this
    }

    public max(max: number): this {
        this.total = max
        this.progressBarNode.innerText = '0/' + this.total
        return this
    }

    public get isFinished() {
        return this.total === this.done
    }
}
