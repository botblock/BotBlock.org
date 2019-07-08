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
}

module.exports = Database;
