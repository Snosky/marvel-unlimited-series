export default class RemoveFromLibraryButton {
    private readonly containerNode!: HTMLDivElement
    private readonly buttonNode!: HTMLAnchorElement
    private onClickFn?: () => void
    protected disabled = false

    public constructor() {
        this.containerNode = document.createElement('div')
        this.containerNode.classList.add('shifted-content-footer', 'available-now-footer')
        this.buttonNode = document.createElement('a')
        this.buttonNode.classList.add('primary')
        this.buttonNode.style.cursor = 'pointer'
        this.buttonNode.innerText = 'Remove from library'

        this.containerNode.append(this.buttonNode)

        this.buttonNode.addEventListener('click', (e) => {
            e.preventDefault()
            if (this.onClickFn) {
                this.onClickFn()
            }
        })
    }

    public appendTo(node: HTMLElement): void {
        node.appendChild(this.containerNode);
    }

    public onClick(fn: () => void): void {
        this.onClickFn = () => {
            if (!this.disabled) fn()
        }
    }

    public disable(): this {
        this.disabled = true
        return this
    }

    public enable(): this {
        this.disabled = false
        return this
    }
}
