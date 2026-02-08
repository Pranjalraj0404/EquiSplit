const {
    createLogger,
    transports,
    format
} = require('winston')

const customFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf((log) => {
        return `${log.timestamp} | ${log.level.toUpperCase().padEnd(7)} | ${log.message}`
    })
)

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: customFormat,
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                customFormat
            )
        })
    ],
    exceptionHandlers: [
        new transports.Console()
    ],
    rejectionHandlers: [
        new transports.Console()
    ]
})

module.exports = logger