import MarvelComicCollection from "./MarvelComicCollection";

export default class AddToLibraryButton {
    protected node!: HTMLElement
    protected text!: HTMLElement

    protected isLoading = false
    protected previousText?: string
    protected isDisabled = false

    public constructor(template: HTMLElement) {
        this.node = template.querySelector('#mus-addToLibraryButton')
        this.text = template.querySelector('#mus-addToLibraryButtonText')
    }

    public loading(): this {
        this.text.innerText = 'Loading...'
        return this
    }

    public addToLibrary(comicCount: number): this {
        this.text.innerText = `Add ${comicCount} issue${comicCount > 0 ? 's' : ''} to Library`
        return this
    }

    public onClick(fn: () => void) {
        this.node.addEventListener('click', (e) => {
            e.preventDefault()
            if (!this.isDisabled) {
                fn()
            }
        })
    }

    public enable() {
        this.isDisabled = false
        return this
    }

    public disable() {
        this.isDisabled = true
        return this
    }

    public setText(text: string): this {
        this.text.innerText = text
        return this
    }
}
