function convert(body) {
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

function convertReset(data) {
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

module.exports = {
  convert(body){
    convert(body);
  },
  convertReset(data){
    convertReset(data);
  }
};