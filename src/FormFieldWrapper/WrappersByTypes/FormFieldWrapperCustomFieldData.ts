import { FormFieldWrapper } from "../FormFieldWrapper";

export class FormFieldWrapperCustomFieldData extends FormFieldWrapper {
	constructor(fieldTitle: string) {
		super(fieldTitle);
	}

	public get value(): string {
		return this.fieldElement.querySelector("[title]").innerHTML;
	}

	public set value(value: string) {
		this.fieldElement.querySelector("[title]").innerHTML = value;
	}
}