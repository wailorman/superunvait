module.exports = {
    memberator: {
        interval: process.env.MEMBERATOR_INTERVAL || 10 * 60 * 1000,
    },
    candidator: {
        interval: process.env.CANDIDATOR_INTERVAL || 1 * 60 * 1000
    },
    scrapper: {
        interval: process.env.SCRAPPER_INTERVAL || 1 * 60 * 1000
    },
    common: {
        parallelHttpRequests: process.env.PARALLEL_HTTP_REQUESTS || 1
    }
    ok: {
        credentials: process.env.OK_CREDENTIALS || ""
    }
}
