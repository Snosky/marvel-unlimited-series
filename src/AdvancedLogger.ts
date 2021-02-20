export default class AdvancedLogger {
    protected static buttonNode: HTMLParagraphElement
    protected static _logs: string = ''

    public static addLog(str: string) {
        this._logs += str + '\n'
    }

    public static success(str: string) {
        this._logs += '[SUCCESS]' + str + '\n'
    }

    public static error(str: string) {
        this._logs += '[ERROR]' + str + '\n'
    }

    public static get logs(): string {
        return this._logs
    }

    public static reset() {
        if (this.buttonNode) {
            this.buttonNode.remove()
        }
        this._logs = ''
    }

    public static appendButtonTo(node: HTMLElement) {
        this.buttonNode = document.createElement('p')
        this.buttonNode.innerText = 'Copy debug logs'
        this.buttonNode.style.fontSize = '.6em'
        this.buttonNode.style.cursor = 'pointer'

        this.buttonNode.addEventListener('click', (e) => {
            e.preventDefault()
            this.copyToClipboard()
        })
        node.appendChild(this.buttonNode)
    }

    public static copyToClipboard() {
        navigator.clipboard.writeText(AdvancedLogger.logs)
            .then(() => {
                this.buttonNode.innerText = 'Copied to clipboard'
                setTimeout(() => {
                    this.buttonNode.innerText = 'Copy debug logs'
                }, 5000)
            })
            .catch((err) => {
                console.error('Failed to copy error', err)
                this.buttonNode.innerText = 'An error occured.'
                setTimeout(() => {
                    this.buttonNode.innerText = 'Copy debug logs'
                }, 5000)
            })
    }
}
