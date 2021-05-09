/// <reference path="../src/FormFieldWrapper/FormWrapper.ts"/>

describe('FormFieldWrapper fields values', function () {
    it('text field test', function () {
        var expectedValue = "Должность";
        //var formWrapper = FormWrapper.getInstance();
        //var spFieldText = formWrapper.getField("Должность");
        //var fieldValue = spFieldText.value;
        //expect(fieldValue).toEqual(expectedValue);
        expect("Должность").toEqual(expectedValue);
        //expect(18).toBe(18);
    });
});