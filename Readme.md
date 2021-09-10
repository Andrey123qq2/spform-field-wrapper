# SP-Form-Field-Wrapper
### Summary ###
The SPForm-Field-Wrapper module provides a simple interface for managing fields of classic SharePoint forms. For example, reading, setting field values, determining their type, hiding, showing, blocking, adding handlers etc. Helps to build more complex components to customize SP forms, for example: autocomple url/text fields by another sp list items or external service, setting "Title" field by another form fields, extended lookups, custom forms etc.
## Installation
```
npm install spform-field-wrapper --save
```
## Usage
### Importing
```javascript
import { FormFieldWrappersManager } from 'spform-field-wrapper';
import { FormFieldWrapper } from 'spform-field-wrapper';
```
### Getting started
Create instance of FormFieldWrappersManager class
```javascript
const ffwManager = FormFieldWrappersManager.getInstance();
```
Get field from html form
```javascript
const fieldWrapper = ffwManager.getField(fieldDispalayName);
```
Get field value
```javascript
let fieldValue = fieldWrapper.value;
```
Set field value
```javascript
fieldWrapper.value = "some value";
```
Check field type
```javascript
fieldWrapper.fieldType == "SPFieldDateTime"
```
### Available public methods
#### Class FormFieldWrappersManager
| Method | Description |
| --------- | ----------- |
|`getInstance()`| gets instance of FormFieldWrappersManager class |
|`getField()`| gets field wrapper form html SP form |
|`allFieldsWrappers()`| gets all field wrapper form html SP form |
|`resetCache()`| all field wrappers are cached, this method reinitialized this cache |

#### Class FormFieldWrapper
| Fields/properties | Description |
| --------- | ----------- |
|`fieldName`| field DisplayName |
|`fieldInternalName`| field InternalName |
|`fieldType`| field Type, ex. SPFieldDateTime |
|`fieldElement`| field html node with input element |
|`required`| field to dynamically set required flag for interactive checks |
|`value`| property to set or get field value |

Each fields types can have their own methods implementations depending on field type specific
| Method | Description |
| --------- | ----------- |
|`getValue()`| same as value |
|`setValue()`| same as value |
|`getValueDispForm()`| get value from Display Form |
|`toString()`| converts field value to string depending of field type specific |
|`getFieldType()`| get field type |
|`getType(fieldElement: Element)`| static method for getting field type |
|`hide(selector: string)`| hides closest "selector" to fieldWrapper.fieldElement.parentNode |
|`show(selector: string)`| shows closest "selector" to fieldWrapper.fieldElement.parentNode |
|`disable(selector = "[title]")`| disables closest selector to fieldWrapper.fieldElement |
|`enables(selector = "[title]")`| enables closest selector to fieldWrapper.fieldElement |
|`disableWithStyle()`| additionally to disabling adds transparent styling |
|`enableWithStyle()`| enables element disabled by disableWithStyle |
|`addEventListener()`| adds ement listener to fieldWrapper.fieldElement.firstElementChild |
|`constructor(fieldTitle: string)`| gets field wrapper instance by class constructor |

### Supported field types
1. SPFieldText
2. SPFieldChoice
3. SPFieldMultiChoice
4. SPFieldBoolean
5. SPFieldNumber
6. SPFieldDateTime
7. SPFieldURL
8. SPFieldUser
9. SPFieldUserMulti
10. SPFieldLookup
11. SPFieldLookupMulti
12. SPFieldFilteredLookupField
13. SPFieldNote
14. SPFieldCurrency
16. SPFieldCalculated
16. CustomFieldData (virtual field manually added to html form, value can be any html code)