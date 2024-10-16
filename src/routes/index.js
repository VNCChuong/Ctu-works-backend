const UserRouter = require("../routes/UserRouter");
const JobPostRouter = require("./JobPostRouter");
const SaveJobRouter = require("./SaveJobRouter");
const ProfileViewsRouter = require("./ProfileViewsRouter");
const ApplyRouter = require("./ApplyRouter");
const RecruiterRouter = require("./RecruiterRouter");
const VerifyRouter = require("./VerifyRouter");
const NewsRouter = require("./NewsRouter");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const FollowRounter = require("./FollowRounter");
const AiRouter = require("./AiRouter");
const SearchHistory = require("./SearchHistory");
const JobInfo = require("./JobInfoRouter");
const CandidateExpectations = require("./CandidateExpectationsRouter");
const JobCompanyInfo = require("./JobCompanyInfoRouter");
const LocationCompany = require("./LocationCompanyRounter");
const Notification = require("./NotificationRouter");
const uploadImage = require("./UploadImageRouter");
const options = (swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ctu-works-backend API",
      version: "1.0.0",
    },
  },
  apis: ["./src/swagger/*.yaml"],
});

const openapiSpecification = swaggerJsdoc(options);
const routes = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
  app.use("/auth", VerifyRouter);
  app.use("/api/user", UserRouter);
  app.use("/api/jobpost", JobPostRouter);
  app.use("/api/savejob", SaveJobRouter);
  app.use("/api/profile-views", ProfileViewsRouter);
  app.use("/api/apply", ApplyRouter);
  app.use("/api/recruiter", RecruiterRouter);
  app.use("/auth", VerifyRouter);
  app.use("/api/news", NewsRouter);
  app.use("/api/follow", FollowRounter);
  app.use("/api/ai", AiRouter);
  app.use("/api/search-history", SearchHistory);
  app.use("/api/job-info", JobInfo);
  app.use("/api/candidate-expectations", CandidateExpectations);
  app.use("/api/job-company-info", JobCompanyInfo);
  app.use("/api/location-company", LocationCompany);
  app.use("/api/notification", Notification);
  app.use("/api/upload", uploadImage);
};

module.exports = routes;
