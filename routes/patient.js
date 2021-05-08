var express = require("express");
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://127.0.0.1:27017";
const dbName = 'main_admin';
let db;
var patient_id;
MongoClient.connect(url, { useUnifiedTopology: true ,useNewUrlParser: true}, (err, client) => {
    if (err) return console.log(err);
    db = client.db(dbName);
});
//patient
router.get("/patient",function(req,res){
    res.render("patient_pages/patient_login");
  })
  //LOGIN DETAILS
router.post('/patient',function(req,res){
  
    patient_id = parseInt(req.body.patient_id);
    var password = req.body.password;
    var query = {"patient_id":patient_id,"password":password};
    console.log(query);
    if (patient_id && password){
    
      db.collection('users').find(query).toArray((err, results) => {
          if(err) throw err;
          console.log(results.length);
          if(results.length<=0)
            res.send('Incorrect Username and/or Password!'); 
          else
            res.redirect('/patient/appointment');  
    });
    
    }
    else
      res.send('Invalid Username and/or Password!');
});
//REGISTER(SIGN UP)
router.get("/register",(req,res)=>{
  db.collection('counters').findAndModify(
    {"_id": "productid"}, // query
    [['_id','asc']],  // sort order
    {$inc:{sequence_value:1}}, 
    {new: true, useFindAndModify: false})
    db.collection("counters").find({"_id":"productid"}).toArray((err,result)=>{
      res.render("patient_pages/register",{patient_id:result});
    })
  });
router.post("/register",(req,res)=>{
      patient_id = parseInt(req.body.patient_id);
      var name = req.body.name;
      var address=req.body.address;
      var password = req.body.password;
      var mobile_no= parseInt(req.body.mobile_no);
      var email_id = req.body.email_id;
    
    var query = {"patient_id":patient_id,"name":name,"address":address,"password":password,"mobile_no":mobile_no,"email_id":email_id};
      
    db.collection('users').insertOne(query,(err,collection)=>{
        if(err){
           throw err;
        }
        console.log("Record Inserted Successfully");
        
    });
        return res.redirect("/patient/appointment");
});
router.get('/patient/appointment', function(req, res)  {
  var res1;
  var res2;
    db.collection("appointment_details").find({"patient_id":patient_id}).toArray((err, results) => {
      res1=results;
      db.collection("test_details").find().toArray((err,results1)=>{
        res2 = results1;
        db.collection("users").find({"patient_id":patient_id}).toArray().then(results2=> 
          res.render('patient_pages/appointment',{record:res1,test:res2,names:results2})
          )
      })
});
});
  
router.post('/patient/appointment', function(req, res){
      var appointment_id=parseInt(req.body.appointment_id);
      //var patient_id = parseInt(req.body.patient_id);
      var patient_name = req.body.name;
      var test_type = req.body.test_type;
      var date = req.body.date;
      var time = req.body.time;
      var query = {"appointment_id":appointment_id,"patient_id":patient_id,"patient_name":patient_name,"test_type":test_type,"date":date,"time":time};
      console.log(query);
      db.collection("appointment_details").insertOne(query,(err,res)=>{
          if (err)
              throw err;
          console.log("1 item inserted");
         
      }); 
      res.redirect('/patient/appointment');
       
});
router.get('/patient/delete_appointment/:id',function(req,res){
  var appointment_id = parseInt(req.params.id);
  var query = {"appointment_id":appointment_id};
  db.collection("appointment_details").deleteOne(query, (err, result) => {
      if (err) throw err;
      console.log("1 item is deleted");
  });
  res.redirect('/patient/appointment');
});  
router.get('/patient/view_appointment',function(req,res){
    //var patient_name = req.body.patient_name;
    //res.render('patient_pages/view_appointment',{record:result})
      db.collection("appointment_details").find({"patient_id":patient_id}).toArray().then(result => res.render('patient_pages/view_appointment',{record:result}));
});

  
router.get('/patient/patient_report',function(req,res){
    //var patient_id = parseInt(req.body.patient_id);
    db.collection("patient_details").find({"patient_id":patient_id}).toArray().then(result => res.render('patient_pages/patient_report',{record:result}));
});

  
router.get('/patient/print/:id', function(req, res){ 
    var patient_id = parseInt(req.params.id);
    db.collection("patient_details").find({"patient_id":patient_id}).toArray().then(result => res.render('patient_pages/print',{record:result}));
});

module.exports = router