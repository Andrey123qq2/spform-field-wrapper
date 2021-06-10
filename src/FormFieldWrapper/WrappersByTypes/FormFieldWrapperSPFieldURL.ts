import { FormFieldWrapper } from "../FormFieldWrapper";

export class FormFieldWrapperSPFieldURL extends FormFieldWrapper {
	constructor(fieldTitle: string) {
		super(fieldTitle);
	}

	public get value(): SP.FieldUrlValue | string {
		if (window.location.href.match(/DispForm\.aspx/i))
			return this.getValueDispForm();
		let docSetUrlInputs = this.fieldElement.querySelectorAll("input[type=text]");
		let docSetUrlValue = (<HTMLInputElement>docSetUrlInputs[0]).value.replace(/^http:\/\/$/, "");
		let docSetUrlDescription = (<HTMLInputElement>docSetUrlInputs[1]).value;
		let fieldUrlValue = new SP.FieldUrlValue();
		fieldUrlValue.set_url(docSetUrlValue);
		fieldUrlValue.set_description(docSetUrlDescription);
		return fieldUrlValue;
	}

	public set value(value: SP.FieldUrlValue | string) {
		let docSetUrlInputs = this.fieldElement.querySelectorAll("input[type=text]");
		if ((typeof value) == "string") {
			(<HTMLInputElement>docSetUrlInputs[0]).value = <string>value;
			(<HTMLInputElement>docSetUrlInputs[1]).value = <string>value;
		} else {
			(<HTMLInputElement>docSetUrlInputs[0]).value = (<SP.FieldUrlValue>value).get_url();
			(<HTMLInputElement>docSetUrlInputs[1]).value = (<SP.FieldUrlValue>value).get_description();
		}
	}

	public toString(): string {
		return (<SP.FieldUrlValue >this.value).get_url();
	}
}