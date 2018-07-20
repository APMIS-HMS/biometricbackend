/* eslint-disable no-unused-vars */
const request = require('request-promise');
const jsend = require('jsend');
//const sms = require('../../custom/sms-sender');
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

    var mobileSessionId;
    const option = {
      uri: process.env.NACA_ENROLMENT_URL,
      method: 'POST',
      form: {
        data64: data.data64.base64,
        FingerPosition: data.data64.base64.FingerPosition,
        ID: data.data64.base64.personId
      }
    };
    try {
      console.log('============Got into enrol service==============\n');
      const makeRequest = await request(option);
      console.log('============Response from Sidmach==============\n',makeRequest);
      if (makeRequest === undefined) {
        return jsend.error('No data sent');
      } else {
        if (makeRequest !== 0) {
          msg.primaryContactPhoneNo = data.from;
          msg.message = {
            isUnique: true,
            message: 'Could not save at Sidmach',
            rId: mobileSessionId
          };

          //sms.sendPatientDetail(msg);
          return jsend.error(msg);
        } else {
          let callback ={};
          callback.makeRequest = makeRequest;
          data.response = callback;
          return jsend.success(data);
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
