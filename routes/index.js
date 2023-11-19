var express = require('express');
var router = express.Router();

let { userLoginDeatils, TbrEmployee } = require('../DB/db')





router.get("/login", (req, resp) => {

    var username = req.query.user;
    var pass = req.query.pass;
    var flag = false;
    for (var i = 0; i < userLoginDeatils.length; i++) {
        var obj = userLoginDeatils[i];
        if (obj.emailId == username && obj.password == pass) {
            resp.status(200).json({
                "status": "ok", "success": "true",
                "message": `Id found in DataBase Welcome to TBR ${username}`,
                "data": obj,
            })
            flag = true;
            break;
        }

    }
    if (flag == false) {
        resp.status(200).json({
            "status": "ok", "success": "false",
            "message": "Failed to Authenticate user due to incorrect password or username"
        })
    }

})

router.post("/registerUser", (req, resp) => {

    userLoginDeatils = [req.body, ...userLoginDeatils]
    console.log(userLoginDeatils)
    resp.status(200).json({
        "message": "Data Added Successfully !!",
        "data": req.body,
    })

})


router.get("/getAllUsers", (req, resp) => {

    console.log(userLoginDeatils)
    resp.status(200).json(userLoginDeatils)

})


// get req for Employee Data 
router.get("/view", (req, resp) => {
    resp.status(200).json(TbrEmployee)
})


router.post("/add/addEmployee", (req, resp) => {

    totalrec = TbrEmployee.length + 1;
    req.body.emp_id = "TBRE" + totalrec;
    TbrEmployee.push(req.body)
    resp.status(200).json({
        "message": `Employee ${req.body.emp_id} Added Successfully !!`,
        "data": req.body,
    })

})


router.get("/searchSpecificurl/:emp_id", (req, resp) => {

    let emp_id = req.params.emp_id;
    let resultJson = [];
    for (let i = 0; i < TbrEmployee.length; i++) {
        if (TbrEmployee[i].emp_id == emp_id) {
            resultJson.push(TbrEmployee[i]);
            break;
        }
    }
    resp.status(200).json({
        "message": `Data Found in Db`,
        "data": resultJson

    })

})


// Upadting record in DB 
router.post("/updateRecords", (req, resp) => {
    let message = "Data Not Found In DB"
    let emp_id = req.body.emp_id;
    let resultJson = [];
    for (let i = 0; i < TbrEmployee.length; i++) {
        if (TbrEmployee[i].emp_id == emp_id) {
            TbrEmployee[i].first_name=req.body.first_name;
            TbrEmployee[i].last_name=req.body.last_name;
            TbrEmployee[i].email=req.body.email;
            TbrEmployee[i].phone=req.body.phone;
            TbrEmployee[i].age=req.body.age;
            TbrEmployee[i].job_title=req.body.job_title;
            TbrEmployee[i].years_of_experience=req.body.years_of_experience;
            TbrEmployee[i].salary=req.body.salary;
            TbrEmployee[i].department=req.body.department;
            message = `Details for Employee ${TbrEmployee[i].emp_id} are Updated Successfully`;
            break;

        }
    }


    resp.status(200).json({
        "message": message, 
        "data": resultJson

    })

})


// Post Req for Search Employee Data  /searchSpecificurl 
router.post("/searchEmployee", (req, resp) => {
    console.log("Req Reached for /searchEmployee")
    let data = [];
    let fname = req.body.first_name;
    if (fname != null)
        fname = fname.toLowerCase();
    let lname = req.body.last_name;
    if (lname != null)
        lname = lname.toLowerCase();
    let emailId = req.body.email;
    if (emailId != null)
        emailId = emailId.toLowerCase();
    let empId = req.body.emp_id;
    if (empId != null)
        empId = empId.toLowerCase();
    let fPre = req.body.prefixFirstName;
    let lpre = req.body.prefixLastName;
    console.log(fname)
    console.log(lname)
    console.log(emailId)
    console.log(empId)
    
    for (let i = 0; i < TbrEmployee.length; i++) {
        let entryMade = false;
        if ((fname != null || fname != "") && (lname != null || lname != "")) {
            if (fPre == "Start with" && lpre == "Start with") {
                if (TbrEmployee[i].first_name.toLowerCase().startsWith(fname) && TbrEmployee[i].last_name.toLowerCase().startsWith(lname)) {
                    data.push(TbrEmployee[i]);
                    continue;
                }
            }
            else if (fPre == "Start with" && lpre == "Contains") {
                if (TbrEmployee[i].first_name.toLowerCase().startsWith(fname) && TbrEmployee[i].last_name.toLowerCase().includes(lname)) {
                    data.push(TbrEmployee[i]); continue;
                }
            }
            else if (fPre == "Start with" && lpre == "Exact Match") {
                if (TbrEmployee[i].first_name.toLowerCase().startsWith(fname) && TbrEmployee[i].last_name.toLowerCase() == (lname)) {
                    data.push(TbrEmployee[i]); continue;
                }
            }
            else if (fPre == "Contains" && lpre == "Contains") {
                if (TbrEmployee[i].first_name.toLowerCase().includes(fname) && TbrEmployee[i].last_name.toLowerCase().includes(lname)) {
                    data.push(TbrEmployee[i]); continue;
                }
            }
            else if (fPre == "Contains" && lpre == "Exact Match") {
                if (TbrEmployee[i].first_name.toLowerCase().includes(fname) && TbrEmployee[i].last_name.toLowerCase() == (lname)) {
                    data.push(TbrEmployee[i]); continue;
                }
            }
            else if (fPre == "Contains" && lpre == "Start with") {
                if (TbrEmployee[i].first_name.toLowerCase().includes(fname) && TbrEmployee[i].last_name.toLowerCase().startsWith(lname)) {
                    data.push(TbrEmployee[i]); continue;
                }
            }
            else if (fPre == "Exact Match" && lpre == "Exact Match") {
                if (TbrEmployee[i].first_name.toLowerCase() == (fname) && TbrEmployee[i].last_name.toLowerCase() == (lname)) {
                    data.push(TbrEmployee[i]); continue;
                }
            }
            else if (fPre == "Exact Match" && lpre == "Start with") {
                if (TbrEmployee[i].first_name.toLowerCase() == (fname) && TbrEmployee[i].last_name.toLowerCase().startsWith(lname)) {
                    data.push(TbrEmployee[i]); continue;
                }
            }
            else if (fPre == "Exact Match" && lpre == "Contains") {
                if (TbrEmployee[i].first_name.toLowerCase().startsWith(fname) && TbrEmployee[i].last_name.toLowerCase().includes(lname)) {
                    data.push(TbrEmployee[i]); continue;
                }
            }

        }
        if (emailId != null && emailId != "" && emailId == TbrEmployee[i].email.toLowerCase() && !entryMade) {
            data.push(TbrEmployee[i]);
            continue;
        }
        if (empId != null && empId != "" && empId == TbrEmployee[i].emp_id.toLowerCase() && !entryMade) {
            data.push(TbrEmployee[i]);
            continue;
        }
    }
    let RecCount = data.length;
    console.log(RecCount)
    console.log("sending Back Response.......data : " + data)
    console.log(data)
    resp.status(200).json({
        "data": data,
        "message": "OK",
        "records_count": RecCount
    })

})

module.exports = router;
