export default class AdvancedLogger {
    protected buttonNode!: HTMLParagraphElement;
    protected static _logs: string = '';

    constructor() {
        this.buttonNode = document.createElement('p');
        this.buttonNode.innerText = 'Copy debug logs';
        this.buttonNode.style.color = 'white';
        this.buttonNode.style.cursor = 'pointer';

        this.buttonNode.addEventListener('click', (e) => {
            e.preventDefault();
            this.copyToClipboard();
        })
    }

    public static addLog(str: string) {
        this._logs += str + '\n';
    }

    public static get logs(): string {
        return this._logs;
    }

    public appendButtonTo(node: HTMLElement) {
        node.appendChild(this.buttonNode);
    }

    public copyToClipboard() {
        navigator.clipboard.writeText(AdvancedLogger.logs)
            .then(() => {
                this.buttonNode.innerText = 'Copied to clipboard';
                setTimeout(() => {
                    this.buttonNode.innerText = 'Copy debug logs';
                }, 5000)
            })
            .catch((err) => {
                console.error('Failed to copy error', err);
                this.buttonNode.innerText = 'An error occured.';
                setTimeout(() => {
                    this.buttonNode.innerText = 'Copy debug logs';
                }, 5000)
            })
    }
}