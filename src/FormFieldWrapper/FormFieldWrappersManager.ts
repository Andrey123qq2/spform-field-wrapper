import { FieldsContextesCache } from "./FieldsContextesCache";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { IFieldContext } from "./IFieldContext";
import { FormFieldWrapperSPFieldBoolean } from "./WrappersByTypes/FormFieldWrapperSPFieldBoolean";
import { FormFieldWrapperSPFieldChoice } from "./WrappersByTypes/FormFieldWrapperSPFieldChoice";
import { FormFieldWrapperSPFieldDateTime } from "./WrappersByTypes/FormFieldWrapperSPFieldDateTime";
import { FormFieldWrapperSPFieldFilteredLookupField } from "./WrappersByTypes/FormFieldWrapperSPFieldFilteredLookupField";
import { FormFieldWrapperSPFieldLookup } from "./WrappersByTypes/FormFieldWrapperSPFieldLookup";
import { FormFieldWrapperSPFieldLookupMulti } from "./WrappersByTypes/FormFieldWrapperSPFieldLookupMulti";
import { FormFieldWrapperSPFieldMultiChoice } from "./WrappersByTypes/FormFieldWrapperSPFieldMultiChoice";
import { FormFieldWrapperSPFieldNote } from "./WrappersByTypes/FormFieldWrapperSPFieldNote";
import { FormFieldWrapperSPFieldNumber } from "./WrappersByTypes/FormFieldWrapperSPFieldNumber";
import { FormFieldWrapperSPFieldText } from "./WrappersByTypes/FormFieldWrapperSPFieldText";
import { FormFieldWrapperSPFieldURL } from "./WrappersByTypes/FormFieldWrapperSPFieldURL";
import { FormFieldWrapperSPFieldUser } from "./WrappersByTypes/FormFieldWrapperSPFieldUser";
import { FormFieldWrapperSPFieldUserMulti } from "./WrappersByTypes/FormFieldWrapperSPFieldUserMulti";
import { FormFieldWrapperSPFieldCurrency } from "./WrappersByTypes/FormFieldWrapperSPFieldCurrency";
import { FormFieldWrapperSPFieldCalculated } from "./WrappersByTypes/FormFieldWrapperSPFieldCalculated";
import { FormFieldWrapperCustomFieldData } from "./WrappersByTypes/FormFieldWrapperCustomFieldData";

interface IFieldsWrappersCache {
    [key: string]: FormFieldWrapper
}

export class FormFieldWrappersManager {
    private static instance: FormFieldWrappersManager;
    private readonly _defaultType = "SPFieldText";
    private static readonly subClassesMap: Record<string, any> = {
        "SPFieldText": (fieldTitle: string) => new FormFieldWrapperSPFieldText(fieldTitle),
        "SPFieldChoice": (fieldTitle: string) => new FormFieldWrapperSPFieldChoice(fieldTitle),
        "SPFieldMultiChoice": (fieldTitle: string) => new FormFieldWrapperSPFieldMultiChoice(fieldTitle),
        "SPFieldBoolean": (fieldTitle: string) => new FormFieldWrapperSPFieldBoolean(fieldTitle),
        "SPFieldNumber": (fieldTitle: string) => new FormFieldWrapperSPFieldNumber(fieldTitle),
        "SPFieldDateTime": (fieldTitle: string) => new FormFieldWrapperSPFieldDateTime(fieldTitle),
        "SPFieldURL": (fieldTitle: string) => new FormFieldWrapperSPFieldURL(fieldTitle),
        "SPFieldUser": (fieldTitle: string) => new FormFieldWrapperSPFieldUser(fieldTitle),
        "SPFieldUserMulti": (fieldTitle: string) => new FormFieldWrapperSPFieldUserMulti(fieldTitle),
        "SPFieldLookup": (fieldTitle: string) => new FormFieldWrapperSPFieldLookup(fieldTitle),
        "SPFieldLookupMulti": (fieldTitle: string) => new FormFieldWrapperSPFieldLookupMulti(fieldTitle),
        "SPFieldFilteredLookupField": (fieldTitle: string) => new FormFieldWrapperSPFieldFilteredLookupField(fieldTitle),
        "SPFieldNote": (fieldTitle: string) => new FormFieldWrapperSPFieldNote(fieldTitle),
        "SPFieldCurrency": (fieldTitle: string) => new FormFieldWrapperSPFieldCurrency(fieldTitle),
        "SPFieldCalculated": (fieldTitle: string) => new FormFieldWrapperSPFieldCalculated(fieldTitle),
        "CustomFieldData": (fieldTitle: string) => new FormFieldWrapperCustomFieldData(fieldTitle),
    };
    private __fieldsToWrappersAndContextesCache__: IFieldsWrappersCache;
    private get _fieldsToWrappersAndContextesCache(): IFieldsWrappersCache {
        if (!this.__fieldsToWrappersAndContextesCache__)
            this.initialize();
        return this.__fieldsToWrappersAndContextesCache__;
    }
    private _allFieldsWrappersCache: Array<FormFieldWrapper>;
    
    public static factory(fieldContext: IFieldContext): FormFieldWrapper {
        let subClassInstance = this.subClassesMap[fieldContext.FieldType](fieldContext.FieldName);
        return subClassInstance;
    }

    private constructor() { }

    public static getInstance(): FormFieldWrappersManager {
		if (!FormFieldWrappersManager.instance) {
			FormFieldWrappersManager.instance = new FormFieldWrappersManager();
		}
		return FormFieldWrappersManager.instance;
	}

    public getField(fieldTitle: string): FormFieldWrapper {
        let fieldWrapper = this._fieldsToWrappersAndContextesCache[fieldTitle];
        return fieldWrapper;
    }

    private getAllFieldsWrappers(): Array<FormFieldWrapper> {
        let fieldsWrappers: Array<FormFieldWrapper> = [];
        Object.keys(this._fieldsToWrappersAndContextesCache)
            .forEach(f => fieldsWrappers.push(this._fieldsToWrappersAndContextesCache[f]));
        return fieldsWrappers;
    }

    public get allFieldsWrappers(): Array<FormFieldWrapper> {
        return this._allFieldsWrappersCache;
    }

    public resetCache() {
        this.__fieldsToWrappersAndContextesCache__ = null;
        FieldsContextesCache.resetCache();
    }

    private initialize(): void {
        this.__fieldsToWrappersAndContextesCache__ = this._getDataForCache();
        this._allFieldsWrappersCache = this.getAllFieldsWrappers();
    }

    private _getDataForCache(): IFieldsWrappersCache {
        let fieldsWrappersMap: IFieldsWrappersCache = {};
        let allContextes = FieldsContextesCache.getAllContextes();

        Object.keys(allContextes).forEach(c => {
            let fieldWrapper;
            let fieldContext = allContextes[c]
            try {
                fieldWrapper = FormFieldWrappersManager.factory(fieldContext);
            } catch (err) {
                console.log("FormFieldWrapper Error: " + err);
                return;
            }
            fieldsWrappersMap[fieldContext.FieldName] = fieldWrapper;
        })
        return fieldsWrappersMap;
    }
}