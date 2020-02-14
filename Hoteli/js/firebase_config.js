// ---------------------------------------------------------------------------------------------------- POVEZIVANJE NA BAZU

var config = {
  apiKey: "AIzaSyC_8WTbZD7_alS3fOAz_ruIqHiJFmnTz34",
  authDomain: "hoteli-e070d.firebaseapp.com",
  databaseURL: "https://hoteli-e070d.firebaseio.com",
  projectId: "hoteli-e070d",
  storageBucket: "hoteli-e070d.appspot.com",
  messagingSenderId: "318178555934"
};
firebase.initializeApp(config);

var oDb = firebase.database();
var oDbHoteli = oDb.ref("hoteli");

var oDbUsers = oDb.ref("users");
var Users = [];

var oDbBoravak = oDb.ref("boravak");

$(document).ready(function() {
  $(this).scrollTop(0);

  oDbUsers.on("value", function(oOdgovorPosluzitelja) {
    Users = [];
    oOdgovorPosluzitelja.forEach(function(oUserSnapshot) {
      var sUserKey = oUserSnapshot.key;
      var oUser = oUserSnapshot.val();
      Users.push({
        userORadmin: oUser.userORadmin,
        username: oUser.username,
        email: oUser.email,
        password: oUser.password
      });
    });
    console.log(Users);
  });
});
