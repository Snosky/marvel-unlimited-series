import MarvelComic from './MarvelComic'

export default class MarvelComicCollection {
    protected comics: MarvelComic[] = []
    protected type?: string
    protected id?: number

    constructor(comics: MarvelComic[], type?: string, id?: number) {
        this.comics = comics
        this.type = type
        this.id = id
    }

    public count() {
        return this.comics.length
    }

    public addToLibrary(
        before: (x: MarvelComic) => void,
        onComicAdded: (x: MarvelComic) => void,
        onError: (x: MarvelComic) => void,
        always: (x: MarvelComic) => void
    ) {
        const promises = []
        for (let i = 0; i < this.comics.length; i++) {
            before(this.comics[i])
            promises.push(
                this.comics[i].addToLibrary()
                    .then(() => onComicAdded(this.comics[i]))
                    .catch(() => onError(this.comics[i]))
                    .finally(() => always(this.comics[i]))
            )            
        }
        return Promise.all(promises)
    }

    public removeFromLibrary(
        before: (x: MarvelComic) => void,
        onComicAdded: (x: MarvelComic) => void,
        onError: (x: MarvelComic) => void,
        always: (x: MarvelComic) => void
    ) {
        const promises = []
        for (let i = 0; i < this.comics.length; i++) {
            before(this.comics[i])
            promises.push(
                this.comics[i].removeFromLibrary()
                    .then(() => onComicAdded(this.comics[i]))
                    .catch(() => onError(this.comics[i]))
                    .finally(() => always(this.comics[i]))
            )
        }
        return Promise.all(promises)
    }

    /**
     * Build a MarvelComicCollection from an event id
     * Example : https://www.marvel.com/comics/events/238/civil_war => Event ID 238
     * @param eventId
     * @param includeTieInIssues
     */
    public static buildFromMarvelEvent(eventId: number, includeTieInIssues = false): Promise<MarvelComicCollection> {
        const comics: MarvelComic[] = []
        const fetchers = [fetch('https://www.marvel.com/comics/list/coreissue/?id=' + eventId).then(r => r.text())]

        if (includeTieInIssues) {
            fetchers.push(fetch('https://www.marvel.com/comics/list/tiein/?id=' + eventId).then(r => r.text()))
        }

        return Promise.all(fetchers).then(([coreIssueDOM, tieIssueDOM]) => {
            const tmpNode = document.createElement('div')
            tmpNode.innerHTML = coreIssueDOM + tieIssueDOM
            const comicNodes = tmpNode.getElementsByClassName('row-item-image')
            for (let i = 0; i < comicNodes.length; i++) {
                var comic = MarvelComic.initFromHtml(comicNodes[i] as HTMLElement);
                if (comic != null) {
                    comics.push(comic)
                }
            }
            return new MarvelComicCollection(comics, 'event', eventId)
        })
    }

    /**
     * Build a MarvelComicCollection from an series id
     * Example : https://www.marvel.com/comics/series/21692/civil_war_ii_choosing_sides_2016 => Series ID 21692
     * @param seriesId
     */
    public static buildFromMarvelSeries(seriesId: number): Promise<MarvelComicCollection> {
        const comics: MarvelComic[] = []

        return fetch('https://www.marvel.com/comics/show_more?offset=0&tpl=..%2Fpartials%2Fcomic_issue%2Fcomics_singlerow_item.mtpl&byType=comic_series&limit=100000&isDigital=1&byId=' + seriesId)
            .then(r => r.json())
            .then((issuesDOM) => {
                const tmpNode = document.createElement('div')
                tmpNode.innerHTML = issuesDOM.output
                const comicsNodes = tmpNode.getElementsByClassName('row-item-image')
                for (let i = 0; i < comicsNodes.length; i++) {
                    var comic = MarvelComic.initFromHtml(comicsNodes[i] as HTMLElement);
                    if (comic != null) {
                        comics.push(comic)
                    }
                }
                return new MarvelComicCollection(comics, 'series', seriesId)
            })
    }
}
