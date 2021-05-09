import { FormFieldWrapper } from "../FormFieldWrapper";

export class FormFieldWrapperSPFieldNote extends FormFieldWrapper {
	constructor(fieldTitle: string) {
		super(fieldTitle);
	}

	public get value(): any {
		if (window.location.href.match(/DispForm\.aspx/i))
			return this.getValueDispForm();
		return this.fieldElement.querySelector("textarea").value;
	}

	public set value(value) {
		this.fieldElement.querySelector("textarea").value = value;
	}

	public enable(): void {
		super.enable(".ms-rtestate-write");
		super.enableWithStyle();
	}

	public disable(): void {
		super.disable(".ms-rtestate-write");
		super.disableWithStyle();
	}
}