import MarvelComic from "./MarvelComic";

export default class MarvelSeries {
    protected readonly seriesId!: number;
    protected comics: MarvelComic[] = [];

    constructor(seriesId: number) {
        this.seriesId = seriesId;
    }

    public init(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://www.marvel.com/comics/show_more?offset=0&tpl=..%2Fpartials%2Fcomic_issue%2Fcomics_singlerow_item.mtpl&byType=comic_series&limit=100000&isDigital=1&byId=' + this.seriesId);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    try {
                        const json = JSON.parse(xhr.responseText);

                        const tmpNode = document.createElement('div');
                        tmpNode.innerHTML = json.output;
                        const comicNodes = tmpNode.getElementsByClassName('row-item-image');
                        for (let i = 0; i < comicNodes.length; i++) {
                            this.comics.push(MarvelComic.initFromHtml(comicNodes[i] as HTMLElement));
                        }
                        return resolve(true);
                    } catch (e) {
                        console.error(e);
                        return reject(false);
                    }
                }
            };
            xhr.send();
        });
    }

    public getComicNb(): number {
        return this.comics.length;
    }

    public addToLibrary(
        before: (x: MarvelComic) => void,
        onComicAdded: (x: MarvelComic) => void,
        onError: (x: MarvelComic) => void,
        always: (x: MarvelComic) => void
    ) {
        for (let i = 0; i < this.comics.length; i++) {
            before(this.comics[i]);
            this.comics[i].addToLibrary().then(
                () => {
                    onComicAdded(this.comics[i]);
                    always(this.comics[i]);
                },
                (xhrResponse) => {
                    onError(this.comics[i]);
                    always(this.comics[i]);
                }
            );
        }
    }
}