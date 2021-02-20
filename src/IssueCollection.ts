import MarvelComic from "./MarvelComic";

export default abstract class IssueCollection {
    protected comics: MarvelComic[] = []

    /**
     * Must contain code to load comics issues from Marvel Unlimited website
     */
    public abstract loadIssues(): Promise<void>

    /**
     * Return number of comics in this collection
     */
    public comicsCount(): number {
        return this.comics.length
    }

    public addIssuesToLibrary(
        before: (x: MarvelComic) => void,
        onComicAdded: (x: MarvelComic) => void,
        onError: (x: MarvelComic) => void,
        always: (x: MarvelComic) => void
    ) {
        for (let i = 0; i < this.comics.length; i++) {
            before(this.comics[i]);
            this.comics[i].addToLibrary().then(
                () => {
                    onComicAdded(this.comics[i])
                    always(this.comics[i])
                },
                (xhrResponse) => {
                    onError(this.comics[i])
                    always(this.comics[i])
                }
            );
        }
    }

    public removeFromLibrary(
        before: (x: MarvelComic) => void,
        onComicAdded: (x: MarvelComic) => void,
        onError: (x: MarvelComic) => void,
        always: (x: MarvelComic) => void
    ) {
        for (let i = 0; i < this.comics.length; i++) {
            before(this.comics[i]);
            this.comics[i].removeFromLibrary().then(
                () => {
                    onComicAdded(this.comics[i])
                    always(this.comics[i])
                },
                (xhrResponse) => {
                    onError(this.comics[i])
                    always(this.comics[i])
                }
            );
        }
    }
}
