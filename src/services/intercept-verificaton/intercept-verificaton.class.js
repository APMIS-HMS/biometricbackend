/* eslint-disable no-unused-vars */
const jsend = require('jsend');
const sms = require('../../custom/sms-sender');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find() {
    return [];
  }

  async get(id) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create(data) {

    const saveAllFingerService = this.app.service('save-all-fingers');
    //const biometricVerificationService = this.app.service('intercept-verificaton');
    const enrollmentService = this.app.service('enrol-patient');
    const nacaApiService = this.app.service('naca-api');



    let getSavedFingers = {};
    let fingerTemp = [];
    let savedFinger;
    let fingerCount;

    let base64 = {};
    let finger = [];
    let firstName, lastName;
    //let bioVerification;
    let enrol;

    try {

      var msg = {
        message: {},
        primaryContactPhoneNo: String
      };
      const objectify = JSON.parse(data.text);

      let convertShortKeys = this.convert(objectify);

      convertShortKeys.requestId = objectify.rId;

      convertShortKeys.from = data.from;

      let savedData;

      const fingerTempKeys = Object.keys(convertShortKeys.data64);

      fingerTemp = Object.keys(convertShortKeys.data64).map(i => convertShortKeys.data64[i]);
      getSavedFingers = await saveAllFingerService.find({ query: { requestId: convertShortKeys.requestId } });

      if (getSavedFingers.total !== 0) {
        savedData = getSavedFingers.data[0];

        firstName = savedData.firstName;
        lastName = savedData.lastName;

        savedFinger = savedData.finger;
        if (savedFinger !== undefined) {
          fingerCount = savedFinger.length;
          if (fingerCount === 5) {
            return jsend.success('Error 720');
          }
          else {

            // Get fingers and finger positions saved on the db
            finger = savedData.finger;
            // Get template sent from the from device

            fingerTemp.forEach((element, i) => {

              var key = fingerTempKeys[i];

              base64 = {
                FingerPosition: key,
                data64: element
              };
              finger.push(base64);
            });



            const id = savedData._id;
            let addFinger;

            if (firstName !== undefined || lastName !== undefined) {
              // =============Merged Templates======
              savedData.finger = finger;
              addFinger = await saveAllFingerService.patch(id, savedData, {});
            }
            else {
              // =============Merged Templates======
              convertShortKeys.finger = finger;
              addFinger = await saveAllFingerService.patch(id, convertShortKeys, {});
            }

            if (addFinger._id !== '') {
              getSavedFingers = await saveAllFingerService.find({ query: { requestId: convertShortKeys.requestId } });
              if (getSavedFingers.total !== 0) {
                savedFinger = getSavedFingers.data[0].finger;
                fingerCount = savedFinger.length;
                if (fingerCount === 5) {
                  try {
                    for (var k = 0; k < fingerCount; k++) {
                      base64 = savedFinger[k];
                      base64.personId = convertShortKeys.personId;
                      convertShortKeys.data64 = base64;
                      //console.log('*****************Data64***********************\n', convertShortKeys);
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

                    // convertShortKeys.finger = finger;
                    //console.log('====================hmmmmmmmmmmmmmmm===============\n',getSavedFingers);

                    const enrolFinger = await nacaApiService.create(getSavedFingers.data[0]);
                    const mobileSessionId = convertShortKeys.requestId;

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
                  return jsend.success('Succesfully added fingers and their position!');
                }
              }
            }
            else {
              return jsend.error('Failed to add fingers');
            }
          }
        } else {
          return jsend.error('No template is saved against this user');
        }
      } else {
        // Get template sent from the from device
        fingerTemp.forEach((element, i) => {
          var key = fingerTempKeys[i];
          base64 = {
            FingerPosition: key,
            data64: element
          };
          finger.push(base64);
        });
        const personId = Math.floor(Math.random() * 90000) + 10000;          
        convertShortKeys.finger = finger;
        convertShortKeys.personId = personId;
        const newFinger = await saveAllFingerService.create(convertShortKeys);
        if (newFinger._id !== '') {
          return jsend.success('Initial record created!');
        } else {
          return jsend.error('Could not save finger');
        }

      }

    } catch (error) {
      return jsend.error(error);
    }

  }

  async update(data) {
    return data;
  }

  async patch(data) {
    return data;
  }

  async remove(id) {
    return { id };
  }

  setup(app) {
    this.app = app;
  }

  convert(body) {
    var res = {
      data64: body.fp,
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
