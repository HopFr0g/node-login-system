"use strict";

const Database = require("better-sqlite3");

const getColumnNames = (dbDir, tableName) => {
    const db = new Database(dbDir, {fileMustExist: true});
    const tableInfo = db.pragma(`table_info('${tableName}')`);
    
    let columnNames = [];
    for (let column of tableInfo)
        columnNames.push(column["name"]);
    
    return columnNames;
}

const findRow = (dbDir, tableName, idKey, idValue) => {
    return new Promise((resolve, reject) => {
        try {
            const db = new Database(dbDir, {fileMustExist: true});
            const stmt = db.prepare(`SELECT * FROM ${tableName} WHERE ${idKey}=?`);
            const result = stmt.get(idValue);
            return resolve(result);
        } catch (error) {
            return reject(error);
        }
    });
}

const editRow = (dbDir, tableName, idKey, idValue, editKey, editValue) => {
    return new Promise((resolve, reject) => {
        try {
            const db = new Database(dbDir, {fileMustExist: true});
            const stmt = db.prepare(`UPDATE ${tableName} SET ${editKey}=? WHERE ${idKey}='${idValue}'`);
            const result =  stmt.run(editValue);
            return resolve(result);
        } catch (error) {
            return reject(error);
        }
    });
}

const editAllRow = (dbDir, tableName, idKey, idValue, dataObj) => {
    return new Promise((resolve, reject) => {
        if (!dbDir || typeof tableName != "string")
            return reject("Missing data.");
        
        let columnNames = getColumnNames(dbDir, tableName);
        let values = [];
        let parameters = [];
        
        for (let column of columnNames) {
            if (dataObj[column] === undefined) // null is accepted
                return reject(`Missing value for column ${column}`);
            values.push(dataObj[column]);
            parameters.push(`${column} = ?`);
        }
        
        try {
            const db = new Database(dbDir, {fileMustExist: true});
            const stmt = db.prepare(`UPDATE ${tableName} SET ${parameters.join(", ")} WHERE ${idKey}='${idValue}'`);
            const result = stmt.run(...values);
            return resolve(result);
        } catch (error) {
            return reject(error);
        }
    });
}

const removeRow = (dbDir, tableName, idKey, idValue) => {
    return new Promise((resolve, reject) => {
        try {
            const db = new Database(dbDir, {fileMustExist: true});
            const stmt = db.prepare(`DELETE FROM ${tableName} WHERE ${idKey}=?`);
            const result = stmt.run(idValue);
            return resolve(result);
        } catch (error) {
            return reject(error);
        }
    });
}

const removeIfExists = async (dbDir, tableName, idKey, idValue) => {
    if (!findRow(dbDir, tableName, idKey, idValue))
        return;
    try {
        await removeRow(dbDir, tableName, idKey, idValue);
    } catch (error) {
        console.error(error);
    }
}

const addRow = (dbDir, tableName, dataJson) => {
    return new Promise((resolve, reject) => {
        if (!dbDir || !tableName || !dataJson)
            return reject("Missing data.");
        
        let values = [];
        let parameters = [];
        const columnNames = getColumnNames(dbDir, tableName);
        for (let name of columnNames) {
            if (dataJson[name] === undefined) // null is accepted.
                return reject(`Missing value for column ${name}`);
            values.push(dataJson[name]);
            parameters.push("?");
        }
        
        try {
            const db = new Database(dbDir, {fileMustExist: true});
            const stmt = db.prepare(`INSERT INTO ${tableName} (${columnNames.join(", ")}) VALUES (${parameters.join(", ")})`);
            const result = stmt.run(...values);
            return resolve(result);
        } catch (error) {
            return reject(error);
        }
    });
}

const createTable = (dbDir, tableName, ...columnSettings) => {
    // columnSettings format example = [
    //    {name: "id", type: "TEXT", primaryKey: true},
    //    {name: "age", type: "INTEGER"}
    // ]
    
    return new Promise((resolve, reject) => {
        if (!dbDir || typeof tableName != "string" || !Array.isArray(columnSettings))
            return reject("Missing data.");
        
        if (columnSettings.length == 0)
            return reject("Table must have at least one column.");
        
        let columns = [];
        let primaryKeys = []
        
        for (let setting of columnSettings) {
            if (typeof setting.name != "string" || (setting.type != "INTEGER" && setting.type != "TEXT" && setting.type != "BLOB" && setting.type != "REAL" && setting.type != "NUMERIC"))
                return reject("Column name must be string and column type must be INTEGER, TEXT, BLOB, REAL or NUMERIC.");
            
            columns.push(`"${setting.name}" ${setting.type}`);
            
            if (setting.primaryKey)
                primaryKeys.push(`"${setting.name}"`);
        } 
        
        let sqlString;
        if (primaryKeys.length == 0)
            sqlString = `CREATE TABLE "${tableName}" ( ${columns.join(", ")} )`;
        else
            sqlString = `CREATE TABLE "${tableName}" ( ${columns.join(", ")}, PRIMARY KEY(${primaryKeys.join(",")}) )`;
        
        try {
            const db = new Database(dbDir, {fileMustExist: true});
            const stmt = db.prepare(sqlString);
            const result = stmt.run();
            return resolve(result);
        } catch (error) {
            return reject(error);
        }
    });
}

const renameTable = (dbDir, oldName, newName) => {
    return new Promise((resolve, reject) => {
        if (!dbDir || typeof oldName != "string" || typeof newName != "string")
            return reject("Missing data.");
        
        try {
            const db = new Database(dbDir, {fileMustExist: true});
            const stmt = db.prepare(`ALTER TABLE ${oldName} RENAME TO ${newName}`);
            const result = stmt.run();
            return resolve(result);
        } catch (error) {
            return reject(error);
        }
    });
}

const removeTable = (dbDir, tableName) => {
    return new Promise((resolve, reject) => {
        if (!dbDir || typeof tableName != "string")
            return reject("Missing data.");
            
        try {
            const db = new Database(dbDir, {fileMustExist: true});
            const stmt = db.prepare(`DROP TABLE '${tableName}'`);
            const result = stmt.run();
            return resolve(result);
        } catch (error) {
            return reject(error);
        }
    });
}

const getRows = (dbDir, tableName) => {
    return new Promise((resolve, reject) => {
        try {
            const db = new Database(dbDir, {fileMustExist: true});
            const stmt = db.prepare(`SELECT * FROM '${tableName}'`);
            const result = stmt.all();
            return resolve(result);
        } catch (error) {
            return reject(error);
        }
    });
}

const getTableNames = dbDir => {
    return new Promise((resolve, reject) => {
        if (!dbDir)
            return reject("Missing data.");
        
        try {
            const db = new Database(dbDir, {fileMustExist: true});
            const stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table'`);
            const result = stmt.all();
            
            const tableNames = [];
            for (let table of result)
                tableNames.push(table.name);
                
            return resolve(tableNames);
        } catch (error) {
            return reject(error);
        }
    });
}

const countRows = (dbDir, tableName) => {
    return new Promise((resolve, reject) => {
        if (!dbDir || typeof tableName != "string")
            return reject("Missing data.");
        
        try {
            const db = new Database(dbDir, {fileMustExist: true});
            const stmt = db.prepare(`SELECT COUNT(1) FROM "${tableName}"`);
            const result = stmt.get();
            return resolve(result["COUNT(1)"]);
        } catch (error) {
            return reject(error);
        }
    });
}

const createDataBase = dbDir => {
    return new Promise((resolve, reject) => {
        try {
            const db = new Database(dbDir);
            return resolve();
        } catch (error) {
            return reject(error);
        }
    });
}

module.exports = {findRow, editRow, editAllRow, removeRow, removeIfExists, addRow, createTable, renameTable, removeTable, getRows, getTableNames, countRows, createDataBase};