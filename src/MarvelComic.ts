import AdvancedLogger from "./AdvancedLogger"

export default class MarvelComic {
    protected _id!: number
    protected _title!: string
    protected _number!: number
    protected _cover!: string
    protected _link!: string

    protected static regexNumber = new RegExp('/.*#([0-9]*)/', 'i')
    protected static regexId = new RegExp('/www\\.marvel.com\\/comics\\/issue\\/([0-9]*)/')

    constructor(id: number, title: string, number: number, cover: string, link: string) {
        this._id = id
        this._title = title
        this._number = number
        this._cover = cover
        this._link = link
    }

    public get id() {
        return this._id
    }

    public get title() {
        return this._title
    }

    public get number() {
        return this._number
    }

    public get cover() {
        return this._cover
    }

    public get link() {
        return this._link
    }

    public static initFromHtml(node: HTMLElement) {
        const comicLink = node.getElementsByTagName('a')[0]
        const comicImage = node.getElementsByTagName('img')[0]

        if (!comicLink) return null
        let regexIdResult = this.regexId.exec(comicLink.href)
        if (!regexIdResult || !regexIdResult[1]) return null
        const id = parseInt(regexIdResult[1])
        const name = comicImage.title
        let regexNumberResult = this.regexNumber.exec(name)
        const number = (regexNumberResult && regexNumberResult[1]) ? parseInt(regexNumberResult[1]) : 0
        return new MarvelComic(id, name, number, comicImage.src, comicLink.href)
    }

    public addToLibrary() {
        const formData = new FormData()
        formData.append('id', this._id.toString())

        return new Promise((resolve, reject) => {
            fetch('https://www.marvel.com/my_account/my_must_reads', { method: "POST", body: formData })
                .then(response => {
                    if (response.status === 200) {
                        AdvancedLogger.success(`[AddToLibrary][${this.id}] Added comic to library`)
                        return resolve()
                    }
                    return response.text().then((text) => {
                        AdvancedLogger.error(`[AddToLibrary][${this.id}] Failed to add comic to library\nXHR Status ${response.status}\n${text}\n`)
                        reject()
                    })
                })
        })
    }

    public removeFromLibrary() {
        return new Promise((resolve, reject) => {
            fetch('https://www.marvel.com/my_account/my_must_reads/issues/' + this.id, { method: 'DELETE' })
                .then(response => {
                    if (response.status === 204) {
                        AdvancedLogger.success(`[RemoveFromLibrary][${this.id}] Remove comic to library`)
                        return resolve()
                    }
                    return response.text().then((text) => {
                        AdvancedLogger.error(`[RemoveFromLibrary][${this.id}] Failed to remove comic from library\nXHR Status ${response.status}\n${text}\n`)
                        reject()
                    })
                })
        })
    }
}
