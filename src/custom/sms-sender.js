'use strict';
const request = require('request');
//const logger = require('winston');

function sender(mesage, data, isScheduler) {

  var url = 'https://api.africastalking.com/restless/send?username=apmis&Apikey=547c6a5e92e8a6c4b1f9878a8dc21bedcbd3a071b101efdc4928c912a6effc1a&to=' + data.primaryContactPhoneNo + '&message=' + mesage + '&from=APMIS';
  //var url = 'http://portal.bulksmsnigeria.net/api/?username=apmis&password=apmis&message=' + mesage + '&sender=APMIS&mobiles=@@' + data.primaryContactPhoneNo + '@@';
  if (isScheduler == true) {
    url = 'http://portal.bulksmsnigeria.net/api/?username=apmis&password=apmis&message=' + mesage + '&action=scheduled' + '&sender=APMIS&mobiles=@@' + data.primaryContactPhoneNo + '@@';
  }
  request.get(url, null, (error, response, body) => {
    if (error) {
      // logger.error(error);
    }
    if (response && body) {
      // logger.error(error);
    }
  });
}

function sendPatientDetail(data) {
  const message = JSON.stringify(data.message);
  sender(message, data, false);
}

function sendApmisId(data) {
  //logger.info(62);
  //logger.info(data);
  const message = 'This is to notify you that ' + data.apmisId + ' is your personal APMIS identification number. Visit www.apmis.ng/details for details';
  sender(message, data, false);
}

function sendAutoGeneratorPassword(data, password) {
  const message = 'APMIS Auto-generated password: ' + password + ' kindly change your password';
  sender(message, data, false);
}

function sendScheduleAppointment(date, data) {
  var message = '';
  if (data.doctorId != undefined) {
    message = 'This is to notify you of your appointment with ' + data.doctorId.employeeDetails.firstName + ' ' + data.doctorId.employeeDetails.lastName + ' scheduled for: ' + date + ' at ' + data.facilityId.name + ' ' + data.clinicId.clinicName + ' clinic';
  } else {
    message = 'This is to notify you of your appointment scheduled for: ' + date + ' at ' + data.facilityId.name + ' ' + data.clinicId.clinicName + ' clinic';
  }
  data.primaryContactPhoneNo = data.patientId.personDetails.primaryContactPhoneNo;
  sender(message, data, true);
}



module.exports = {
  sendPatientDetail(data) {
    sendPatientDetail(data);
    // console.log('Time out: ' + new Date());
  },
  sendApmisId(data) {
    sendApmisId(data);
  },
  sendAutoGeneratorPassword(data, password) {
    sendAutoGeneratorPassword(data, password);
  },
  sendScheduleAppointment(date, data) {
    sendScheduleAppointment(date, data);
  }
};
