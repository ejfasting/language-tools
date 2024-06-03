import { AstNode } from "langium";
import { BinaryExpression, Class, isBinaryExpression, isBooleanExpression, isClass, isFieldMember, isIntegerExpression, isMemberCall, isNilExpression, isParameter, isPrintStatement, isReturnStatement, isStringExpression, isUnaryExpression, isVariableDeclaration, MemberCall } from "../generated/ast.js";
import { createBooleanType, createClassType, createErrorType, createNilType, createIntegerType, createStringType, createVoidType, isFunctionType, isStringType, TypeDescription } from "./descriptions.js";

export function inferType(node: AstNode | undefined, cache: Map<AstNode, TypeDescription>): TypeDescription {
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
    } else if (isIntegerExpression(node)) {
        type = createIntegerType(node);
    } else if (isBooleanExpression(node)) {
        type = createBooleanType(node);
    } else if (isNilExpression(node)) {
        type = createNilType();
    } 
    // else if (isFunctionDeclaration(node) || isMethodMember(node)) {
    //     const returnType = inferType(node.returnType, cache);
    //     const parameters = node.parameters.map(e => ({
    //         name: e.name,
    //         type: inferType(e.type, cache)
    //     }));
    //     type = createFunctionType(returnType, parameters);
    // } 
    else if (isMemberCall(node)) {
        type = inferMemberCall(node, cache);
        if (node.explicitOperationCall) {
            if (isFunctionType(type)) {
                type = type.returnType;
            }
        }
    } else if (isVariableDeclaration(node)) {
        if (node.type) {
            type = inferType(node, cache);
        } else if (node.value) {
            type = inferType(node.value, cache);
        } else {
            type = createErrorType('No type hint for this element', node);
        }
    } else if (isParameter(node)) {
        type = inferType(node, cache);
    } else if (isFieldMember(node)) {
        type = inferType(node.type.$nodeDescription?.node, cache);
    } else if (isClass(node)) {
        type = createClassType(node);
    } else if (isBinaryExpression(node)) {
        type = inferBinaryExpression(node, cache);
    } else if (isUnaryExpression(node)) {
        if (node.operator === '!') {
            type = createBooleanType();
        } else {
            type = createIntegerType();
        }
    } else if (isPrintStatement(node)) {
        type = createVoidType();
    } else if (isReturnStatement(node)) {
        if (!node.value) {
            type = createVoidType();
        } else {
            type = inferType(node.value, cache);
        }
    }
    if (!type) {
        type = createErrorType('Could not infer type for ' + node.$type, node);
    }
    console.log('Inferred type for ' + node.$type + ': ' + type.$type);
    cache.set(node, type);
    return type;
}

function inferMemberCall(node: MemberCall, cache: Map<AstNode, TypeDescription>): TypeDescription {
    const element = node.element?.ref;
    if (element) {
        if(isVariableDeclaration(element)){
            return inferType(element.type.$nodeDescription?.node, cache);
        }
        return inferType(element, cache);
    } else if (node.explicitOperationCall && node.previous) {
        const previousType = inferType(node.previous, cache);
        if (isFunctionType(previousType)) {
            return previousType.returnType;
        }
        return createErrorType('Cannot call operation on non-function type', node);
    }
    return createErrorType('Could not infer type for element ' + node.element?.$refText, node);
}

function inferBinaryExpression(expr: BinaryExpression, cache: Map<AstNode, TypeDescription>): TypeDescription {
    if (['-', '*', '/', '%'].includes(expr.operator)) {
        return createIntegerType();
    } else if (['and', 'or', '<', '<=', '>', '>=', '==', '!='].includes(expr.operator)) {
        return createBooleanType();
    }
    const left = inferType(expr.left, cache);
    const right = inferType(expr.right, cache);
    if (expr.operator === '+') {
        if (isStringType(left) || isStringType(right)) {
            return createStringType();
        } else {
            return createIntegerType();
        }
    } else if (expr.operator === '=') {
        return right;
    }
    return createErrorType('Could not infer type from binary expression', expr);
}

export function getClassChain(classItem: Class): Class[] {
    const set = new Set<Class>();
    let value: Class | undefined = classItem;
    while (value && !set.has(value)) {
        set.add(value);
        //value = value.superClass?.ref;
    }
    // Sets preserve insertion order
    return Array.from(set);
}