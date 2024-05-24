import { AstNode } from "langium";
import { BinaryExpression, BooleanExpression, isBinaryExpression, isBooleanExpression, isNilExpression, isNumberExpression, isStringExpression, isVariableDeclaration, NumberExpression, StringExpression } from "../generated/ast.js";
import { createBooleanType, createErrorType, createNilType, createNumberType, createStringType, isStringType, TypeDescription } from "./descriptions.js";

export function inferExpected(node: AstNode | undefined, cache: Map<AstNode, TypeDescription>): TypeDescription {
    let type: TypeDescription | undefined;
    if (!node) {
        return createErrorType('Could not infer type for undefined', node);
    }
    const existing = cache.get(node);
    if (existing) {
        return existing;
    }
    // Prevent recursive inference errors
    cache.set(node, createErrorType('Recursive definition', node));
    
    if (isStringExpression(node)) {
        type = createStringType(node);
    } else if (isNumberExpression(node)) {
        type = createNumberType(node);
    } else if (isBooleanExpression(node)) {
        type = createBooleanType(node);
    } else if (isNilExpression(node)) {
        type = createNilType();
    }
    else if (isVariableDeclaration(node)) {
        if (node.$type) {
            type = inferVariableType(node, cache);
        } else {
            type = createErrorType('No type hint for this element', node);
        }
    } else if (isBinaryExpression(node)) {
        type = inferBinaryExpression(node, cache);
    }     //

    if (!type) {
        type = createErrorType('Could not infer type for ' + node.$type, node);
    }
    cache.set(node, type);
    return type;
}

export function inferVariableType(node: AstNode | undefined, cache: Map<AstNode, TypeDescription>): TypeDescription {
    let type: TypeDescription | undefined;
    if (!node) {
        return createErrorType('Could not infer type for undefined', node);
    }
    const existing = cache.get(node);
    if (existing) {
        return existing;
    }
    // Prevent recursive inference errors
    cache.set(node, createErrorType('Recursive definition', node));

    // Prevent recursive inference errors
    if (node.$type === "StringDeclaration") {
        type = createStringType(node as StringExpression);
    } else if (node.$type === "IntegerDeclaration") {
        type = createNumberType(node as NumberExpression);

    }
    else if (node.$type === "BoolDeclaration") {
        type = createBooleanType(node as BooleanExpression);
    } else if (isNilExpression(node)) {
        type = createNilType();
    }
    if (!type) {
        type = createErrorType('Could not infer type for ' + node.$type, node);
    }
    cache.set(node, type);
    return type;
}

function inferBinaryExpression(expr: BinaryExpression, cache: Map<AstNode, TypeDescription>): TypeDescription {
    if (['-', '*', '/', '%'].includes(expr.operator)) {
        return createNumberType();
    } else if (['and', 'or', '<', '<=', '>', '>=', '==', '!='].includes(expr.operator)) {
        return createBooleanType();
    }
    const left = inferExpected(expr.left, cache);
    const right = inferExpected(expr.right, cache);
    if (expr.operator === '+') {
        //TODO: Add logic here to handle already defined variables
        if (isStringType(left) && isStringType(right)) {
            return createStringType();
        }        
        else {
            return createNumberType();
        }
    } else if (expr.operator === '=') {
        return right;
    }
    return createErrorType('Could not infer type from binary expression', expr);
}