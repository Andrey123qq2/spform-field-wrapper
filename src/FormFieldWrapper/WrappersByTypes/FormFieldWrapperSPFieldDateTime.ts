import { FormFieldWrapper } from "../FormFieldWrapper";

export class FormFieldWrapperSPFieldDateTime extends FormFieldWrapper {
	constructor(fieldTitle: string) {
		super(fieldTitle);
	}

	public get value(): Date | string {
		if (window.location.href.match(/DispForm\.aspx/i))
			return this.getValueDispForm();
		let fieldDateString = (<HTMLInputElement>this.fieldElement.querySelector("[title]")).value;
		if (fieldDateString)
			return new Date(fieldDateString.replace(/(^\d+)\.(\d+)\.(\d+)/, '\$2/\$1/\$3'));
		else
			return "";
	}

	public set value(value) {
		super.setValue(value);
	}

	public toString(): string {
		return (<Date>this.value).format("dd.MM.yyyy");
	}
}