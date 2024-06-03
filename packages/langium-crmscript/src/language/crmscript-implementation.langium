grammar CrmscriptImplementation

import "crmscript-definition";

entry ImplementationUnit:
    (elements+=CrmscriptElement)*;

CrmscriptElement:
    Builtin 
    // | IfStatement
    // | WhileStatement
    // | ForStatement
    // | TryCatchStatement
    // | FunctionDeclaration
    | VariableDeclaration ';'
    // | PrintStatement
    // | Expression ';'
;

Builtin:
    class=([Class:ID]) name=ID;

// IfStatement:
//     'if' '(' condition=Expression ')' block=ExpressionBlock
//     ('else' elseBlock=ExpressionBlock)?
// ;

// WhileStatement:
//     'while' '(' condition=Expression ')' block=ExpressionBlock
// ;

// ForStatement:
//     'for' '(' counter=VariableDeclaration? ';' condition=Expression ';' execution=Increment? ')' block=ExpressionBlock
// ;

// Increment:
//     var=ID '++'
// ;

// TryCatchStatement:
//     'try' block=ExpressionBlock 'catch' '(' exception=ID ')' catchBlock=ExpressionBlock
// ;

// PrintStatement:
//     'print' '(' value=Expression ')'
// ;