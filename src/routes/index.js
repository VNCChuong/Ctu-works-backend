const UserRouter = require('../routes/UserRouter')
const JobPostRouter = require('./JobPostRouter')
const SaveJobRouter = require('./SaveJobRouter')
const ProfileViewsRouter = require('./ProfileViewsRouter')
const ApplyRouter = require('./ApplyRouter')
const RecruiterRouter = require('./RecruiterRouter')
const VerifyRouter = require('./VerifyRouter')
const NewsRouter = require('./NewsRouter')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require ('swagger-jsdoc')

const options = swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ctu-works-backend API',
            version: '1.0.0'
        }
    },
    apis: ['./src/swagger/*.yaml']
}

const openapiSpecification = swaggerJsdoc(options)
const routes = (app) => {

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))
    app.use('/auth', VerifyRouter)
    app.use('/api/user', UserRouter)
    app.use('/api/jobpost', JobPostRouter)
    app.use('/api/savejob', SaveJobRouter)
    app.use('/api/profile-views', ProfileViewsRouter)
    app.use('/api/apply', ApplyRouter)
    app.use('/api/recruiter', RecruiterRouter)
    app.use('/auth', VerifyRouter)
    app.use('/api/news', NewsRouter)
}

module.exports = routes
