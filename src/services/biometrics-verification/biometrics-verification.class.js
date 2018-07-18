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

    //The biometric application entry point

    const enrollmentService = this.app.service('enrol-patient');
    const verifyPatientService = this.app.service('verify-patient');
    const nacaApiService = this.app.service('naca-api');
    const interceptVerService = this.app.service('intercept-verificaton');

    try {
      const getAllFingers = await interceptVerService.create(data);
      if (getAllFingers !== undefined) {
        const res = getAllFingers.data.fingerLength;
        if (res !== 5) {
          return jsend.success('expecting more fingers!');
        } else {
          console.log();
          var msg = {
            message: {},
            primaryContactPhoneNo: String
          };

          let fingerTemp = [];
          let base64 = {};
          var finger = [];
          var mobileSessionId;
          const objectify = JSON.parse(data.text);

          msg.primaryContactPhoneNo = data.from;
          mobileSessionId = objectify.rId;
          let convertShortKeys = this.convert(objectify);

          let verify;

          // Check for verication or enrolment

          if (objectify.v === 1) {

            try {
              convertShortKeys.from = data.from;
              convertShortKeys.rId = mobileSessionId;
              verify = await verifyPatientService.create(convertShortKeys);
              if (verify !== undefined) {

                return jsend.success(verify);
              }

              return jsend.error('Verification failed!');

            } catch (error) {
              return jsend.error(error);
            }

          } // Enrole Patient...
          else if (objectify.v === 0) {
            convertShortKeys.from = data.from;
            convertShortKeys.rId = mobileSessionId;

            fingerTemp = Object.keys(convertShortKeys.data64).map(i => convertShortKeys.data64[i]);
            let enrol;
            try {
              for (var k = 0; k < fingerTemp.length; k++) {
                base64.FingerPosition = k + 1;
                base64.data64 = fingerTemp[k];
                base64.personId = convertShortKeys.personId;
                convertShortKeys.data64 = base64;

                enrol = await enrollmentService.create(convertShortKeys);
                if (enrol !== undefined) {
                  msg.message[k] = enrol;
                }
              }
              // Get fingers and finger positions

              fingerTemp.forEach((element, i) => {
                base64 = {
                  FingerPosition: ++i,
                  data64: element
                };
                finger.push(base64);
              });

              convertShortKeys.finger = finger;

              const enrolFinger = await nacaApiService.create(convertShortKeys);

              if (enrolFinger.personId !== undefined) {
                msg.primaryContactPhoneNo = data.from;
                msg.message = {
                  isUnique: true,
                  message: enrolFinger.personId,
                  rId: mobileSessionId
                };
              }
              sms.sendPatientDetail(msg);
              return jsend.success(msg);

            } catch (error) {
              return jsend.error(error);
            }

          } else {
            return jsend.success('There is no v type');
          }
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
    var res = {
      data64: body.fp,
      personId: Math.floor(Math.random() * 90000) + 10000,
      firstName: body.f,
      lastName: body.l,
      occupation: body.o,
      address: body.a,
      dob: body.d,
      gender: body.g,
      religion: body.r,
      marital: body.m,
      state: body.s,
      source: body.z,
      route: body.v
    };
    return res;
  }

  convertReset(data) {
    var res = {};
    res.pid = data.personId;
    res.fp = data.data64;
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
    res.v = data.route;


    return res;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
