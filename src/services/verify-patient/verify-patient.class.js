/* eslint-disable no-unused-vars */
const request = require('request-promise');
const jsend = require('jsend');
const sms = require('../../custom/sms-sender');
//const convertReset = require('../../custom/convert');
const console = require('console');



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
      primaryContactPhoneNo: data.from
    };

    const nacaApiService = this.app.service('naca-api');
    var mobileSessionId = data.rId;
    const option = {
      uri: process.env.NACA_VERIFICATION_URL,
      method: 'POST',
      form: { data64: data.data64 }
    };

    try {
      const makeRequest = await request(option);
      console.log("----------make request--------", makeRequest);
      if (makeRequest === null) {// is null if doesn't exist
        msg.message = {
          isUnique: true,
          message: 'Patient does not exist',
          rId: mobileSessionId
        };
        sms.sendPatientDetail(msg);
        return jsend.error(msg);
      }
      else {
        const id = JSON.parse(makeRequest.toString());
        const getPerson = await nacaApiService.find({query:{ personId: id.ID } });
        const detail = getPerson.data[0];
        if (detail._id !== undefined) {
          msg.message = {
            isUnique: false,
            message: this.convertReset(detail),
            rId: mobileSessionId
          };
          sms.sendPatientDetail(msg);
          return jsend.success(msg);
        }else{
          msg.message = {
            isUnique: true,
            message: 'Patient does not exist on Naca collection!',
            rId: mobileSessionId
          };
          sms.sendPatientDetail(msg);
          return jsend.error(msg);
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

  convertReset(data) {
    var res = {};
    res.pid = data.personId;
    res.fp = data.position;
    res.b = data.template;
    res.f = data.firstName;
    res.l = data.lastName;
    res.o = data.occupation;
    res.a = data.address;
    res.d = data.dob;
    res.g = data.gender;
    res.r = data.religion;
    res.m = data.marital;
    res.s = data.state;
    res.z = data.source;
    res.q = data.route;
    
    return res;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
