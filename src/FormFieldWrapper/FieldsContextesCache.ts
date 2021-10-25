import { IFieldContext } from "./IFieldContext";

interface IFieldsContextesMap {
    [key: string]: IFieldContext
}

export class FieldsContextesCache {
    private static __fieldsToContextesCache__: IFieldsContextesMap;
    private static get _fieldsToContextesCache(): IFieldsContextesMap {
        if (!this.__fieldsToContextesCache__)
            this.initialize();
        return this.__fieldsToContextesCache__;
    }

    public static getContext(fieldTitle: string): IFieldContext {
        let fieldContext = this._fieldsToContextesCache[fieldTitle];
        return fieldContext;
    }

    public static getAllContextes(): IFieldsContextesMap {
        return this._fieldsToContextesCache;
    }

    public static resetCache() {
        this.__fieldsToContextesCache__ = null;
    }

    private static initialize(): void {
        this.__fieldsToContextesCache__ = this._getFieldsContextesMap();
    }

    private static _getFieldsContextesMap(): IFieldsContextesMap {
        let fieldsContextesMap: IFieldsContextesMap = {};
        let fieldsNodes = (window.location.href.match(/DispForm\.aspx/i)) ? 
            this._getFieldsNodesFromDisplayForm() :
            this._getFieldsNodes();
        let fieldsNodesAttachments = this._getFieldsNodesAttachments();
        let fieldsNodesAll = fieldsNodes.concat(fieldsNodesAttachments);
        fieldsNodesAll
        .filter(n => !!n)
        .forEach(node => {
            let fieldContext: IFieldContext;
            try {
                fieldContext = this._getFieldContextFromNode(node);
            } catch (err) {
                console.log("_getFieldContextFromNode Error: " + err);
                return;
            }
            fieldsContextesMap[fieldContext.FieldName] = fieldContext;
        });
        return fieldsContextesMap;
    }

    private static _getFieldsNodes(): Array<Element> {
        let fieldsNodes = (!window.location.href.match(/DispForm\.aspx/i))
            ? document.querySelectorAll("[dir=none]")
            : document.querySelectorAll("table.ms-formtable td.ms-formbody, span.hillbillyForm");
        let fieldsNodesArray = Array.prototype.slice.call(fieldsNodes);
        return fieldsNodesArray;
    }

    private static _getFieldsNodesFromDisplayForm(): Array<Node> {
        let fieldsNodes = document.querySelectorAll("table.ms-formtable td.ms-formbody, span.hillbillyForm");
        let fieldsNodesArray = Array.prototype.slice.call(fieldsNodes).map(n => n.lastChild);
        return fieldsNodesArray;
    }

    private static _getFieldsNodesAttachments(): Array<Element> {
        let fieldsNodes = document.querySelectorAll("table#idAttachmentsTable");
        let fieldsNodesArray = Array.prototype.slice.call(fieldsNodes);
        return fieldsNodesArray;
    }

    private static _getFieldContextFromNode(fieldNode: any): IFieldContext {
        let fieldInnerHTML = (fieldNode.parentNode.id.match("_ClientPeoplePicker"))
            ? fieldNode.parentNode.parentNode.innerHTML
            : fieldNode.parentNode.innerHTML;
        let fieldContext: IFieldContext = {
            FieldName: fieldInnerHTML.match(/FieldName=\"([^\"]+)/)[1],
            FieldInternalName: fieldInnerHTML.match(/FieldInternalName=\"([^\"]+)/)[1],
            FieldType: fieldInnerHTML.match(/FieldType=\"([^\"]+)/)[1],
            FieldElement: fieldNode
        };
        return fieldContext;
    }
}