var sql = require('mysql');

var pool = sql.createPool({
    connectionLimit: 50,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dropp'
});

function formatter(query, data_) {
    // raw = Object.values(data_);
    refined_query = sql.format(query, [data_]);
    console.log(refined_query);
    return refined_query;
}

function execute(que, payload) {
    pool.getConnection((err, conn) => {
        if (err) {
            console.error(err);
            conn.release;
        } else {
            conn.query(formatter(que, payload), (err) => {
                conn.release;
                if (!err) {
                    return {success : true};
                } else {
                    console.error(err.code);
                    return {success: false, message : err.message}
                }
            });
        }
    });
}


module.exports = {
    'pool' : pool,
    'sql' : sql,
    'format': formatter,
    'execute': execute
}