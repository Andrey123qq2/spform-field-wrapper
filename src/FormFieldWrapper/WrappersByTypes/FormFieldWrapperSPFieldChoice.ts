import { FormFieldWrapper } from "../FormFieldWrapper";

enum SPFieldChoiceChoiceType {
	ChoiceRadio,
	FillInTable,
	DropDownButton
}

export class FormFieldWrapperSPFieldChoice extends FormFieldWrapper {
	private choiceType: SPFieldChoiceChoiceType;
	constructor(fieldTitle: string) {
		super(fieldTitle);
		this.choiceType = this.getChoiceType();
	}

	public get value(): string {
		if (window.location.href.match(/DispForm\.aspx/i))
			return this.getValueDispForm();
		let value;
		if (this.choiceType == SPFieldChoiceChoiceType.ChoiceRadio)
			value = this._getValueFromRadioButton();
		if (this.choiceType == SPFieldChoiceChoiceType.FillInTable)
			value = this._getValuesFromDropDownPlusFillIn();
		if (this.choiceType == SPFieldChoiceChoiceType.DropDownButton)
			value = this.getValue();
		return value;
	}

	public set value(value) {
		if (this.choiceType == SPFieldChoiceChoiceType.ChoiceRadio || this.choiceType == SPFieldChoiceChoiceType.DropDownButton )
			super.setValue(value);
		if (this.choiceType == SPFieldChoiceChoiceType.FillInTable)
			this._setValueOnDropDownPlusFillIn(value);
			
	}

	public get isValueCustom(): boolean {
		if (this.choiceType != SPFieldChoiceChoiceType.FillInTable)
			return false;
		let inputRadios = this.fieldElement.querySelectorAll("input[type='radio']");
		let checkedRadio = Array.prototype.slice.call(inputRadios)
			.filter((i) => i.checked);
		let checkedRadioValue = checkedRadio[0].value;
		let selector;
		if (checkedRadioValue == "FillInButton")
			return true;
		else
			return false;
	}

	public enable(): void {
		super.enable("");
		super.enableWithStyle();
	}

	public disable(): void {
		super.disable("");
		super.disableWithStyle();
	}

	private getChoiceType(): SPFieldChoiceChoiceType {
		let choiceType;
		let elementToQuery: any = (window.location.href.match(/DispForm\.aspx/i)) ? 
			this.fieldElement.parentNode :
			this.fieldElement;
		if (elementToQuery.querySelector("table[id$=ChoiceRadioTable]"))
			choiceType = SPFieldChoiceChoiceType.ChoiceRadio;
		else if (elementToQuery.querySelector("table[id$=FillInTable]"))
			choiceType = SPFieldChoiceChoiceType.FillInTable;
		else
			choiceType = SPFieldChoiceChoiceType.DropDownButton;
		return choiceType;
	}

	private _setValueOnDropDownPlusFillIn(value): void {
		let checkedRadioValue = Array.prototype.slice.call(this.fieldElement.querySelectorAll("input[type='radio']"))
			.filter((i) => i.checked);
		if (checkedRadioValue[0].value == "FillInButton")
			(<HTMLInputElement>this.fieldElement.querySelector("input[type=text]")).value = value;
		else
			super.setValue(value);
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
	public addEventListener(type: string, callback: (ev: Event) => any): void {
		super.addEventListener(type, callback);
		if (this.fieldElement.querySelector("table[id$=FillInTable]")) {
			this.fieldElement.querySelector("span.ms-RadioText").addEventListener("click", callback);
			this.fieldElement.querySelector("input[type=text]").addEventListener("click", callback);
		}
	}
}