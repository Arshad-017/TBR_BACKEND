var express = require("express");
var router = express.Router();


let {
  userLoginDeatilsModel,
  TbrEmployeeModel,
  notifyThemModel,
  contactUsModel,
} = require("../DB_Connection/db");

// Authenticating user for Login
router.get("/login", async (req, resp) => {
  const data = await userLoginDeatilsModel.find({
    emailId: req.query.user,
    password: req.query.pass,
  });
  if (data.length > 0) {
    resp.status(200).json({
      status: "ok",
      success: "true",
      message: `Id found in DataBase Welcome to TBR ${data[0].userName}`,
      data: data,
    });
  } else {
    resp.status(200).json({
      message: "No Data Found",
      dataFound: 0,
      success: "false",
    });
  }
});

// registerring to Website.... login user
router.post("/registerUser", async (req, resp) => {
  try {
    let test = await verifyExsistingEmail(req.body.emailId);
    if (test) {
      const data = await userLoginDeatilsModel.create(req.body);
      console.log(data);
      if (data.length != 0) {
        resp.status(200).json({
          message: "User has Successfully Registered to AM_S0FT!!",
          data: data,
          success: "true",
          repeated: "false",
        });
      } else {
        resp.status(200).json({
          message:
            "Some Error Occured At BackEnd .Try Contacting System Adminstrator",
          success: "false",
          repeated: "false",
        });
      }
    } else {
      resp.status(200).json({
        message: "This Email is Already Taken, try using other....",
        success: "true",
        repeated: "true",
      });
    }
  } catch (err) {
    resp.status(500).json({
      message:
        "Some Error Occured At BackEnd .Try Contacting System Adminstrator",
      success: "false",
      repeated: "false",
    });
  }
});

// Getting details of all user - login - credentials
//router.get("/getAllUsers", (req, resp) => {
 // console.log(userLoginDeatils);
 // resp.status(200).json(userLoginDeatils);
//});

// get req for Employee Data 
router.get("/view", async (req, resp) => {
  try {
    const data = await TbrEmployeeModel.find({ DEL_IND: { $ne: "Y" } });
    if (data.length > 0) {
      resp.status(200).json({
        message: "Data Fetch from Db",
        success: "true",
        data: data,
        records_count : data.length
      });
    } else {
      resp.status(200).json({
        message: "No Data in DataBase......",
        success: "true", records_count : data.length
      });
    }
  } catch (err) {
    resp.status(500).json({
      message:
        "Some Error Occured At BackEnd .Try Contacting System Adminstrator",
      success: "false",
    });
  }
});

// get req for Employee Data Archived
router.get("/archiveView", async (req, resp) => {
  try {
    const data = await TbrEmployeeModel.find({ DEL_IND: 'Y' });
    if (data.length > 0) {
      resp.status(200).json({
        message: "Data Fetch from Db",
        success: "true",
        data: data, records_count : data.length
      });
    } else {
      resp.status(200).json({
        message: "No Data in DataBase......",
        success: "true", records_count : data.length
      });
    }
  } catch (err) {
    resp.status(500).json({
      message:
        "Some Error Occured At BackEnd .Try Contacting System Adminstrator",
      success: "false",
    });
  }
});

// Adding Employee to DataBase
router.post("/add/addEmployee", async (req, resp) => {
  try {
    let test = await verifyExsistingEmailTBREmployee(req.body.email);
    if (test) {
      let totalrec = await TbrEmployeeModel.find({});
      totalrec = totalrec.length + 1;
      req.body.emp_id = "TBRE" + totalrec;
      const data = await TbrEmployeeModel.create(req.body);
      console.log(data);
      if (data.length != 0) {
        resp.status(200).json({
          message: `Employee ${req.body.emp_id} Added Successfully !!`,
          data: data,
          success: "true",
          repeated: "false",
        });
      } else {
        resp.status(200).json({
          message:
            "Some Error Occured At BackEnd .Try Contacting System Adminstrator",
          success: "false",
          repeated: "false",
        });
      }
    } else {
      resp.status(200).json({
        message: "This Email is Already Taken, try using other....",
        success: "true",
        repeated: "true",
      });
    }
  } catch (err) {
    resp.status(500).json({
      message:
        "Some Error Occured At BackEnd .Try Contacting System Adminstrator",
      success: "false",
      repeated: "false",
    });
  }
});

// Searching A Employee by emp_id
router.get("/searchSpecificurl/:emp_id", async (req, resp) => {
  try {
    let empId = req.params.emp_id.toUpperCase();
    const data = await TbrEmployeeModel.find({ emp_id: empId });
    if (data.length > 0) {
      resp.status(200).json({
        message: "Data Fetch from Db",
        success: "true",
        data: data,
      });
    } else {
      resp.status(200).json({
        message: "No Data in DataBase......",
        success: "false",
      });
    }
  } catch (err) {
    resp.status(500).json({
      message:
        "Some Error Occured At BackEnd .Try Contacting System Adminstrator",
      success: "false",
    });
  }
});

// Deleting A employee from DataBase
router.post("/delete", async (req, resp) => {
  try {
    let empId = req.body.emp_id.toUpperCase();

    const data = await TbrEmployeeModel.findOneAndUpdate(
      { emp_id: empId, DEL_IND: { $ne: "Y" } },
       req.body
    );
    if (data) {
      resp.status(200).json({
        message: `The Employee ${req.body.emp_id} is  Removed from TBR DataBase.....`,
        success: "true",
        status: "OK",
        data: data,
      });
    } else {
      resp.status(200).json({
        message: "No Data in DataBase......",
        success: "false",
      });
    }
  } catch (err) {
    resp.status(500).json({
      message:
        "Some Error Occured At BackEnd .Try Contacting System Adminstrator",
      success: "false",
    });
  }
});

// Upadting record in DB
router.post("/updateRecords", async (req, resp) => {
  try {
    let message = "Data Not Found In DB";
    let emp_id = req.body.emp_id;
    let updateForm = req.body;
    let data = await TbrEmployeeModel.findOneAndUpdate(
      { emp_id: emp_id, DEL_IND: { $ne: "Y" } },
      updateForm,
      {
        new: true,
      }
    );
    if (data) {
      message = `Details for Employee ${emp_id} are Updated Successfully`;
      resp.status(200).json({
        message: message,
        success: "true",
        status: "OK",
        data: data,
      });
    } else {
      resp.status(200).json({
        message: message,
        success: "false",
      });
    }
  } catch (err) {
    resp.status(500).json({
      message:
        "Some Error Occured At BackEnd .Try Contacting System Adminstrator",
      success: "false",
    });
  }
});

// Post Req for Search Employee Data  /searchSpecificurl
router.post("/searchEmployee", async (req, resp) => {
  console.log("Req Reached for /searchEmployee");

  let fname = req.body.first_name;
  if (fname != null) fname = fname;
  let lname = req.body.last_name;
  if (lname != null) lname = lname;
  let emailId = req.body.email;
  if (emailId != null) emailId = emailId.toLowerCase();
  let empId = req.body.emp_id;
  if (empId != null) empId = empId.toUpperCase();
  let fpre = req.body.prefixFirstName;
  let lpre = req.body.prefixLastName;
  console.log(fname);
  console.log(lname);
  let FregexQuery = fname;
  let LregexQuery = lname;
  if (fpre == "Start with" && fname!="") {
    fname = "^" + fname + ".*";
    FregexQuery = new RegExp(fname, "i");
  } else if (fpre == "Contains" && fname!="" ) {
    fname = ".*" + fname + ".*";
    FregexQuery = new RegExp(fname, "i");
  }
  if (lpre == "Start with" && lname!="") {
    lname = "^" + lname + ".*";
    LregexQuery = new RegExp(lname, "i");
  } else if (lpre == "Contains" && lname!="") {
    lname = ".*" + lname + ".*";
    LregexQuery = new RegExp(lname, "i");
  }
  console.log(FregexQuery);
  console.log(LregexQuery);
  let data = [];
  if (fpre == "Exact Match" || lpre == "Exact Match") {
    if (fpre == "Exact Match" && lpre != "Exact Match") {
      data = await TbrEmployeeModel.find({
        $or: [
          {
            $and: [
              { first_name: fname },
              { last_name: { $regex: LregexQuery } } , { DEL_IND : {$ne : 'Y'} }
            ],
          },
          { email: emailId  ,  DEL_IND : {$ne : 'Y'}},
          { emp_id: empId ,  DEL_IND : {$ne : 'Y'}},
        ],
      });
    } else if (fpre != "Exact Match" && lpre == "Exact Match") {
      data = await TbrEmployeeModel.find({
        $or: [
          {
            $and: [
              { first_name: { $regex: FregexQuery } },
              { last_name: lname },  { DEL_IND : {$ne : 'Y'} }
            ],
          },
          { email: emailId , DEL_IND : {$ne : 'Y'}  },
          { emp_id: empId  ,  DEL_IND : {$ne : 'Y'} },
        ],
      });
    } else if (fpre == "Exact Match" && lpre == "Exact Match") {
      data = await TbrEmployeeModel.find({
        $or: [
          { $and: [{ first_name: fname }, { last_name: lname } , { DEL_IND : {$ne : 'Y'} } ] },
          { email: emailId  ,  DEL_IND : {$ne : 'Y'} },
          { emp_id: empId , DEL_IND : {$ne : 'Y'}  },
        ],
      });
    }
  } else {
    data = await TbrEmployeeModel.find({
      $or: [
        {
          $and: [
            { first_name: { $regex: FregexQuery } },
            { last_name: { $regex: LregexQuery } , }, { DEL_IND : {$ne : 'Y'} }
          ],
        },
        { email: emailId  ,  DEL_IND : {$ne : 'Y'} },
        { emp_id: empId  ,  DEL_IND : {$ne : 'Y'} },
      ],
    });
  }

  if (data) {
    resp.status(200).json({
      data: data,
      message: "OK",
      success: "true",
      records_count: data.length,
    });
  } else {
    resp.status(200).json({
      message: "No Data Found in DataBase",
      success: "false",
    });
  }
});

// ContactUs post req notify
router.post("/contactUs", async (req, resp) => {
  try {
    console.log(req.body)
    const data = await contactUsModel.create(req.body);
    console.log(data);
    if (data) {
      resp.status(200).json({
        message: `Thank you for Connecting , our helpdesk will reach out to you soon!!! Have a Nice Day`,
        data: data,
        success: "true",
        repeated: "false",
      });
    } else {
      resp.status(200).json({
        message:
          "Some Error Occured At BackEnd .Try Contacting System Adminstrator",
        success: "false",
        repeated: "false",
      });
    }
  } catch (err) {
    resp.status(500).json({
      message:
        "Some Error Occured At BackEnd .Try Contacting System Adminstrator",
      success: "false",
      repeated: "false",
    });
  }
});

router.post("/notify", async (req, resp) => {
  try {
    const data = await notifyThemModel.create(req.body);
    console.log(data);
    if (data) {
      resp.status(200).json({
        message: `Thank you ${req.body.fullname} , AM_SOFT will connect with you soon. Have a Nice Day`,
        data: data,
        success: "true",
        repeated: "false",
      });
    } else {
      resp.status(200).json({
        message:
          "Some Error Occured At BackEnd .Try Contacting System Adminstrator",
        success: "false",
        repeated: "false",
      });
    }
  } catch (err) {
    resp.status(500).json({
      message:
        "Some Error Occured At BackEnd .Try Contacting System Adminstrator",
      success: "false",
      repeated: "false",
    });
  }
});

// Validation Test

async function verifyExsistingEmail(emailId) {
  const data = await userLoginDeatilsModel.find({
    emailId: emailId,
  });
  console.log(data.length);
  if (data.length > 0) {
    return false;
  } else {
    return true;
  }
}

async function verifyExsistingEmailTBREmployee(emailId) {
  const data = await TbrEmployeeModel.find({
    email: emailId,
  });
  console.log(data.length);
  if (data.length > 0) {
    return false;
  } else {
    return true;
  }
}

module.exports = router;
