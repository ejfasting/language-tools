import type { AstNode, ValidationAcceptor, ValidationChecks } from 'langium';
import { Expression, NumberExpression, type CrmscriptAstType, type VariableDeclaration} from './generated/ast.js';
import type { CrmscriptServices } from './crmscript-module.js';
import { inferExpected, inferVariableType } from './type-system/infer.js';
import { TypeDescription, typeToString } from './type-system/descriptions.js';
import { isAssignable } from './type-system/assignment.js';
/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: CrmscriptServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.CrmscriptValidator;
    const checks: ValidationChecks<CrmscriptAstType> = {
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
        if (decl.$type && decl.value) {
            const map = this.getTypeCache();

            const left = inferVariableType(decl, map);
            const right = inferExpected(decl.value, map);
            
            // Check if the types are compatible
            if (!isAssignable(left, right)) {
                accept('error', `Type '${typeToString(right)}' is not assignable to type '${typeToString(left)}'.`, {
                    node: decl,
                    property: 'value'
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
