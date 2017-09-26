const TABLE_NAME = 'tweets'

const DEFAULT_COLUMNS = ['created_at DATETIME DEFAULT CURRENT_TIMESTAMP', 'updated_at DATETIME DEFAULT CURRENT_TIMESTAMP', 'deleted_at DATETIME']
const COLUMNS_CREATE = ['id INTEGER PRIMARY KEY AUTOINCREMENT', 'user TEXT', 'tweet TEXT', 'color TEXT']
const COLUMNS = ['user', 'tweet', 'color']

module.exports = {
  tableName: TABLE_NAME,
  columns: COLUMNS,
  createTable: `CREATE TABLE ${TABLE_NAME} (${(COLUMNS_CREATE.concat(DEFAULT_COLUMNS)).join(', ')})`
}
