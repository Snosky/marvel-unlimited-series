interface Parameter {
    container: HTMLDivElement,
    input: HTMLInputElement
}

export enum AvailableParameter {
    includeTieInIssues = 'includeTieInIssues'
}

export default class Parameters {
    protected node!: HTMLElement
    protected toggleNode!: HTMLElement
    protected parametersNode!: HTMLElement
    protected parameters: { [key in AvailableParameter]?: Parameter } = {}
    protected parametersValue: { [key in AvailableParameter]?: string|boolean } = {}

    protected parametersOpen = false

    protected _onChange: (parameter: AvailableParameter, value: boolean) => void

    public constructor(template: HTMLElement) {
        this.node = template.querySelector('#mus-parametersContainer')
        this.toggleNode = template.querySelector('#mus-parametersToggle')
        this.parametersNode = template.querySelector('#mus-parameters')

        this.parametersNode.style.display = 'none'
        this.toggleNode.innerText = this.toggleNode.dataset.openText
        this.toggleNode.addEventListener('click', (e) => {
            e.preventDefault()
            this.parametersOpen = !this.parametersOpen
            this.parametersNode.style.display = this.parametersOpen ? 'block' : 'none'
            this.toggleNode.innerText = this.parametersOpen ? this.toggleNode.dataset.closeText : this.toggleNode.dataset.openText
        })

        /** Tie In option **/
        this.parameters[AvailableParameter.includeTieInIssues] = {
            container: template.querySelector('#mus-includeTieInIssueContainer'),
            input: template.querySelector('#mus-includeTieInIssueInput')
        }
        this.parameters[AvailableParameter.includeTieInIssues].input.addEventListener('change', (e) => {
            this.parametersValue[AvailableParameter.includeTieInIssues] = this.parameters[AvailableParameter.includeTieInIssues].input.checked
            this._onChange(AvailableParameter.includeTieInIssues, this.parameters[AvailableParameter.includeTieInIssues].input.checked)
        })
    }

    public show(): this {
        this.node.style.display = 'block'
        return this
    }

    public enable(): this {
        let keys = Object.keys(AvailableParameter) as AvailableParameter[];
        for (let i = 0; i < keys.length; i++) {
            this.parameters[keys[i]].input.disabled = false
        }
        return this
    }

    public disable(): this {
        let keys = Object.keys(AvailableParameter) as AvailableParameter[];
        for (let i = 0; i < keys.length; i++) {
            this.parameters[keys[i]].input.disabled = true
        }
        return this
    }

    public hideParameter(parameterName: AvailableParameter): this {
        this.parameters[parameterName].container.style.display = 'none'
        return this
    }

    public get(parameterName: AvailableParameter) {
        return this.parametersValue[parameterName]
    }

    public onChange(fn: (parameter: AvailableParameter, value: boolean) => void): this {
        this._onChange = fn
        return this
    }
}
