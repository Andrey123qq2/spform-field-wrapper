import { FormFieldWrappersCache } from "./FormFieldWrappersCache";
import { FormFieldWrapper } from "./FormFieldWrapper";

export class FormWrapper {
	private static instance: FormWrapper;
	public static getInstance(): FormWrapper {
		if (!FormWrapper.instance) {
			FormWrapper.instance = new FormWrapper();
		}
		return FormWrapper.instance;
	}
    private constructor() { }

    public getField(fieldTitle: string): FormFieldWrapper {
        return FormFieldWrappersCache.getField(fieldTitle);
    }

    public setFieldsBySPListItem(listItem: SP.ListItem, fieldsMap: Array<Array<string>> = []): void {
        let processedUserFields: Array<string> = [];
        fieldsMap.forEach(fMap => {
            let lookupFieldValue = listItem.get_item(fMap[0]);
            if (lookupFieldValue == null || typeof lookupFieldValue == "undefined")
                return;
            let formField = fMap[1];
            let fieldWrapper = FormFieldWrappersCache.getField(formField);
            // set null to user field only if it is filled first time in this loop
            if (fieldWrapper.fieldType.match("User") && processedUserFields.indexOf(formField) == -1) {
                fieldWrapper.value = null;
                processedUserFields.push(formField);
            };
            // set empty array instead of null userFieldValue if this field was processed
            if (fieldWrapper.fieldType.match("User") && processedUserFields.indexOf(formField) != -1 && lookupFieldValue == null)
                lookupFieldValue = [];
            fieldWrapper.value = lookupFieldValue;
        });
    }

    public getCurrentItemSPFieldUrlValue(description: string): SP.FieldUrlValue {
        let currentItemUrl = location.href.replace("EditForm", "DispForm").replace(/&.*$/, "");
        var fieldUrlValue = new SP.FieldUrlValue();
        fieldUrlValue.set_url(currentItemUrl);
        fieldUrlValue.set_description(description);
        return fieldUrlValue;
    }

    public addHtmlAfterSelector(html: string, afterSelector: string): void {
        let wrappedHtml = "<div style='margin-top: 4px;'>" + html + "</div>";
        let htmlToNode = new DOMParser().parseFromString(wrappedHtml, 'text/html').body.childNodes[0];
        document.querySelector(afterSelector).appendChild(htmlToNode); //".related-tasks"
    }

    public addFieldAfter(fieldTitle: string, fieldContent: string, fielTitleAfter: string): void {
        var tableRowHtml = "<td nowrap=\"true\" valign=\"top\" width=\"113px\" class=\"ms-formlabel\">\
		<h3 class=\"ms-standardheader\"><nobr>" + fieldTitle + "</nobr></h3></td>\
		<td valign=\"top\" width=\"350px\" class=\"ms-formbody\">" + fieldContent + "</td>";
        let formHeaders = document.querySelectorAll(".ms-h3.ms-standardheader");
        Array.prototype.slice.call(formHeaders).forEach(h => {
            if (h.innerText.trim() == fielTitleAfter) {
                let fieldTableRow = h.closest("tr");
                let newTableRow = document.createElement("tr");
                newTableRow.innerHTML = tableRowHtml;
                fieldTableRow.after(newTableRow);
            };
        });
    }
}