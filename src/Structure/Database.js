const mysql = require('mysql');

class Database {
    constructor(options) {
        this.db = mysql.createConnection(options);
    }

    /**
     * Connect to a MySQL database
     * @return {Promise<any>}
     */
    connect() {
        return new Promise((resolve, reject) => {
            this.db.connect((error) => {
                if (error) return reject(error);
                resolve(this.db);
            })
        })
    }

    /**
     * Run a database query.
     * @param query
     * @param data
     * @return {Promise<any>}
     */
    run(query, data = []) {
        return new Promise((resolve, reject) => {
            this.db.query(query, data, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        })
    }
}

module.exports = Database;
