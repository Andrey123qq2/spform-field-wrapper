import { FormFieldWrapper } from "../FormFieldWrapper";

export class FormFieldWrapperSPFieldCalculated extends FormFieldWrapper {
	constructor(fieldTitle: string) {
		super(fieldTitle);
	}

	public get value(): string {
        return this.getValueDispForm();
	}
}