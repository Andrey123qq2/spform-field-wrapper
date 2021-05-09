import { FormFieldWrapper } from "../FormFieldWrapper";

export class FormFieldWrapperSPFieldLookupMulti extends FormFieldWrapper {
	constructor(fieldTitle: string) {
		super(fieldTitle);
	}

	public get value(): Array<string> {
		if (window.location.href.match(/DispForm\.aspx/i))
			return this.getValueDispForm().split(/;\s?/);
		var selectedSource = this.fieldElement.querySelectorAll("select[id$=SelectResult] > option");
		var selectValues = Array.prototype.slice.call(selectedSource)
			.map((o) => o.innerText);
		return selectValues;
	}

	public set value(value) {
		super.setValue(value);
	}

	public toString(): string {
		return this.value.join(", ");
	}
}