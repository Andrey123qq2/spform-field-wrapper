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

interface IFieldsWrappersCache {
    [key: string]: FormFieldWrapper
}

export class FormFieldWrappersCache {
    private static readonly _defaultType = "SPFieldText";
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
    };
    private static __fieldsToWrappersAndContextesCache__: IFieldsWrappersCache;
    private static get _fieldsToWrappersAndContextesCache(): IFieldsWrappersCache {
        if (!this.__fieldsToWrappersAndContextesCache__)
            this.initialize();
        return this.__fieldsToWrappersAndContextesCache__;
    }

    public static getField(fieldTitle: string): FormFieldWrapper {
        let fieldWrapper = this._fieldsToWrappersAndContextesCache[fieldTitle];
        return fieldWrapper;
    }

    public static resetCache() {
        this.__fieldsToWrappersAndContextesCache__ = null;
        FieldsContextesCache.resetCache();
    }

    private static initialize(): void {
        this.__fieldsToWrappersAndContextesCache__ = this._getDataForCache();
    }

    private static _getDataForCache(): IFieldsWrappersCache {
        let fieldsWrappersMap: IFieldsWrappersCache = {};
        let allContextes = FieldsContextesCache.getAllContextes();

        Object.keys(allContextes).forEach(c => {
            let fieldWrapper;
            let fieldContext = allContextes[c]
            try {
                fieldWrapper = FormFieldWrappersCache.factory(fieldContext);
            } catch (err) {
                console.log("FormFieldWrapper Error: " + err);
                return;
            }
            fieldsWrappersMap[fieldContext.FieldName] = fieldWrapper;
        })
        return fieldsWrappersMap;
    }

    public static factory(fieldContext: IFieldContext): FormFieldWrapper {
        let subClassInstance = this.subClassesMap[fieldContext.FieldType](fieldContext.FieldName);
        return subClassInstance;
    }
}