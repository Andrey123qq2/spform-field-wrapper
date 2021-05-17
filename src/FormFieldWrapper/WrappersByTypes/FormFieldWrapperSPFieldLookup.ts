import { FormFieldWrapper } from "../FormFieldWrapper";

export class FormFieldWrapperSPFieldLookup extends FormFieldWrapper {
	constructor(fieldTitle: string) {
		super(fieldTitle);
	}

	public get value(): string {
		if (window.location.href.match(/DispForm\.aspx/i))
			return this.getValueDispForm();
		var selectOptions = this.fieldElement.querySelectorAll("select[title] > option");
		let value = Array.prototype.slice.call(selectOptions)
			.filter((o) => o.value == o.parentNode.value)[0]
			.textContent;
		return value;
	}

	public set value(value) {
		let lookupOptions = this.fieldElement.querySelectorAll("[title] option");
		Array.prototype.slice.call(lookupOptions)
			.filter(o => o.textContent == value)
			.forEach(o => o.setAttribute('selected', true));
	}
}