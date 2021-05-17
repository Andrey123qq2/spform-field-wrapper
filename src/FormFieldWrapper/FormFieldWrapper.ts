import { IFieldContext } from "./IFieldContext";
import { FieldsContextesCache } from "./FieldsContextesCache";

export class FormFieldWrapper {
	public fieldName: string;
	public fieldInternalName: string;
	public fieldType: string;
	public fieldElement: Element;
	private _fieldContext: IFieldContext;
	//private readonly _disableStyle = "opacity: 0.4; pointer-events: none;"

	public get value(): any {
		if (window.location.href.match(/DispForm\.aspx/i))
			return this.getValueDispForm();
		return this.getValue();
	}

	public getValue(): any {
		let inputElement = <HTMLInputElement>this.fieldElement.querySelector("[title]");
		return inputElement.value;
	}

	public getValueDispForm(): string {
		return (this.fieldElement.parentNode as any).textContent.trim();
	}

	public set value(value) {
		this.setValue(value);
	}

	public setValue(value) {
		let inputElement = <HTMLInputElement>this.fieldElement.querySelector("[title]");
		inputElement.value = value;
	}

	public toString(): string {
		return this.value.toString();
	}

	public getFieldType(): string {
		return FormFieldWrapper.getType(this.fieldElement);
	}

	public static getType(fieldElement: Element): string {
		return fieldElement.innerHTML.match(/FieldType="(\w+)"/)[1];
	}

	constructor(fieldTitle: string) {
		this._fieldContext = FieldsContextesCache.getContext(fieldTitle);
		this.fieldName = this._fieldContext.FieldName;
		this.fieldInternalName = this._fieldContext.FieldInternalName;
		this.fieldType = this._fieldContext.FieldType;
		this.fieldElement = this._fieldContext.FieldElement;
	}

	//TODO: calculate tag dynamically
	public hide(selector: string): void {
		if (window.location.href.match(/DispForm\.aspx/i)) {
			this.hideDispForm(selector);
			return;
		}
		//(<HTMLElement>this.fieldElement.closest(tag)).style.display = 'none';
		(<HTMLElement>(<HTMLElement>this.fieldElement.parentNode).closest(selector)).style.display = 'none';
		this.fieldElement.classList.remove("required");
	}

	public hideDispForm(tag: string): void {
		(<HTMLElement>(<HTMLElement>this.fieldElement.parentNode).closest(tag)).style.display = 'none';
	}

	public show(selector: string): void {
		if (window.location.href.match(/DispForm\.aspx/i))
			return;
		//(<HTMLElement>this.fieldElement.closest(tag)).style.display = '';
		(<HTMLElement>(<HTMLElement>this.fieldElement.parentNode).closest(selector)).style.display = '';
		if (this.fieldElement.classList.contains("required-ifvisible")) {
			this.fieldElement.classList.add("required");
		}
	}

	public enable(selector = "[title]"): void {
		let fieldElement = selector ? this.fieldElement.querySelector(selector) : this.fieldElement;
		fieldElement.removeAttribute("disabled");
		fieldElement.classList.remove("disabled");
	}

	public disable(selector = "[title]"): void {
		let fieldElement = selector ? this.fieldElement.querySelector(selector) : this.fieldElement;
		fieldElement.setAttribute("disabled", "true");
		fieldElement.classList.add("disabled");
	}

	public disableWithStyle(): void {
		(<HTMLElement>this.fieldElement).style.setProperty("opacity", "0.4");
		(<HTMLElement>this.fieldElement).style.setProperty("pointer-events", "none");
		this.fieldElement.classList.add("disabled");
	}

	public enableWithStyle(): void {
		(<HTMLElement>this.fieldElement).style.setProperty("opacity", "");
		(<HTMLElement>this.fieldElement).style.setProperty("pointer-events",  "");
		this.fieldElement.classList.remove("disabled");
	}

	public addEventListener(type: string, callback: (ev: Event) => any): void {
		(<HTMLElement>this.fieldElement).firstElementChild.addEventListener(type, callback);
	}
}