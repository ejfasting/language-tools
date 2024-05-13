import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { CrmscriptAstType, Model } from './generated/ast.js';
import type { CrmscriptServices } from './crmscript-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: CrmscriptServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.CrmscriptValidator;
    const checks: ValidationChecks<CrmscriptAstType> = {
        Model: validator.checkModel,
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class CrmscriptValidator {

    checkModel(model: Model, accept: ValidationAcceptor): void {
        const defs = model.defs;
        const previousNames = new Set<string>();
        for (const def of defs) {
            if (previousNames.has(def.name)) {
                accept('error', `Duplicate name '${def.name}'`, { node: def, property: 'name' });
            } else {
                previousNames.add(def.name);
            }
        }
    }

}
