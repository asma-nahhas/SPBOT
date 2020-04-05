'use strict';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
// Imports dependencies and set up http server
const 
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  config = require("./services/config"),
  querystring = require('querystring'),
  app = express().use(body_parser.json()); // creates express http server
console.log('Asoum2');
// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Accepts POST requests at /webhook endpoint, so we will get the events form the code that exists in webhook 
app.post('/webhook', (req, res) => {  

  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {
  
    body.entry.forEach(function(entry) {
        console.log("the entry is below");
        console.log(entry );
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log("the event is below");
      console.log(webhook_event);
      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;

      console.log("Sender ID"+sender_psid);
      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {

            console.log("Hi from webhook_event.message :) ");

            handleMessage(sender_psid, webhook_event.message);

      } else if (webhook_event.postback) {

            console.log("It is postpack event"+webhook_event.postback);
            
            handlePostback(sender_psid, webhook_event.postback);
      }
      
    });
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

//When the user open the bot for the first time, Get started will appear
app.get('/setup',function(req,res){
    getStarted();
});
// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {
   
  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = config.verifyToken;
  console.log("Verify token from config file is: " + process.env.VERIFY_TOKEN);
  
  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  console.log("The received token is: " + token);
  console.log("The received mode is: " + mode);
  console.log("The received challenge is: " + challenge);
  // Check if a token and mode were sent
  if (mode && token) {
  
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

function handleMessage(sender_psid, received_message) {
  console.log("Hi from handle message, the user_id is: " + sender_psid);
  // Checks if the message contains text
  if (received_message.text) {   
    callBasicServices(sender_psid);
  }
}

//Call main menu
function callBasicServices(sender_psid){
  console.log("Hi from callBasicServices ^_^, the btns are as below: ");
  var btns = [
      {
          "type":"postback",
          "title":"ماهو وزنك",
          "payload":"WIDTH_SERVICE"
      },
      {
          "type":"postback",
          "title":"ماهو طولك",
          "payload":"HEIGHT_SERVICE"
      }
      ,
      {
          "type":"postback",
          "title":"أسوم خدمات",
          "payload":"ASOUM_SERVICES"
      }
    ];
    
    console.log(btns);
  callSendAPIWithBtns(sender_psid,btns);
}
function handlePostback(sender_psid, received_postback) {
  console.log('ok post')
   let response;
  // Get the payload for the postback
  let payload = received_postback.payload;
    console.log("payload is" +payload);
  // Set the response based on the postback payload
  if (payload === 'WIDTH_SERVICE') {
    response = [
        {
            "type":"postback",
            "title":"SMS",
            "payload":"SMS_PAYLOAD"
        },
        {
            "type":"postback",
            "title":"Voice",
            "payload":"VOICE_PAYLOAD"
        },
        {
            "type":"postback",
            "title":"Data",
            "payload":"DATA_PAYLOAD"
        }
      ];
  }else if(payload === 'ASOUM_SERVICES'){


        request({
      url: "https://graph.facebook.com/v2.6/" + sender_psid,
      qs: {
        access_token: PAGE_ACCESS_TOKEN,
        fields: "first_name"
      },
      method: "GET"
    }, function(error, response, body) {
      var greeting = "";
      if (error) {
        console.log("Error getting user's name: " +  error);
      } else {
        var bodyObj = JSON.parse(body);
        console.log("Body Object: " +  bodyObj);
        var name = bodyObj.first_name;
        greeting = "Hi " + name + ". ";
      }
      var message = greeting + "My name is Asma Bot. I can tell you usefull advises about your health?";
      callSendAPI(sender_psid, {text: message});
    });
  


    response={ "text":"there is no soso responses" };
    callSendAPI(sender_psid, response);

  }else if (payload === 'DATA_PAYLOAD') {
    response = [
        {
            "type":"postback",
            "title":"10G Bundle",
            "payload":"10G_BUNDLE_PAYLOAD"
        },
        {
            "type":"postback",
            "title":"1G Bundle",
            "payload":"1G_BUNDLE_PAYLOAD"
        },
        {
            "type":"postback",
            "title":"2G Bundle",
            "payload":"2G_BUNDLE_PAYLOAD"
        }
      ];
  }
  else if (payload === '10G_BUNDLE_PAYLOAD') {
        response = [
            {
                "type":"postback",
                "title":"Activate",
                "payload":"ACTIVATE_10G_BUNDLE_PAYLOAD"
            },
            {
                "type":"postback",
                "title":"Deactivate",
                "payload":"DEACTIVATE_10G_BUNDLE_PAYLOAD"
            },
            {
                "type":"postback",
                "title":"Check Balance",
                "payload":"CHECK_BALANCE_10G_BUNDLE_PAYLOAD"
            }
        ];
  }
  else if (payload === '1G_BUNDLE_PAYLOAD') {
    response = [
        {
            "type":"postback",
            "title":"Activate",
            "payload":"ACTIVATE_1G_BUNDLE_PAYLOAD"
        },
        {
            "type":"postback",
            "title":"Deactivate",
            "payload":"DEACTIVATE_1G_BUNDLE_PAYLOAD"
        },
        {
            "type":"postback",
            "title":"Check Balance",
            "payload":"CHECK_BALANCE_1G_BUNDLE_PAYLOAD"
        }
    ];
}
else if (payload === '2G_BUNDLE_PAYLOAD') {
    response = [
        {
            "type":"postback",
            "title":"Activate",
            "payload":"ACTIVATE_2G_BUNDLE_PAYLOAD"
        },
        {
            "type":"postback",
            "title":"Deactivate",
            "payload":"DEACTIVATE_2G_BUNDLE_PAYLOAD"
        },
        {
            "type":"postback",
            "title":"Check Balance",
            "payload":"CHECK_BALANCE_2G_BUNDLE_PAYLOAD"
        }
    ];
}else if(payload ==='CHECK_BALANCE_2G_BUNDLE_PAYLOAD'){
    let uri ="http://services.mtn.com.sy/MarketingAPI/resources/anghami/request-act-code";
    //"http://services.mtn.com.sy/MarketingAPI/resources/service/getMetaData";//"http://10.11.201.19:8080/ESMiddlewareTest/webresources/IN/getGsmBundles";// "http://services.mtnsyr.com:8080/MTNServicesAPI/resources/Billing/getMultiCustomerType";
    sendPostRequest();
   // callMyMTNAPI(uri,sender_psid);

}else if(payload ==='get_started_payload'){
    response = [
        {
            "type":"postback",
            "title":"خدمة زبائن",
            "payload":"CUSTOMER_SERVICE_PAYLOAD"
        },
        {
            "type":"postback",
            "title":"خدمات MTN",
            "payload":"MTN_SERVICES_PAYLOAD"
        }
      ];
}
  // Send the message to acknowledge the postback
  if (payload === 'HEIGHT_SERVICE'){
    response = {"text": "You Are Too Short"};
    callSendAPI(sender_psid, response);
  }else{
  callSendAPIWithBtns(sender_psid, response);
  }
}

function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
  console.log(request_body);
  // Send the HTTP request to the Messenger Platform
  callFBAPI(request_body);
 
}

function callSendAPIWithBtns(sender_psid, btns) {
  console.log("Hi from callSendAPIWithBtns");
  console.log("sender id is: " + sender_psid);
    // Construct the message body
    let request_body = {
        "recipient":{
          "id":sender_psid
        },
         "message":{
          "attachment":{
            "type":"template",
            "payload":{
              "template_type":"button",
              "text":"What do you want to do next?",
              "buttons":btns
            }
          }
        }
      }
      console.log("the request that should be send as below: ");
      console.log(request_body);
      callFBAPI(request_body);
  }

  // Send the HTTP request to the Messenger Platform
  function callFBAPI(request_body){
    request({
      "uri": "https://graph.facebook.com/v2.6/me/messages",
      "qs": { "access_token": config.pageAccessToken },
      "method": "POST",
      "json": request_body
    }, (err, res, body) => {
      if (!err) {
        console.log('message sent!')
      } else {
        console.error("Unable to send message:" + err);
      }
    });
  }

function sendPostRequest(){
    var form = {
        username: 'usr',
        password: 'pwd',
        gsm: '963944444444'
    };
    
    var formData = querystring.stringify(form);
    var contentLength = formData.length;
    
    request({
        headers: {
          'Content-Length': contentLength,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        uri:"http://services.mtn.com.sy/MarketingAPI/resources/anghami/request-act-code",
        body: formData,
        method: 'POST'
      }, function (err, res, body) {
        console.log(body);
        console.log(err);
        console.log('Send Post Request Function!');
      });
}

// Send the HTTP request to the Messenger Platform
function callMyMTNAPI(api_url,sender_psid){
    var form ={"username":"MTN123", "password":"MTN123", "gsmNumber":"963957851902"};
    console.log("The form is as below: ");
    console.log(form);
    request({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        uri: api_url,
        form:form,
      //  body: formData,
        method: 'POST'
       // ,encoding:false
        ,json: true
        }, function (err, res, body) {
            console.log(err);
        if (!err && res.statusCode == 200) {
           // console.log(err);
            console.log(body);
            console.log('message sent!');
           // var version = body['0']['VALUE'];
            //console.log(version);
         //   var response = "The version is " + version ;
         console.log(sender_psid);
         //   callSendAPI(sender_psid, version);
            } else {
            console.error("Unable to send message:" + err);
            }
        });
    }

function getStarted(){
    console.log("Hi from Get Started!!")
    var messageData = {
        "get_started":[
            {
                "payload":"get_started_payload"
            }
        ]
    };
      callFBAPI(messageData);
}


