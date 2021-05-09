import { FormFieldWrapper } from "../FormFieldWrapper";

export class FormFieldWrapperSPFieldText extends FormFieldWrapper {
	constructor(fieldTitle: string) {
		super(fieldTitle);
	}

	public get value(): any {
		if (window.location.href.match(/DispForm\.aspx/i))
			return this.getValueDispForm();
		let inputElement = this.fieldElement.querySelector("[title]");
		return (<HTMLInputElement>inputElement).value;
	}

	public set value(value) {
		super.setValue(value);
	}
}