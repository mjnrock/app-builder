import EnumTagType from "../../../lib/pto/Enum/TagType";

export default Object.freeze({
    TINYINT: EnumTagType.TINY,
    SMALLINT: EnumTagType.SHORT,
    INT: EnumTagType.INT,
    BIGINT: EnumTagType.LONG,

    NUMERIC: EnumTagType.STRING,
    DECIMAL: EnumTagType.STRING,
    FLOAT: EnumTagType.FLOAT,
    REAL: EnumTagType.STRING,

    BIT: EnumTagType.BOOL,

    MONEY: EnumTagType.STRING,
    SMALLMONEY: EnumTagType.STRING,

    DATE: EnumTagType.STRING,
    DATETIME: EnumTagType.STRING,
    DATETIME2: EnumTagType.STRING,
    TIME: EnumTagType.STRING,

    CHAR: EnumTagType.STRING,
    VARCHAR: EnumTagType.STRING,
    TEXT: EnumTagType.STRING,
    NCHAR: EnumTagType.STRING,
    NVARCHAR: EnumTagType.STRING,
    NTEXT: EnumTagType.STRING,

    UNIQUEIDENTIFIER: EnumTagType.UUID
});