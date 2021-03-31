const chalk = require('chalk');

module.exports.initialize = (mongoose) => {
    mongoose.connect(process.env.MONGOOSE_LOCAL_URI, { 
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, chalk.white.bgRed.bold(` DB Connection Error!!! `)));
    db.once('open', function() {
        console.log(chalk.black.bgGreen.bold(` DB Connected!!! `))
    });
}