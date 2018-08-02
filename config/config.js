module.exports = {
    dev: {
        port : process.env.port || 5555,
        local_db  : process.env.DB_LINK || "mongodb://localhost:27017/blogdata",
        mlab: 'mongodb://blogdata:password@ds239387.mlab.com:39387/blogdata29'


    }

}