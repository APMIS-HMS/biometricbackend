// saveAllFingers-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const saveAllFingers = new Schema({
    requestId: { type: String, unique:true, required: false },
    finger: [
      {
        FingerPosition: { type: Number, required: true },
        data64: { type: String, required: true }
      }
    ],
    source: { type: String, required: false },
    route: { type: String, required: false },
    personId: { type: String, required: false },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    occupation: { type: String, required: false },
    address: { type: String, required: false },
    dob: { type: String, required: false },
    gender: { type: String, required: false },
    religion: { type: String, required: false },
    marital: { type: String, required: false },
    state: { type: String, required: false }
  }, {
    timestamps: true
  });

  return mongooseClient.model('saveAllFingers', saveAllFingers);
};
