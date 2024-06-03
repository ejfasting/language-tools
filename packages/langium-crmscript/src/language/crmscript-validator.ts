import { AstNode, ValidationAcceptor, type ValidationChecks } from 'langium';
import type { CrmscriptServices } from './crmscript-module.js';
import { BinaryExpression, Class, CrmscriptAstType, Expression, UnaryExpression, VariableDeclaration } from './generated/ast.js';
import { isAssignable } from './type-system/assignment.js';
import { typeToString, TypeDescription } from './type-system/descriptions.js';
import { inferType } from './type-system/infer.js';
import { isLegalOperation } from './type-system/operator.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: CrmscriptServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.CrmscriptValidator;
    const checks: ValidationChecks<CrmscriptAstType> = {
        BinaryExpression: validator.checkBinaryOperationAllowed,
        UnaryExpression: validator.checkUnaryOperationAllowed,
        VariableDeclaration: validator.checkVariableDeclaration,
        //MethodMember: validator.checkMethodReturnType,
        Class: validator.checkClassDeclaration,
        //FunctionDeclaration: validator.checkFunctionReturnType,
        Expression: validator.checkExpressionAllowed
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class CrmscriptValidator {
    checkExpressionAllowed(expression: Expression, accept: ValidationAcceptor): void {
        // if(expression.$type === 'BinaryExpression'){
        //     accept('error', 'Expressions are currently unsupported.', {
        //         node: expression
        //     });
        // }
    }

    // checkFunctionReturnType(func: FunctionDeclaration, accept: ValidationAcceptor): void {
    //     this.checkFunctionReturnTypeInternal(func.body, func.returnType, accept);
    // }

    // checkMethodReturnType(method: MethodMember, accept: ValidationAcceptor): void {
    //     this.checkFunctionReturnTypeInternal(method.body, method.returnType, accept);
    // }

    // TODO: implement classes 
    checkClassDeclaration(declaration: Class, accept: ValidationAcceptor): void {
        // accept('error', 'Classes are currently unsupported.', {
        //     node: declaration,
        //     property: 'name'
        // });
    }

    // private checkFunctionReturnTypeInternal(body: ExpressionBlock, returnType: TypeReference, accept: ValidationAcceptor): void {
    //     const map = this.getTypeCache();
    //     const returnStatements = AstUtils.streamAllContents(body).filter(isReturnStatement).toArray();
    //     const expectedType = inferType(returnType, map);
    //     if (returnStatements.length === 0 && !isVoidType(expectedType)) {
    //         accept('error', "A function whose declared type is not 'void' must return a value.", {
    //             node: returnType
    //         });
    //         return;
    //     }
    //     for (const returnStatement of returnStatements) {
    //         const returnValueType = inferType(returnStatement, map);
    //         if (!isAssignable(returnValueType, expectedType)) {
    //             accept('error', `Type '${typeToString(returnValueType)}' is not assignable to type '${typeToString(expectedType)}'.`, {
    //                 node: returnStatement
    //             });
    //         }
    //     }
    // }

    checkVariableDeclaration(decl: VariableDeclaration, accept: ValidationAcceptor): void {
        if (decl.type && decl.value) {
            const map = this.getTypeCache();
            const left = inferType(decl.type.$nodeDescription?.node, map);
            const right = inferType(decl.value, map);
            if (!isAssignable(right, left)) {
                accept('error', `Type '${typeToString(right)}' is not assignable to type '${typeToString(left)}'.`, {
                    node: decl,
                    property: 'value'
                });
            }
        }
        //TODO: can probably just remove this, as all variables are strongly typed?
        else if (!decl.type && !decl.value) {
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
            })
        } else if (binary.operator === '=') {
            if (!isAssignable(right, left)) {
                accept('error', `Type '${typeToString(right)}' is not assignable to type '${typeToString(left)}'.`, {
                    node: binary,
                    property: 'right'
                })
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

    checkUnaryOperationAllowed(unary: UnaryExpression, accept: ValidationAcceptor): void {
        const item = inferType(unary.value, this.getTypeCache());
        if (!isLegalOperation(unary.operator, item)) {
            accept('error', `Cannot perform operation '${unary.operator}' on value of type '${typeToString(item)}'.`, {
                node: unary
            });
        }
    }

    private getTypeCache(): Map<AstNode, TypeDescription> {
        return new Map();
    }
}
