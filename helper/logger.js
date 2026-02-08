const {
    createLogger,
    transports,
    format
} = require('winston')

const customFormat = format.combine(
    format.timestamp(),
    format.printf((log) => {
        return `${log.timestamp} | ${log.level.toUpperCase().padEnd(7)} | ${log.message}`
    })
)

const logger = createLogger({
    level: 'info',
    format: customFormat,
    transports: [
        new transports.Console()  // ✅ Only console logging
    ]
})

module.exports = logger
