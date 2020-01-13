import AdvancedLogger from "./AdvancedLogger";

export default class MarvelComic {
    protected _id!: number;
    protected _title!: string;
    protected _number!: number;
    protected _cover!: string;
    protected _link!: string;

    protected static regexNumber = new RegExp('/.*#([0-9]*)/', 'i');
    protected static regexId = new RegExp('/www\\.marvel.com\\/comics\\/issue\\/([0-9]*)/');

    constructor(id: number, title: string, number: number, cover: string, link: string) {
        this._id = id;
        this._title = title;
        this._number = number;
        this._cover = cover;
        this._link = link;
    }

    public get id() {
        return this._id;
    }

    public get title() {
        return this._title;
    }

    public get number() {
        return this._number;
    }

    public get cover() {
        return this._cover;
    }

    public get link() {
        return this._link;
    }

    public static initFromHtml(node: HTMLElement) {
        const comicLink = node.getElementsByTagName('a')[0];
        const comicImage = node.getElementsByTagName('img')[0];

        if (!comicLink) return null;
        let regexIdResult = this.regexId.exec(comicLink.href);
        if (!regexIdResult || !regexIdResult[1]) return null;
        const id = parseInt(regexIdResult[1]);
        const name = comicImage.title;
        let regexNumberResult = this.regexNumber.exec(name);
        const number = (regexNumberResult && regexNumberResult[1]) ? parseInt(regexNumberResult[1]) : 0;
        return new MarvelComic(id, name, number, comicImage.src, comicLink.href);
    }

    public addToLibrary() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://www.marvel.com/my_account/my_must_reads', true);
            xhr.onreadystatechange = () => {
                if (xhr.status === 201) {
                    return resolve(xhr.response);
                } else {
                    AdvancedLogger.addLog('ERROR - Comic #' + this.id + ' - XHR Status : ' + xhr.status + ' - XHR Response : \n ' + xhr.responseText + '\n ---');
                    return reject(xhr.responseText);
                }
            };
            const formData = new FormData();
            formData.append('id', this._id.toString());
            xhr.send(formData);
        });
    }
}