/* eslint-disable no-unused-vars */
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

    const enrollmentService = this.app.service('enrol-patient');
    const verifyPatientService = this.app.service('verify-patient');

    console.log('---------------------------------------', data.text);

    var msg = {
      message: {},
      primaryContactPhoneNo: String
    };
    var mobileSessionId;
    const objectify = JSON.parse(data.text.toString());
    console.log(objectify);
    msg.primaryContactPhoneNo = data.from;
    mobileSessionId = objectify.rId;

    let convertShortKeys = this.convert(objectify);

    if (objectify.v === 1) {
      try {
        const verify = await verifyPatientService.create(convertShortKeys);
        console.log('**********************************************',verify);
        return jsend.success(verify);
      } catch (error) {
        return jsend.error(error);
      }

    } else if (objectify.v === 0) {
      try {
        console.log('*******************************************************',convertShortKeys);
        const enroll = await enrollmentService.create(convertShortKeys);
        return jsend.success(enroll);
      } catch (error) {
        return jsend.error(error);
      }

    } else {
      return jsend.success('There is no v type');
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
