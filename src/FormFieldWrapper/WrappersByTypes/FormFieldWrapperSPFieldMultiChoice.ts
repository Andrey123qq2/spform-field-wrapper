import { FormFieldWrapper } from "../FormFieldWrapper";

export class FormFieldWrapperSPFieldMultiChoice extends FormFieldWrapper {
	constructor(fieldTitle: string) {
		super(fieldTitle);
	}

	public get value(): Array<string> {
		if (window.location.href.match(/DispForm\.aspx/i))
			return this.getValueDispForm().split(/;\s?/);
		var optionsValues = [];
		let inputOptions = this.fieldElement.querySelectorAll("input[type='checkbox']");
		optionsValues = Array.prototype.slice.call(inputOptions)
			.filter(o => o.checked)
			.map(o => o.nextElementSibling.textContent);
		return optionsValues;
	}

	public set value(value) {
		let inputOptions = this.fieldElement.querySelectorAll("input[type='checkbox']");
		Array.prototype.slice.call(inputOptions)
			.forEach(o => o.checked = Array.contains(value, o.nextElementSibling.textContent));
	}

	public toString(): string {
		return this.value.join(", ");
	}
}