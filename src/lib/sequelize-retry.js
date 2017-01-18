const sequelize = require('sequelize');

const msecRetryDefault = 25000;

const keepRetry = (func, msecRetry = msecRetryDefault) => (...args) => {

    const isConnectionError = (err) => {
        return err instanceof sequelize.DatabaseError
            || err instanceof sequelize.ConnectionError
            || err instanceof sequelize.ConnectionRefusedError
            || err instanceof sequelize.HostNotFoundError
            || err instanceof sequelize.ConnectionTimedOutError;
    };

    let failTimestamp = new Date().getTime();

    return new Promise((resolve, reject) => {

        func(...args)
            .then(resolve)
            .catch((err) => {
                if (isConnectionError(err)) {

                    const currentTimestamp = new Date().getTime();

                    const diffSec = (currentTimestamp - failTimestamp);

                    if (diffSec < msecRetry) {

                        keepRetry(func, (msecRetry - diffSec))(...args)
                            .then(resolve)
                            .catch(reject);

                    } else {
                        return reject(err);
                    }

                }else{
                    return reject(err);
                }
            })

    })

};

const forSequelize = (methodName) => function(...args) {
    return keepRetry(
        this.constructor.prototype[methodName].bind(this)
    )(...args);
};

module.exports = {
    keepRetry,
    forSequelize
};