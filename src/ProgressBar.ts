export default class ProgressBar {
    protected containerNode!: HTMLDivElement;
    protected progressBarNode!: HTMLDivElement;

    protected done:number = 0;
    protected total!: number;

    constructor(total: number) {
        this.total = total;

        this.containerNode = document.createElement('div');
        this.containerNode.style.width = '100%';
        this.containerNode.style.height = '20px';
        this.containerNode.style.background = '#fff';
        this.containerNode.style.margin = '20px 0';

        this.progressBarNode = document.createElement('div');
        this.progressBarNode.style.background = '#e62429';
        this.progressBarNode.style.width = '0';
        this.progressBarNode.style.height = '100%';
        this.progressBarNode.style.transition = 'width .1s';
        this.progressBarNode.style.textAlign = 'center';
        this.progressBarNode.innerText = '0/' + this.total;

        this.containerNode.appendChild(this.progressBarNode);
    }

    public addProgress(step:number = 1) {
        this.done += step;
        this.progressBarNode.style.width = (100 * this.done) / this.total + '%';
        this.progressBarNode.innerText = this.done + '/' + this.total
    }

    public appendTo(node: HTMLElement): void {
        node.appendChild(this.containerNode);
    }

    public get isFinished() {
        return this.total === this.done;
    }
}