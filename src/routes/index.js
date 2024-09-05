const UserRouter = require('../routes/UserRouter')
const JobPostRouter = require('./JobPostRouter')
const SaveJobRouter = require('./SaveJobRouter')
const ProfileViewsRouter = require('./ProfileViewsRouter')
const ApplyRouter = require('./ApplyRouter')
const RecruiterRouter = require('./RecruiterRouter')
const VerifyRouter = require('./VerifyRouter')

const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/jobpost', JobPostRouter)
    app.use('/api/savejob', SaveJobRouter)
    app.use('/api/profile-views', ProfileViewsRouter)
    app.use('/api/apply', ApplyRouter)
    app.use('/api/recruiter', RecruiterRouter)
    app.use('/auth', VerifyRouter)
}

module.exports = routes
