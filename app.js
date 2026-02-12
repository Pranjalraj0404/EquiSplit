var dotenv = require('dotenv')
var express = require('express')
var logger = require('./helper/logger')
var requestLogger = require('./helper/requestLogger')
var apiAuth = require('./helper/apiAuthentication')
var cors = require('cors')
var mongoose = require('mongoose')

const path = require('path');
const fs = require('fs');
dotenv.config()

var usersRouter = require('./routes/userRouter')
var gorupRouter = require('./routes/groupRouter')
var expenseRouter = require('./routes/expenseRouter')
var paymentRouter = require('./routes/paymentRouter')

var app = express()
app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use('/api/users', usersRouter)
app.use('/api/group', apiAuth.validateToken,gorupRouter)
app.use('/api/expense', apiAuth.validateToken,expenseRouter)
app.use('/api/payment', apiAuth.validateToken, paymentRouter)

app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

app.get('/health/db', (req, res) => {
    const state = mongoose.connection.readyState
    res.json({ connected: state === 1, state })
})

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    const buildPath = path.join(__dirname, 'client/build');
    
    // Serve static files from client/build
    app.use(express.static(buildPath));
    
    // Handle all other routes by serving index.html (SPA fallback)
    app.get('*', (req, res) => {
        const indexPath = path.join(buildPath, 'index.html');
        
        // Check if build directory exists
        if (!fs.existsSync(buildPath)) {
            logger.error(`[Build Not Found] Build directory missing at ${buildPath}`);
            return res.status(500).json({ 
                status: 'fail', 
                message: 'Application build not found. Please redeploy.',
                path: buildPath
            });
        }
        
        if (!fs.existsSync(indexPath)) {
            logger.error(`[Index Not Found] index.html missing at ${indexPath}`);
            return res.status(500).json({ 
                status: 'fail', 
                message: 'Application files corrupted. Please redeploy.',
                path: indexPath
            });
        }
        
        res.sendFile(indexPath, (err) => {
            if (err) {
                logger.error(`[Static File Error] ${err.message}`);
                res.status(500).json({ 
                    status: 'fail', 
                    message: 'Unable to load application',
                    error: err.message 
                });
            }
        });
    });
}

//To detect and log invalid api hits 
app.all('*', (req, res) => {
    logger.error(`[Invalid Route] ${req.originalUrl}`)
    res.status(404).json({
        status: 'fail',
        message: 'Invalid path'
      })
})

const port = process.env.PORT || 3001
app.listen(port, (err) => {
    console.log(`Server started in PORT | ${port}`)
    logger.info(`Server started in PORT | ${port}`)
})
