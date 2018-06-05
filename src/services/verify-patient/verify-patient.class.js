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
      primaryContactPhoneNo: String
    };

    const nacaApiService = this.app.service('naca-api');

    var mobileSessionId;

    const option = {
      uri: process.env.NACA_VERIFICATION_URL,
      method: 'POST',
      form: { data64: data.data64 }
    };



    try {
      const makeRequest = await request(option);
      if (makeRequest === undefined) {
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
        const getPatient = await nacaApiService.find({query:{ patientId: id.ID } });
        const detail = getPatient.data[0];
        if (getPatient.v !== undefined) {
          msg.message = {
            isUnique: false,
            message: this.convertReset(detail),
            rId: mobileSessionId
          };

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

  convert(body) {
    var res ={
      data64: body.b,
      patientId:Math.floor(Math.random() * 90000) + 10000,
      fingerPosition:body.fp,
      firstName:body.f,
      lastName:body.l,
      occupation:body.o,
      address:body.a,
      dob:body.d,
      gender:body.g,
      religion:body.r,
      marital:body.m,
      state:body.s
    };
    return res;
  }
  
  convertReset(data) {
    var res = {};
    res.pid = data.patientId;
    res.fp = data.fingerPosition;
    res.f = data.firstName;
    res.l = data.lastName;
    res.o = data.occupation;
    res.a = data.address;
    res.d = data.dob;
    res.g = data.gender;
    res.r = data.religion;
    res.m = data.marital;
    res.s = data.state;
  
    return res;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
