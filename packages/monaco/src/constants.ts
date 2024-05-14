export const languages: Language[] = [
    {
        id: 'crmscript',
        fileExtension: '.crmscript',
        initialCode: `Integer myInt = "123";
Integer myInt2 = 123;
        
String myString = 123;
String myString2 = "123";`
    },
    {
        id: 'jsfso',
        fileExtension: '.jsfso',
        initialCode: `const cAgent = new RTL.ContactAgent();
const cEntity = await cAgent.createDefaultContactEntityAsync();
cEntity.name = "BigCompany AS";
        
const pAgent = new RTL.PersonAgent();
const pEntity = await pAgent.createDefaultPersonEntityAsync();
pEntity.firstname = "123";`
    }
];

export interface Language {
    id: string;
    fileExtension: string;
    initialCode: string;
}