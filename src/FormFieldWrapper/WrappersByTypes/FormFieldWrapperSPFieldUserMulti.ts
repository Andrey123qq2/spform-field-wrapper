import { FormFieldWrapper } from "../FormFieldWrapper";
import { PrincipalsHelper } from "../../PrincipalsHelper";

export class FormFieldWrapperSPFieldUserMulti extends FormFieldWrapper {
	private __peoplePicker__;
	public get peoplePicker() {
		if (!this.__peoplePicker__)
			this.__peoplePicker__ = this._getPeoplePicker();
		return this.__peoplePicker__;
	}

	constructor(fieldTitle: string) {
		super(fieldTitle);
		if (!window.location.href.match(/DispForm\.aspx/i))
			this.__peoplePicker__ = this._getPeoplePicker();
	}

	public addEventListener(type: string, callback: (ev: Event) => any): void {
		//wait for copying fake pickers with name ClientPeoplePicker in calendar forms
		let timeout = (this.fieldName.match("ClientPeoplePicker")) ? 2500 : 0;
		setTimeout(() => {
			this._setEventListener(type, callback);
		},
			timeout
		);
	}

	private _setEventListener(type: string, callback: (ev: Event) => any) {
		let prevPeoplePickerHandler = this.peoplePicker.OnUserResolvedClientScript;
		let newPeoplePickerHandler = function () {
			if (prevPeoplePickerHandler)
				prevPeoplePickerHandler(arguments[0], arguments[1]);
			const event = new CustomEvent(type);
			callback(event);
		};
		this.peoplePicker.OnUserResolvedClientScript = newPeoplePickerHandler;
	}

	public toString(): string {
		return this.value.map(u => u.get_lookupValue().replace(/^[^\\]+\\/, "")).join(", ");
	}

	public get value(): any {
		if (window.location.href.match(/DispForm\.aspx/i))
			return this.getValueDispForm();
		return this._getValueSPFieldUserMulti();
	}

	public set value(value) {
		if (!value)
			this._clearPeoplePicker();
		if (value instanceof Array)
			this._setValueByArray(value);
		if ((typeof value) == "string")
			this._setValueByString(value);
	}

	private _setValueByArray(sPFieldUserValues: Array<SP.FieldUserValue> | Array<string>): void {
		if (sPFieldUserValues.length == 0) {
			return;
		};
		if (sPFieldUserValues[0] instanceof SP.FieldUserValue)
			sPFieldUserValues.forEach(v => this._setValueByString(v.get_email()));
		if (typeof sPFieldUserValues[0] == "string")
			sPFieldUserValues.forEach(v => this._setValueByString(v));
	}

	private _setValueByString(loginName: string): void {
		if (!loginName) {
			this._clearPeoplePicker();
			return;
		};
		let peoplePickerLogins = this.peoplePicker.GetAllUserInfo().map(i => i.Key);
		let pickerContainsUser = Array.contains(
			peoplePickerLogins.map(e => e.replace(/^.*\\(\\)?/, "").toLowerCase()),
			loginName.replace(/^.*\\(\\)?/, "").toLowerCase()
		);
		if (!pickerContainsUser) {
			this.peoplePicker.AddUserKeys(loginName);
		};
	}

	private _getValueSPFieldUserMulti(): Array<SP.FieldUserValue> {
		let usersPickerInfo = this._getPeoplePickerInfo();
		if (!usersPickerInfo || usersPickerInfo.length == 0) {
			return [];
		};
		let $this = this;
		let userFieldLookupAll = usersPickerInfo.map(i => {
			let userLogin = i.Key;
			let principalId = PrincipalsHelper.getPrincipalId(userLogin);
			return $this._getUserFieldLookup(principalId, userLogin, i.DisplayText);
		});
		return userFieldLookupAll;
	}

	private _getPeoplePickerInfo() {
		let usersPickerInfo: Array<any>;
		try {
			usersPickerInfo = this.peoplePicker.GetAllUserInfo();
		} catch (err) {
			console.log("field " + this.fieldElement.id + " read error. " + err);
			usersPickerInfo = [];
		}
		return usersPickerInfo;
	}

	private _getPeoplePicker(): any {
		let peoplePicker;
		let pickerDiv = this.fieldElement.parentNode.querySelector("div[id*='ClientPeoplePicker'][title]");
		try {
			peoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict[pickerDiv.getAttribute('id')]
		} catch (err) {
			console.log("No ClientPeoplePicker" + err);
			return;
		}
		return peoplePicker;
	}

	private _getUserFieldLookup(userId: number, userLogin: string, userName: string): SP.FieldUserValue {
		let userFieldLookup: any = new SP.FieldUserValue();
		userFieldLookup.set_lookupId(userId);
		userFieldLookup.$2e_1 = userLogin;
		userFieldLookup.$5c_1 = userName;
		return userFieldLookup;
	}

	private _clearPeoplePicker(): void {
		while (this.peoplePicker.TotalUserCount > 0) {
			this.peoplePicker.DeleteProcessedUser()
		}
	}
}