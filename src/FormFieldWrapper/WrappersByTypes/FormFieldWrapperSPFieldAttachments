import { FormFieldWrapper } from "../FormFieldWrapper";

export class FormFieldWrapperSPFieldAttachments extends FormFieldWrapper {
	constructor(fieldTitle: string) {
		super(fieldTitle);
	}

	public get value(): string {
		return Array.from(this.fieldElement.querySelectorAll("span[dir=ltr] > a")).map(a => (<HTMLLinkElement>a).href).join(", ");
	}

	public set value(value: string) {
		throw "NotImplementedError";
	}
}