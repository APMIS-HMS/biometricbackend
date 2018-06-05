/* eslint-disable no-unused-vars */
const request = require('request-promise');
const jsend = require('jsend');
const sms = require('../../custom/sms-sender');
//const convertReset = require('../../custom/convert');
//const console = require('console');

class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    return [];
  }

  async get(id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create(data, params) {

    var msg = {
      message: {},
      primaryContactPhoneNo: String
    };

    const nacaApiService = this.app.service('naca-api');

    var mobileSessionId;

    const option = {
      uri: process.env.NACA_ENROLMENT_URL,
      method: 'POST',
      form: {
        data64: data.data64,
        FingerPosition: data.fingerPosition,
        ID: data.patientId
      }
    };
    try {
      const makeRequest = await request(option);
      if (makeRequest === undefined || makeRequest === 0) {
        return jsend.error('No data sent');
      } else {
        if (data === undefined) {
          msg.message = {
            isUnique: true,
            message: 'Could not save at Sidmach',
            rId: mobileSessionId
          };

          sms.sendPatientDetail(msg);
          return jsend.success(msg);
        } else {
          const enrollFinger = await nacaApiService.create(data);
          if (enrollFinger.patientId !== undefined) {
            msg.message = {
              isUnique: true,
              message: enrollFinger.patientId,
              rId: mobileSessionId
            };
          }
          sms.sendPatientDetail(msg);
          return jsend.success(msg);
        }

      }
    } catch (error) {
      return jsend.error(error);
    }
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }

  setup(app) {
    this.app = app;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
