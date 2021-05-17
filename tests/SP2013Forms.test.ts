import { FormWrapper } from '../src/FormFieldWrapper/FormWrapper';
import { FormFieldWrappersCache } from '../src/FormFieldWrapper/FormFieldWrappersCache';
const fs = require('fs');
const path = require('path');
jest.dontMock('fs');

function getFormFieldValue(fieldName: string): any {
  let formWrapper = FormWrapper.getInstance();
  let formField = formWrapper.getField(fieldName);
  return formField.value;
}

describe('EditForm - get fields values', () => {
  beforeAll(() => {
    const editFormHtml = fs.readFileSync(path.resolve(__dirname, './static/SP2013_CustomList_EditForm.html'), 'utf8');
    document.body.innerHTML = editFormHtml;
  });
  test('BooleanField Test (editForm)', () => {
    let expectedFieldValue = true;  
    let fieldName = "BooleanField";
    expect(getFormFieldValue(fieldName)).toBe(expectedFieldValue);
  });
  test('TextField Test (editForm)', () => {
    let expectedFieldValue = "test string";  
    let fieldName = "Text Field";
    expect(getFormFieldValue(fieldName)).toBe(expectedFieldValue);
  });
  test('MultiTextFieldBase Test (editForm)', () => {
    let expectedFieldValue = "test multistring1\ntest multistring2";  
    let fieldName = "MultiText FieldBase";
    expect(getFormFieldValue(fieldName)).toBe(expectedFieldValue);
  });
  test('ChoiceField Test (editForm)', () => {
    let expectedFieldValue = "Option2";  
    let fieldName = "Choice MenuField";
    expect(getFormFieldValue(fieldName)).toBe(expectedFieldValue);
  });
  test('ChoiceFieldRadio Test (editForm)', () => {
    let expectedFieldValue = "Option3";  
    let fieldName = "Choice RadioField";
    expect(getFormFieldValue(fieldName)).toBe(expectedFieldValue);
  });
  test('ChoiceFieldFlags Test (editForm)', () => {
    let expectedFieldValue = ["Option1", "Option3"];  
    let fieldName = "Choice FlagsField";
    expect(getFormFieldValue(fieldName)).toEqual(expectedFieldValue);
  });
  
  
  
});
describe('DisplayForm - get fields values', () => {
  beforeAll(() => {
    FormFieldWrappersCache.resetCache();
    const dispFormHtml = fs.readFileSync(path.resolve(__dirname, './static/SP2013_CustomList_DispForm.html'), 'utf8');
    document.body.innerHTML = dispFormHtml;
    global.window = Object.create(window);
    const url = "DispForm.aspx";
    Object.defineProperty(window, "location", {
        value: {
          href: url
        },
        writable: true
    });
  });
  test('BooleanField Test (dispForm)', () => {
    let expectedFieldValue = "Да";  
    let fieldName = "BooleanField";
    expect(getFormFieldValue(fieldName)).toBe(expectedFieldValue);
  });
  test('TextField Test (dispForm)', () => {
    let expectedFieldValue = "test string";
    let fieldName = "Text Field";
    expect(getFormFieldValue(fieldName)).toBe(expectedFieldValue);
  });
  test('MultiTextFieldBase Test (dispForm)', () => {
    let expectedFieldValue = "test multistring1\ntest multistring2";  
    let fieldName = "MultiText FieldBase";
    expect(getFormFieldValue(fieldName)).toBe(expectedFieldValue);
  });
  test('ChoiceField Test (dispForm)', () => {
    let expectedFieldValue = "Option2";  
    let fieldName = "Choice MenuField";
    expect(getFormFieldValue(fieldName)).toBe(expectedFieldValue);
  });
  test('ChoiceFieldRadio Test (dispForm)', () => {
    let expectedFieldValue = "Option3";  
    let fieldName = "Choice RadioField";
    expect(getFormFieldValue(fieldName)).toBe(expectedFieldValue);
  });
  test('ChoiceFieldFlags Test (dispForm)', () => {
    let expectedFieldValue = ["Option1", "Option3"];  
    let fieldName = "Choice FlagsField";
    expect(getFormFieldValue(fieldName)).toEqual(expectedFieldValue);
  });
});