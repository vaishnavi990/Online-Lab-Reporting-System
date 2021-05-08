var express = require("express");
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://127.0.0.1:27017";
const dbName = 'main_admin';
let db;
MongoClient.connect(url, { useUnifiedTopology: true ,useNewUrlParser: true}, (err, client) => {
    if (err) return console.log(err);
    db = client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database : ${dbName}`);
    
});
router.get('/',function(req,res){
    res.render('admin_pages/home');
});
router.get("/admin",function(req,res){
    res.render("admin_pages/admin");
  })
router.post('/admin',function(req,res){
  
    var email_id = req.body.email_id;
    var password = req.body.password;
    var query = {"email_id":email_id,"password":password};
    console.log(query);
    if (email_id && password){
    
      db.collection('admin_credits').find(query).toArray((err, results) => {
          if(err) throw err;
          console.log(results.length);
          if(results.length<=0)
            res.send('Incorrect Username and/or Password!'); 
          else
            res.redirect('/admin/add_test');  
    });
    
    }
    else
    res.send('Invalid Username and/or Password!');
});
//Add Test Details
router.get('/admin/add_test',function(req,res){
    db.collection("test_details").find().toArray().then(result => res.render('admin_pages/index',{record:result}));
});
router.post('/admin/add_test',function(req,res){
    var test_id = parseInt(req.body.test_id);
    var test_type = req.body.test_type;
    var cost = parseInt(req.body.cost);
    cost = (cost*0.05)+cost;
    var query = {"test_id":test_id,"test_type":test_type,"cost":cost};
    //console.log(query);
    db.collection("test_details").insertOne(query,(err,res)=>{
      if (err)
          throw err;
      console.log("1 item inserted");   
      
    });
    res.redirect('/admin/add_test');
});
//edit Test details
router.get('/edit_test_details/:id',function(req,res){
    var test_id =parseInt(req.params.id);
    var query={"test_id":test_id};
    //console.log(query);
    db.collection("test_details").findOne(query, function(err, result) {
      if (err) throw err;
      //console.log(result.test_id);
      res.render('admin_pages/edit_pages/edit_test',{record:result});
    });
  });
router.post('/edit_test_details/',function(req,res){
    var test_id = parseInt(req.body.test_id);
    var test_type = req.body.test_type;
    var cost = parseInt(req.body.cost);
    var query = {"test_id":test_id};
    var update_query ={ $set: {"test_type":test_type,"cost":cost} };
    console.log(query);
    db.collection("test_details").updateOne(query,update_query, function(err, result) {
      if (err) throw err;
      console.log("1 document updated");
    });
    res.redirect('/admin/add_test');
  });
//Delete
router.get('/delete_test/:id',function(req,res){
    var test_id = parseInt(req.params.id);
    var query = {"test_id":test_id};
    db.collection("test_details").deleteOne(query, (err, result) => {
        if (err) throw err;
        console.log("1 item is deleted");
    });
    res.redirect('/admin/add_test');
});
//ADD parameter Details
router.get('/admin/parameter_details',function(req,res){
    db.collection("parameter_details").find().toArray().then(result => res.render('admin_pages/parmeter_details',{record:result}));
  });
router.post('/admin/parameter_details',function(req,res){
    var test_id = parseInt(req.body.test_id);
    var test_type = req.body.test_type;
    var minimum = parseInt(req.body.minimum);
    var maximum = parseInt(req.body.maximum);
    var query = {"test_id":test_id,"test_type":test_type,"minimum":minimum,"maximum":maximum};
    //console.log(query);
    db.collection("parameter_details").insertOne(query,(err,res)=>{
      if (err)
          throw err;
      console.log("1 item inserted");   
      
    });
    res.redirect('/admin/parameter_details');
});
//Edit parameter details
router.get('/edit_parameter_details/:id',function(req,res){
    var test_id =parseInt(req.params.id);
    var query={"test_id":test_id};
    //console.log(query);
    db.collection("parameter_details").findOne(query, function(err, result) {
      if (err) throw err;
      //console.log(result.test_id);
      res.render('admin_pages/edit_pages/edit_parameter',{record:result});
    });
  });
router.post('/edit_parameter_details/',function(req,res){
    var test_id = parseInt(req.body.test_id);
    var test_type = req.body.test_type;
    var minimum = parseInt(req.body.minimum);
    var maximum = parseInt(req.body.maximum);
    var query = {"test_id":test_id};
    var update_query ={ $set: {"test_id":test_id,"test_type":test_type,"minimum":minimum,"maximum":maximum} };
    console.log(query);
    db.collection("parameter_details").updateOne(query,update_query, function(err, result) {
      if (err) throw err;
      console.log("1 document updated");
    });
    res.redirect('/admin/parameter_details');
  });
//Delete parameter details
router.get('/delete_parameter_details/:id',function(req,res){
    var test_id = parseInt(req.params.id);
    var query = {"test_id":test_id};
    db.collection("parameter_details").deleteOne(query, (err, result) => {
        if (err) throw err;
        console.log("1 item is deleted");
    });
    res.redirect('/admin/parameter_details');
}); 
// Appointment Details
router.get('/admin/appointment_details',function(req,res){
    db.collection("appointment_details").find().toArray().then(result => res.render('admin_pages/view_patient_appointment',{record:result}));
});
router.post('/admin/appointment_details',function(req,res){
    var patient_id = parseInt(req.body.patient_id);
    console.log(patient_id);
    if(Number.isNaN(patient_id)){
      db.collection("appointment_details").find({}).toArray().then(result => res.render('admin_pages/view_patient_appointment',{record:result}));
    }
    else
      db.collection("appointment_details").find({"patient_id":patient_id}).toArray().then(result => res.render('admin_pages/view_patient_appointment',{record:result}));
});
//patient test details
router.get('/admin/patient_test_details',function(req,res,next){
    db.collection("patient_details").find().toArray().then(result => res.render('admin_pages/patient_test_details',{record:result}));
});
router.post('/admin/patient_test_details',function(req,res){
    var patient_id = parseInt(req.body.patient_id);
    var patient_name = req.body.patient_name;
    var test_id = parseInt(req.body.test_id);
    var test_type = req.body.test_type;
    var report_on = req.body.report_on;
    var minimum = parseInt(req.body.minimum);
    var maximum = parseInt(req.body.maximum);
    var query = {"patient_id":patient_id,"patient_name":patient_name,"test_id":test_id,"test_type":test_type,"report_on":report_on,"minimum":minimum,"maximum":maximum};
    console.log(query);
    db.collection("patient_details").insertOne(query,(err,res)=>{
      if (err)
          throw err;
      console.log("1 item inserted");   
      
    });
    res.redirect('/admin/patient_test_details');
});
//edit patient test details
router.get('/edit_patient_test_details/:query',function(req,res){
    var query=JSON.parse(req.params.query);
    console.log(query.test_id);
    db.collection("patient_details").findOne(query, function(err, result) {
      if (err) throw err;
      console.log(result.test_id);
      res.render('admin_pages/edit_pages/edit_patient_test_details',{record:result});
    });
  });
router.post('/edit_patient_test_details/',function(req,res){
  var patient_id = parseInt(req.body.patient_id);
  var patient_name = req.body.patient_name;
  var test_id = parseInt(req.body.test_id);
  var test_type = req.body.test_type;
  var report_on = req.body.report_on;
  var minimum = parseInt(req.body.minimum);
  var maximum = parseInt(req.body.maximum);
  var query = {"patient_id":patient_id,"test_id":test_id};
  var update_query ={ $set: {"patient_name":patient_name,"test_type":test_type,"report_on":report_on,"minimum":minimum,"maximum":maximum}};
    console.log(query);
    db.collection("patient_details").updateOne(query,update_query, function(err, result) {
      if (err) throw err;
      console.log("1 document updated");
    });
    res.redirect('/admin/patient_test_details');
  });
//delete patient test details
router.get('/delete_patient_test_details/:id',function(req,res){
    var patient_id =parseInt(req.params.id);
    var query = {"patient_id":patient_id};
    db.collection("patient_details").deleteOne(query, (err, result) => {
        if (err) throw err;
        console.log("1 item is deleted");
    });
    res.redirect('/admin/patient_test_details');
});
// Report 
router.get('/admin/report',function(req,res){
    db.collection("patient_details").find().toArray().then(result => res.render('admin_pages/report',{record:result}));
  });
router.post('/admin/report',function(req,res){
    var patient_id = parseInt(req.body.patient_id);
    if(Number.isNaN(patient_id)){
      db.collection("patient_details").find({}).toArray().then(result => res.render('admin_pages/report',{record:result}));
    }
    else
      db.collection("patient_details").find({"patient_id":patient_id}).toArray().then(result => res.render('admin_pages/report',{record:result}));
  });
module.exports = router