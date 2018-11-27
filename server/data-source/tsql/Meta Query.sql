SELECT
	cols.SchemaName,
	cols.TableName,
	cols.ColumnName,
	cols.OrdinalPosition,
	cols.DataType,
	cols.DataTypeLength,
	
	fkcols.FKSchemaName,
	fkcols.FKTableName,
	fkcols.FKColumnName,
	fkcols.FKOrdinalPosition,
	fkcols.FKDataType,
	fkcols.FKDataTypeLength
FROM
	(
		SELECT
			s.name AS SchemaName,
			o.name AS TableName,
			c.name AS ColumnName,
			c.colid AS OrdinalPosition,
			UPPER(t.name) AS DataType,
			c.[length] AS DataTypeLength
		FROM
			sysobjects o
			INNER JOIN syscolumns c
				ON o.id = c.id
			INNER JOIN systypes t
				ON c.xtype = t.xtype
			INNER JOIN sys.tables tbl
				ON o.id = tbl.object_id
			INNER JOIN sys.schemas s
				ON tbl.schema_id = s.schema_id
		WHERE
			o.xtype = 'U'
	) cols
	LEFT JOIN (
		SELECT
			s.name AS SchemaName,
			OBJECT_NAME(f.parent_object_id) AS TableName,
			COL_NAME(fc.parent_object_id, fc.parent_column_id) AS ColumnName,
			c.column_id AS OrdinalPosition,
			UPPER(ty.name) AS DataType,
			c.max_length AS DataTypeLength,
			fks.name AS FKSchemaName,
			OBJECT_NAME(f.referenced_object_id) AS FKTableName,
			COL_NAME(fc.referenced_object_id, fc.referenced_column_id) AS FKColumnName,		
			fkc.column_id AS FKOrdinalPosition,	
			UPPER(fkty.name) AS FKDataType,
			fkc.max_length AS FKDataTypeLength,
			delete_referential_action_desc AS FKDeleteAction,
			update_referential_action_desc AS FKUpdateAction
		FROM
			sys.foreign_keys f
			INNER JOIN sys.foreign_key_columns fc
				ON f.object_id = fc.constraint_object_id
			INNER JOIN sys.tables t
				ON f.parent_object_id = t.object_id
			INNER JOIN sys.schemas s
				ON t.schema_id = s.schema_id
			INNER JOIN sys.columns c
				ON t.object_id = c.object_id
				AND c.column_id = fc.parent_column_id
			INNER JOIN sys.types ty
				ON c.user_type_id = ty.user_type_id
				
			INNER JOIN sys.tables fkt
				ON fc.referenced_object_id = fkt.object_id
			INNER JOIN sys.schemas fks
				ON fkt.schema_id = fks.schema_id
			INNER JOIN sys.columns fkc
				ON fkt.object_id = fkc.object_id
				AND fkc.column_id = fc.referenced_column_id
			INNER JOIN sys.types fkty
				ON fkc.user_type_id = fkty.user_type_id
	) fkcols
		ON cols.SchemaName = fkcols.SchemaName
		AND cols.TableName = fkcols.TableName
		AND cols.ColumnName = fkcols.ColumnName
ORDER BY
	cols.TableName,
	cols.OrdinalPosition,
	fkcols.FKOrdinalPosition