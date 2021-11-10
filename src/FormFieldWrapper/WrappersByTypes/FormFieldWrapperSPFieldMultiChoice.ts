import { FormFieldWrapper } from "../FormFieldWrapper";

export class FormFieldWrapperSPFieldMultiChoice extends FormFieldWrapper {
	private _inputOptions: Array<HTMLInputElement>;
	constructor(fieldTitle: string) {
		super(fieldTitle);
		if (!window.location.href.match(/DispForm\.aspx/i))
			this._inputOptions = Array.prototype.slice.call(this.fieldElement.querySelectorAll("input[type='checkbox']"));
	}

	public get value(): Array<string> {
		if (window.location.href.match(/DispForm\.aspx/i))
			return this.getValueDispForm().split(/;\s?/);
		var optionsValues = [];
		optionsValues = this._inputOptions
			.filter(o => o.checked)
			.map(o => o.nextElementSibling.textContent);
		return optionsValues;
	}

	public set value(value) {
		this._inputOptions
			.forEach(o => o.checked = Array.contains(value, o.nextElementSibling.textContent));
	}

	public enable(): void {
		this._inputOptions
			.forEach(i => i.removeAttribute("disabled"));
	}

	public disable(): void {
		this._inputOptions
			.forEach(i => i.setAttribute("disabled", "true"));
	}

	public toString(): string {
		return this.value.join(", ");
	}
}