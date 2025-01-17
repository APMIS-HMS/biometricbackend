const verifyPatient = require('./verify-patient/verify-patient.service.js');
const enrolPatient = require('./enrol-patient/enrol-patient.service.js');
const biometricsVerification = require('./biometrics-verification/biometrics-verification.service.js');
const nacaApi = require('./naca-api/naca-api.service.js');
const interceptVerificaton = require('./intercept-verificaton/intercept-verificaton.service.js');
const saveAllFingers = require('./save-all-fingers/save-all-fingers.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(verifyPatient);
  app.configure(enrolPatient);
  app.configure(biometricsVerification);
  app.configure(nacaApi);
  app.configure(interceptVerificaton);
  app.configure(saveAllFingers);
};
