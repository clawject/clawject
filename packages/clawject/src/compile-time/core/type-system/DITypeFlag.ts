export enum DITypeFlag {
  UNRESOLVABLE = -3,
  UNSUPPORTED = -2,
  ANONYMOUS = -1,

  //BASE
  ANY,
  UNKNOWN,
  NEVER,
  VOID,
  UNDEFINED,
  NULL,
  STRING,
  NUMBER,
  BOOLEAN,
  ENUM,
  BIGINT,
  SYMBOL,

  //LITERALS
  STRING_LITERAL,
  NUMBER_LITERAL,
  BOOLEAN_LITERAL,
  ENUM_LITERAL,
  BIGINT_LITERAL,

  //COMPLEX
  UNIQUE_SYMBOL,
  TYPE_REFERENCE, //class, interface, type alias is not supported for now
  UNION,
  INTERSECTION,
  TUPLE,
}
