jQuery

const subscriptionKey = document.getElementById('InputKey');
const submitbtn = document.getElementById('submitForm');
let imageUrl = document.getElementById("inputUrl");
let responselist = document.querySelector(".list-group")


submitbtn.addEventListener('click', function (params) {
  console.log('click');

  const uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';

  var params = {
    'returnFaceId': 'true',
    'returnFaceLandmarks': 'false',
    'returnFaceAttributes': 'age,gender,emotion'
  };

  $.ajax({
    url: uriBase + '?' + $.param(params),

    beforeSend: function (xhrObj) {
      xhrObj.setRequestHeader("Content-Type", "application/json");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    },

    type: "POST",
    data: '{"url": ' + '"' + imageUrl + '"}',
  })
    .done(function (data) {
      console.log(data);

      let jsonResponse = JSON.parse(data);
      let group = [];
      let moodindex = 0;

      jsonResponse.forEach(function (p) {
        let emotions = [p.faceAttributes.emotion.anger, p.faceAttributes.emotion.contempt, p.faceAttributes.emotion.disgust, p.faceAttributes.emotion.fear, p.faceAttributes.emotion.happiness, p.faceAttributes.emotion.neutral, p.faceAttributes.emotion.sadness, p.faceAttributes.emotion.surprise];
        let moodArr = ['anger', 'contempt', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprised'];
        let personAge = parseInt(p.faceAttributes.age);
        let agegroup = '';

        switch (true) {
          case (personAge <= 3):
            agegroup = 'toddler';
            break;
          case (personAge <= 12):
            agegroup = 'child';
            break;
          case (personAge <= 19):
            agegroup = 'teenager';
            break;
          case (personAge <= 35):
            agegroup = 'young adult';
            break;
          case (personAge < 55):
            agegroup = 'middle-aged adult';
            break;
          default:
            agegroup = 'older than 55 years of age';
            break;
        };

        moodindex = emotions.indexOf(Math.max(...emotions));
        responselist.append(`<li class="list-group-item">a ${p.faceAttributes.gender} ${agegroup} feeling ${moodArr[moodindex]}</li>`)
      });
      console.log('This image includes:');
      console.log(group);
    })

    .fail(function () {
      console.log('fail');
    })
});


