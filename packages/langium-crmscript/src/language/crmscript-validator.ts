import type { AstNode, ValidationAcceptor, ValidationChecks } from 'langium';
import { BinaryExpression, NumberExpression, type CrmscriptAstType, type VariableDeclaration} from './generated/ast.js';
import type { CrmscriptServices } from './crmscript-module.js';
import { inferType } from './type-system/infer.js';
import { TypeDescription, typeToString } from './type-system/descriptions.js';
import { isAssignable } from './type-system/assignment.js';
import { isLegalOperation } from './type-system/operator.js';
/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: CrmscriptServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.crmscriptValidator;
    const checks: ValidationChecks<CrmscriptAstType> = {
        //BinaryExpression: validator.checkBinaryOperationAllowed,
        VariableDeclaration: validator.checkVariableDeclaration,
        NumberExpression: validator.checkNumberExpression
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class CrmscriptValidator {
    checkVariableDeclaration(decl: VariableDeclaration, accept: ValidationAcceptor): void {
        if (decl.type && decl.value) {
            const map = this.getTypeCache();
            const left = inferType(decl.type, map);
            const right = inferType(decl.value, map);
            if (!isAssignable(right, left)) {
                accept('error', `Type '${typeToString(right)}' is not assignable to type '${typeToString(left)}'.`, {
                    node: decl,
                    property: 'value'
                });
            }
        } else if (!decl.type && !decl.value) {
            accept('error', 'Variables require a type hint or an assignment at creation', {
                node: decl,
                property: 'name'
            });
        }
    }

    checkBinaryOperationAllowed(binary: BinaryExpression, accept: ValidationAcceptor): void {
        const map = this.getTypeCache();
        const left = inferType(binary.left, map);
        const right = inferType(binary.right, map);
        if (!isLegalOperation(binary.operator, left, right)) {
            accept('error', `Cannot perform operation '${binary.operator}' on values of type '${typeToString(left)}' and '${typeToString(right)}'.`, {
                node: binary
            });
        } else if (binary.operator === '=') {
            if (!isAssignable(right, left)) {
                accept('error', `Type '${typeToString(right)}' is not assignable to type '${typeToString(left)}'.`, {
                    node: binary,
                    property: 'right'
                });
            }
        } else if (['==', '!='].includes(binary.operator)) {
            if (!isAssignable(right, left)) {
                accept('warning', `This comparison will always return '${binary.operator === '==' ? 'false' : 'true'}' as types '${typeToString(left)}' and '${typeToString(right)}' are not compatible.`, {
                    node: binary,
                    property: 'operator'
                });
            }
        }
    }

    checkNumberExpression(node: NumberExpression, accept: ValidationAcceptor): void {
        if (typeof node.value !== 'number') {
            accept('error', `Invalid number value`, { node });
        }
    }
    private getTypeCache(): Map<AstNode, TypeDescription> {
        return new Map();
    }
}
