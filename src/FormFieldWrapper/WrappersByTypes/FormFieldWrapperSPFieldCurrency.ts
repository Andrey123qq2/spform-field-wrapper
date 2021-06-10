import { FormFieldWrapper } from "../FormFieldWrapper";

export class FormFieldWrapperSPFieldCurrency extends FormFieldWrapper {
	constructor(fieldTitle: string) {
		super(fieldTitle);
	}

	public get value(): any {
		if (window.location.href.match(/DispForm\.aspx/i))
			return this.getValueDispForm().replace(/\s.*$/,"");
		return (<HTMLInputElement>this.fieldElement.querySelector("[title]")).value.replace(/\s+/g, '').replace(",", ".");
	}

	public set value(value) {
		super.setValue(value);
	}
}