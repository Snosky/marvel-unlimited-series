export default class RemoveFromLibraryButton {
    private readonly containerNode!: HTMLDivElement
    private readonly node!: HTMLAnchorElement
    private onClickFn?: () => void
    protected disabled = false

    public constructor(template: HTMLElement) {
        this.containerNode = template.querySelector('#mus-removeFromLibraryContainer')
        this.node = template.querySelector('#mus-removeFromLibraryButton')
        this.node.addEventListener('click', (e) => {
            e.preventDefault()
            if (this.onClickFn && !this.disabled) {
                this.onClickFn()
            }
        })
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

    public show(): this {
        this.containerNode.style.display = 'block'
        return this
    }
}
