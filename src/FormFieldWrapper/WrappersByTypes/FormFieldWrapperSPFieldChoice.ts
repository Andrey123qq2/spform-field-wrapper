import { FormFieldWrapper } from "../FormFieldWrapper";

export class FormFieldWrapperSPFieldChoice extends FormFieldWrapper {
	constructor(fieldTitle: string) {
		super(fieldTitle);
	}

	public get value(): string {
		if (window.location.href.match(/DispForm\.aspx/i))
			return this.getValueDispForm();
		let value;
		if (this.fieldElement.querySelector("table[id$=ChoiceRadioTable]"))
			value = this._getValueFromRadioButton();
		else
			value = this._getValueFromDropDown();
		return value;
	}

	public set value(value) {
		super.setValue(value);
	}

	public enable(): void {
		super.enable("");
		super.enableWithStyle();
	}

	public disable(): void {
		super.disable("");
		super.disableWithStyle();
	}

	private _getValueFromRadioButton(): string {
		let value;
		let selectedOption = Array.prototype.slice.call(this.fieldElement.querySelectorAll("input"))
			.filter((i) => i.checked);
		value = selectedOption[0].value;
		if (value == "FillInButton")
			value = (<HTMLInputElement>this.fieldElement.querySelector("input[type=text]")).value;
		return value;
	}

	private _getValueFromDropDown(): string {
		let value;
		if (this.fieldElement.querySelector("table[id$=FillInTable]")) {
			value = this._getValuesFromDropDownPlusFillIn();
		} else {
			value = this.getValue();
		}
		return value;
	}

	private _getValuesFromDropDownPlusFillIn(): string {
		let inputRadios = this.fieldElement.querySelectorAll("input[type='radio']");
		let checkedRadio = Array.prototype.slice.call(inputRadios)
			.filter((i) => i.checked);
		let checkedRadioValue = checkedRadio[0].value;
		let selector;
		if (checkedRadioValue == "FillInButton")
			selector = "input";
		if (checkedRadioValue == "DropDownButton")
			selector = "select";
		let selectedElement = this.fieldElement.querySelector(selector + "[title]");
		let fieldValue = (<HTMLInputElement>selectedElement).value;
		return fieldValue;
	}
}