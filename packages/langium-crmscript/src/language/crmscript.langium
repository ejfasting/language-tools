grammar Crmscript

entry Model:
    (stmts+=Stmt | defs+=Def)*;

Stmt: Cmd;
Cmd: For;

Def: 
    'String' name=ID '=' value=STRING ';' |
    'Integer' name=ID '=' value=INT ';';

Param: name=ID;

// for x = 0 to 10 - must be changed to SuO
For: 'for' var=Param '=' e1=Expr 'to' e2=Expr Block;

Expr: Add;
Add infers Expr:
    Mult ({infer BinExpr.e1=current} op=('+'|'-') e2=Mult)*;
Mult infers Expr:
    PrimExpr ({infer BinExpr.e1=current} op=('*'|'/') e2=PrimExpr)*;
PrimExpr: Lit | Ref | Group | NegExpr;

// literal int
Lit: val=INT;
// cross-reference to parameter
Ref: val=[Param:ID];
// grouped expression with parantheses
Group: '(' ge=Expr ')';
// negated expression
NegExpr: '-' ne=Expr;

fragment Block: '{' body+=Stmt* '}'; 

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
