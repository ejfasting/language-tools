grammar Crmscript

entry Model:
    (defs+=Def | stmts+=Stmt)*;

Def: 
    ExpressionBlock | 
    VariableDeclaration ';' | 
    Expression ';' ;

Stmt:
    IfStatement |
    WhileStatement |
    ForStatement |
    TryCatchStatement |
    PrintStatement ;

IfStatement: 
    'if' '(' condition=Expression ')' block=ExpressionBlock 
    ('else' elseBlock=ExpressionBlock)? ;

WhileStatement:
    'while' '(' condition=Expression ')' block=ExpressionBlock ;

ForStatement:
    'for' '(' init=IntegerDeclaration? ';' condition=Expression ';' increment=Increment? ')' block=ExpressionBlock ;

TryCatchStatement:
     'try' block=ExpressionBlock 'catch' '(' exception=ID ')' catchBlock=ExpressionBlock ;

Increment:
    var=ID '++';

PrintStatement: 'print' '(' value=Expression ')' ';';
ReturnStatement: 'return' value=Expression? ';';
ExpressionBlock: '{'
    (defs+=Def)*
'}';

VariableDeclaration returns NamedElement:
    {infer VariableDeclaration} StringDeclaration | {infer VariableDeclaration} IntegerDeclaration | {infer VariableDeclaration} BoolDeclaration | {infer VariableDeclaration} FloatDeclaration;

StringDeclaration:
     'String' name=ID (assignment?='=' value=Expression)?;

IntegerDeclaration:
    'Integer' name=ID (assignment?='=' value=Expression)?;

BoolDeclaration:
    'Bool' name=ID (assignment?='=' value=Expression)?;

FloatDeclaration:
    'Float' name=ID (assignment?='=' value=Expression)?;

Expression:
    Assignment;

Assignment infers Expression:
    Addition ({infer BinaryExpression.left=current} operator=('=') right=Addition)*;

Addition infers Expression:
    Multiplication ({infer BinaryExpression.left=current} operator=('+' | '-') right=Multiplication)*;

Multiplication infers Expression:
    Logical ({infer BinaryExpression.left=current} operator=('*' | '/') right=Logical)*;

Logical infers Expression:
    Comparison ({infer BinaryExpression.left=current} operator=('and' | 'or') right=Comparison)*;

Comparison infers Expression:
    MemberCall ({infer BinaryExpression.left=current} operator=('<' | '<=' | '>' | '>=' | '==' | '!=') right=MemberCall)*;

MemberCall infers Expression:
    Primary
	({infer MemberCall.previous=current} 
        // Member call with function call
        ("." element=[NamedElement:ID] (
		explicitOperationCall?='('
		(
		    arguments+=Expression (',' arguments+=Expression)*
		)?
		')')? 
        // Chained function call
        | (
		explicitOperationCall?='('
		(
		    arguments+=Expression (',' arguments+=Expression)*
		)?
		')'))
    )*;

Primary infers Expression:
    '(' Expression ')' |
    UnaryExpression |
    StringExpression |
    BooleanExpression |
    NumberExpression |
    NilExpression |
    FeatureCall;

FeatureCall infers Expression:
	{infer MemberCall}
	(element=[NamedElement:ID] | element=[NamedElement:'this'] | element=[NamedElement:'super'])
    // Optional function call after referencing an element
    (explicitOperationCall?='('
	(
	    arguments+=Expression (',' arguments+=Expression)*
	)?
	')')?;

UnaryExpression:
   operator=('!' | '-' | '+') value=Expression ;

NumberExpression: value=NUMBER;
StringExpression: value=STRING;
BooleanExpression: value?='true' | 'false';
NilExpression: value='nil';

type NamedElement =  VariableDeclaration ;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal NUMBER returns number: /[0-9]+(\.[0-9]+)?/;
terminal STRING: /"[^"]*"/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;