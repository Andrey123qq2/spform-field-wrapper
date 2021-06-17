import { FormFieldWrapper } from "../FormFieldWrapper";

export class FormFieldWrapperSPFieldDateTime extends FormFieldWrapper {
	public fullStringFormat;
	public shortStringFormat;
	public hoursStringFormat;
	private readonly _langCodesToSwapDM = [1049];
	private _swapDM = false;

	constructor(fieldTitle: string) {
		super(fieldTitle);
		this._swapDM = Array.contains(this._langCodesToSwapDM, _spPageContextInfo.currentLanguage);
		if (this._swapDM) {
			this.fullStringFormat = "dd.MM.yyyy HH:mm";
			this.shortStringFormat = "dd.MM.yyyy";
			this.hoursStringFormat = "HH";
		}
		else {
			this.fullStringFormat = "MM.dd.yyyy hh:mm";
			this.shortStringFormat = "MM.dd.yyyy";
			this.hoursStringFormat = "hh";
		}
	}

	public get value(): Date | string {
		if (window.location.href.match(/DispForm\.aspx/i))
			return this.getValueDispForm();
		let dateStringFromHTML = this.getDateStringFromFieldInputs();
		if (!dateStringFromHTML)
			return "";
		else
			return new Date(dateStringFromHTML);
	}

	public set value(value) {
		this.setDateToFieldInputs(value);
	}

	public toString(): string {
		if (typeof this.value == "string")
			return this.value;
		else
			return (<Date>this.value).format(this.fullStringFormat);
	}

	private getDateStringFromFieldInputs(): string {
		let fieldDateStringFull;
		const fieldDateString = (<HTMLInputElement>this.fieldElement.querySelector("[title]")).value;
		const fieldHoursString = (<HTMLInputElement>this.fieldElement.querySelector("select[id$='DateTimeFieldDateHours']"))?.value;
		const fieldMinutesString = (<HTMLInputElement>this.fieldElement.querySelector("select[id$='DateTimeFieldDateMinutes']"))?.value;
		fieldDateStringFull = String.format(
			"{0} {1}:{2}", 
			fieldDateString, 
			fieldHoursString, 
			fieldMinutesString
		).replace(/ :$/, "");
		if (this._swapDM) {
			fieldDateStringFull = fieldDateStringFull.replace(/(^\d+)\.(\d+)\.(\d+)/, '\$2/\$1/\$3')
		};
		return fieldDateStringFull;
	}

	private setDateToFieldInputs(value): void {
		let valueDate;
		if (typeof value == "string") {
			if (this._swapDM) {
				value = value.replace(/(^\d+)\.(\d+)\.(\d+)/, '\$2/\$1/\$3')
			};
			valueDate = new Date(value);
		}
		let dateElement = <HTMLInputElement>this.fieldElement.querySelector("[title]");
		dateElement.value = valueDate.format(this.shortStringFormat);
		let hoursElement = <HTMLInputElement>this.fieldElement.querySelector("select[id$='DateTimeFieldDateHours']");
		if (hoursElement)
			hoursElement.value = valueDate.format(this.hoursStringFormat).replace(/^0/, "");
		let minutesElement = <HTMLInputElement>this.fieldElement.querySelector("select[id$='DateTimeFieldDateMinutes']");
		if (minutesElement)
			minutesElement.value = valueDate.format("mm");
	}
}