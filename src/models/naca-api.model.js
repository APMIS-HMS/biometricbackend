// nacaApi-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const nacaApi = new Schema({
    source: { type: String, required: false },
    route: { type: String, required: true },
    personId: { type: String, required: true },
    finger: [
      {
        FingerPosition: { type: Number, required: true },
        data64: { type: String, required: true }
      }
    ],
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    occupation: { type: String, required: true },
    address: { type: String, required: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
    religion: { type: String, required: true },
    marital: { type: String, required: true },
    state: { type: String, required: true },
    requestId: { type: String, required: false }
  }, {
    timestamps: true
  });

  return mongooseClient.model('nacaApi', nacaApi);
};