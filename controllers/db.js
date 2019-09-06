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



module.exports = {
    'pool' : pool,
    'sql' : sql,
    'format': formatter
}