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

// Explicitly create logger with ONLY console transport (Vercel serverless compatible)
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
    ],
    // Explicitly disable default behaviors that might create files
    silent: process.env.DISABLE_LOGGING === 'true',
    exitOnError: false
})

module.exports = logger
