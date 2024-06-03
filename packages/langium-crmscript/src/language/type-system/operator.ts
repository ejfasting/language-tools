import { TypeDescription } from "./descriptions.js";

export function isLegalOperation(operator: string, left: TypeDescription, right?: TypeDescription): boolean {
    if (operator === '+') {
        if (!right) {
            return left.$type === 'Integer';
        }
        return (left.$type === 'Integer' || left.$type === 'String')
            && (right.$type === 'Integer' || right.$type === 'String')
    } else if (['-', '/', '*', '%', '<', '<=', '>', '>='].includes(operator)) {
        if (!right) {
            return left.$type === 'Integer';
        }
        return left.$type === 'Integer' && right.$type === 'Integer';
    } else if (['and', 'or'].includes(operator)) {
        return left.$type === 'boolean' && right?.$type === 'boolean';
    } else if (operator === '!') {
        return left.$type === 'boolean';
    }
    return true;
}