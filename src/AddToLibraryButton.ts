export default class AddToLibraryButton {
    private readonly buttonNode!: HTMLAnchorElement;
    private readonly textNode!: HTMLDivElement;

    private isLoading = false;
    private previousText = '';

    private onClickFn?: () => void;

    public constructor() {
        this.buttonNode = document.createElement('a');
        this.buttonNode.classList.add('cta-btn', 'cta-btn--solid', 'cta-btn--red', 'active');
        this.buttonNode.setAttribute('aria-current', 'true');

        this.textNode = document.createElement('div');
        this.textNode.classList.add('innerFill');

        this.buttonNode.appendChild(this.textNode);

        this.buttonNode.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.onClick) {
                this.onClickFn();
            }
        })
    }

    public appendTo(node: HTMLElement): void {
        node.appendChild(this.buttonNode);
    }

    public toggleLoading(): void {
        if (this.isLoading) {
            this.textNode.innerText = this.previousText;
        } else {
            this.previousText = this.textNode.innerText;
            this.textNode.innerText = 'Loading...';
        }
        this.isLoading = !this.isLoading;
    }

    public onClick(fn: () => void): void {
        this.onClickFn = fn;
    }

    public setCustomText(str: string) {
        this.isLoading = false;
        this.textNode.innerText = str;
    }

    public setDefaultText(comicNb?: number) {
        if (!comicNb) {
            this.setCustomText('Add serie to library.');
        } else {
            this.setCustomText('Add ' + comicNb + ' issue' + (comicNb > 0 ? 's' : '') + ' to Library');
        }
    }

    public setErrorText(str: string) {
        this.setCustomText('ERROR : ' + str);
    }
}