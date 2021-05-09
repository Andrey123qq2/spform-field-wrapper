import { FormFieldWrapper } from "../FormFieldWrapper";

export class FormFieldWrapperSPFieldBoolean extends FormFieldWrapper {
	constructor(fieldTitle: string) {
		super(fieldTitle);
	}

	public get value(): boolean | string {
		if (window.location.href.match(/DispForm\.aspx/i))
			return this.getValueDispForm();
		let value = (<HTMLInputElement>this.fieldElement.querySelector("[type=checkbox]")).checked
		return value;
	}

	public set value(value) {
		(<HTMLInputElement>this.fieldElement.querySelector("[type=checkbox]")).checked = <boolean>value;
	}
}