import app from './app.js';
import db from './db/db_connection.js'

db.then(() => {
    app.listen(23231, () => {
        console.log('Server running on port 23231');
    });
});