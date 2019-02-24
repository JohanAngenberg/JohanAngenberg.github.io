'use strict';

const request = require('request');

//Insert apikey below
const subscriptionKey = document.getElementById('#InputKey');
const submitbtn = document.getElementById('#submitForm')

const uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';

//Change the image url
const imageUrl = document.getElementById('#InputUrl');

submitbtn.addEventListener('click', function name(params) {
  console.log('click');

  // available parameters age, gender, hair, makeup, headpose, occlusion, emotion
  const params = {
    'returnFaceId': 'true',
    'returnFaceLandmarks': 'false',
    'returnFaceAttributes': 'age,gender,emotion'
  };

  const options = {
    uri: uriBase,
    qs: params,
    body: '{"url": ' + '"' + imageUrl + '"}',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': subscriptionKey
    }
  };

  request.post(options, (error, response, body) => {
    if (error) {
      console.log('Error: ', error);
      return;
    };

    let jsonResponse = JSON.parse(body);
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

      group.push(`a ${p.faceAttributes.gender} ${agegroup} feeling ${moodArr[moodindex]}`);
    });

    console.log('This image includes:');
    console.log(group);

  });
});