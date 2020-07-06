//jshint esversion:6

/*

[7/6/2020]

This application can create, edit and delete students and vacation data.
It can also fetch the current database from mongodb atlas.
Regarding creating students, the user will enter student's name and date of birth(to differentiate those with the same full name, if any),
    followed by start date and the number of weeks. And then the end date will be calculated based on the input.

    When creating and deleting students, all fields are required.
    When editing students' data, only one of their start date and end date is required as well as their name.
    
    The actual data might look weird, but that's because the insight is based on the fact:
        that the input dates will always be Mondays and that the end dates will always be Fridays.
    
        The count includes the week of the starting day, so if the input is 7/6/2020 and 2 weeks, the end date will be 7/24/2020.

    If the user adds vacation period data, then this program has to skip counting those dates
        Using the same example, if the input is 7/6/2020, 2 weeks but there is a vacation period that is 7/13/2020 - 7/17/2020 (1 week),
            the end date is 7/31/2020.
        ** This part has not been implemented yet **


    My first full stack web app, which guarantees its being error prone. But thankfully, I'm always open to suggestions
        and any type of feedback is welcome (only if given politely and reasonably). I will keep working on this to its perfection.

[Agamotto All-Seeing]

*/

const ejs = require("ejs");
const bodyParser = require("body-parser");
const express = require("express");
const https = require("https");
const mongoose = require("mongoose");
const _ = require("lodash");
require("dotenv").config();

const admin = process.env.ADMIN_ID;
const adminPass = process.env.ADMIN_PASS;

mongoose.connect(
  "mongodb+srv://admin-" +
    admin +
    ":" +
    adminPass +
    "@cluster0-jlcms.mongodb.net/counterDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

let studentsInfo = [];
let vacationsInfo = [];

const studentSchema = {
  fName: {
    type: String,
    required: "Please enter the first name",
  },
  lName: {
    type: String,
    required: "Please enter the last name",
  },
  birthMonth: {
    type: String,
    required: "Please enter the last name",
  },
  birthDay: {
    type: String,
    required: "Please enter the last name",
  },
  birthYear: {
    type: String,
    required: "Please enter the last name",
  },
  startingMonth: {
    type: String,
    required: "This field cannot be blank",
  },
  startingDay: {
    type: String,
    required: "This field cannot be blank",
  },
  startingYear: {
    type: String,
    required: "This field cannot be blank",
  },
  endingMonth: String,
  endingDay: String,
  endingYear: String,
  numOfWeeks: {
    type: String,
    required: "This field cannot be blank",
  },
  createdAt: String,
};

const vacationSchema = {
  vName: String,
  startMonth: {
    type: String,
    required: "This field cannot be blank",
  },
  startDay: {
    type: String,
    required: "This field cannot be blank",
  },
  startYear: {
    type: String,
    required: "This field cannot be blank",
  },
  endMonth: {
    type: String,
    required: "This field cannot be blank",
  },
  endDay: {
    type: String,
    required: "This field cannot be blank",
  },
  endYear: {
    type: String,
    required: "This field cannot be blank",
  },
  createAt: String,
};

const Student = mongoose.model("Student", studentSchema);
const Vacation = mongoose.model("Vacation", vacationSchema);

// Get methods
app.get("/", (req, res) => {
  const apiKey = process.env.API_KEY;
  // let query = req.body.cityName;
  const query = process.env.CITY_NAME;
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit;

  https.get(url, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const tempLow = weatherData.main.temp_min;
      const tempHigh = weatherData.main.temp_max;
      const weatherDescription = weatherData.weather[0].description;
      // const icon = weatherData.weather[0].icon;
      // const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.render("index", {
        cityName: _.upperFirst([_.toLower([query])]),
        weatherDescription: weatherDescription,
        currentTempLow: Math.round(tempLow),
        currentTempHigh: Math.round(tempHigh),
      });
    });
  });
});

app.get("/create", (req, res) => {
  res.render("create", {
    dataAlreadyExists: "",
  });
});

app.get("/edit", (req, res) => {
  res.render("edit", {
    noMatches: "",
  });
});

/* **** **** **** **** **** **** **** **** **** **** Student database **** **** **** **** **** **** **** **** **** **** */
app.get("/database", (req, res) => {
  Student.find({}, (err, allStudents) => {
    if (!err) {
      res.render("database", {
        pageText: "Current database",
        studentsInfo: allStudents,
      });
    } else {
      throw err;
    }
  });
});
/* **** **** **** **** **** **** **** **** **** **** Student database **** **** **** **** **** **** **** **** **** **** */

app.get("/delete", (req, res) => {
  res.render("delete", {
    deleteConfirmMessage: "",
  });
});

app.get("/vacation", (req, res) => {
  const apiKey = process.env.API_KEY;
  // let query = req.body.cityName;
  const query = process.env.CITY_NAME;
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit;

  https.get(url, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const tempLow = weatherData.main.temp_min;
      const tempHigh = weatherData.main.temp_max;
      const weatherDescription = weatherData.weather[0].description;
      // const icon = weatherData.weather[0].icon;
      // const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.render("vacation", {
        cityName: _.upperFirst([_.toLower([query])]),
        weatherDescription: weatherDescription,
        currentTempLow: Math.round(tempLow),
        currentTempHigh: Math.round(tempHigh),
      });
    });
  });
});

app.get("/noresult", (req, res) => {
  res.render("noresult");
});

app.get("/vacationCreate", (req, res) => {
  res.render("vacationCreate", {
    vacDataAlreadyExists: "",
  });
});

app.get("/vacationEdit", (req, res) => {
  res.render("vacationEdit", {
    noVMatches: "",
  });
});

/* **** **** **** **** **** **** **** **** **** **** Vacation database **** **** **** **** **** **** **** **** **** **** */
app.get("/vacationDatabase", (req, res) => {
  Vacation.find({}, (err, allVacations) => {
    if (!err) {
      res.render("vacationDatabase", {
        vacPageText: "Current database",
        vacationsInfo: allVacations,
      });
    } else {
      throw err;
    }
  });
});
/* **** **** **** **** **** **** **** **** **** **** Vacation database **** **** **** **** **** **** **** **** **** **** */

app.get("/vacationDelete", (req, res) => {
  res.render("vacationDelete", {
    vacDeleteConfirmMessage: "",
  });
});

// Get methods

// Post methods

/* **** **** **** **** **** **** **** **** **** **** **** **** Student **** **** **** **** **** **** **** **** **** **** **** **** */
/* **** **** **** **** **** **** **** **** **** **** **** **** Student **** **** **** **** **** **** **** **** **** **** **** **** */
/* **** **** **** **** **** **** **** **** **** **** **** **** Student **** **** **** **** **** **** **** **** **** **** **** **** */
/* **** **** **** **** **** **** **** **** **** **** **** **** Student **** **** **** **** **** **** **** **** **** **** **** **** */

/* **** **** **** **** **** **** **** **** **** **** **** **** Create Student **** **** **** **** **** **** **** **** **** **** **** **** */
/* **** **** **** **** **** **** **** **** **** **** **** **** Create Student **** **** **** **** **** **** **** **** **** **** **** **** */
app.post("/create", (req, res) => {
  const numWeeks = Number(req.body.createNumberOfWeeks);

  // keeping original data
  const originalSDate = new Date(
    req.body.createStartingYear,
    String(Number(req.body.createStartingMonth) - 1),
    req.body.createStartingDay
  );

  // the actual data that is going to be used
  const sDate = new Date(
    req.body.createStartingYear,
    String(Number(req.body.createStartingMonth) - 1),
    req.body.createStartingDay
  );

  // start date are always Monday,
  // and the end date have to be Friday, hence add 4
  sDate.setDate(sDate.getDate() + 4);

  // count is inclusive of the week of the start date
  sDate.setDate(sDate.getDate() + (numWeeks - 1) * 7);

  // Add new student to the database
  Student.find({}, {}, (err, studentsDatabase) => {
    if (!err) {
      // check if the data already exists
      // does not create the data if it already exists (full name, date of birth)
      // 7/2/2020 working!
      Student.find(
        {
          $and: [
            {
              $or: [
                {
                  fName: _.upperFirst([
                    _.toLower([req.body.createStudentFName]),
                  ]),
                },
                {
                  lName: _.upperFirst([
                    _.toLower([req.body.createStudentLName]),
                  ]),
                },
              ],
            },
            {
              $or: [
                {
                  birthMonth: req.body.dobMonth,
                },
                {
                  birthDay: req.body.dobDay,
                },
                {
                  birthYear: req.body.dobYear,
                },
              ],
            },
          ],
        },
        {},
        (err, foundStudent) => {
          if (!err) {
            // no such data exists
            // create and save a new one
            if (foundStudent.length < 1) {
              const student = new Student({
                fName: _.upperFirst([_.toLower([req.body.createStudentFName])]),
                lName: _.upperFirst([_.toLower([req.body.createStudentLName])]),
                birthMonth: req.body.dobMonth,
                birthDay: req.body.dobDay,
                birthYear: req.body.dobYear,
                startingMonth: String(originalSDate.getMonth() + 1),
                startingDay: originalSDate.getDate(),
                startingYear: originalSDate.getFullYear(),
                endingMonth: String(sDate.getMonth() + 1),
                endingDay: sDate.getDate(),
                endingYear: sDate.getFullYear(),
                numOfWeeks: String(numWeeks),
                createdAt: new Date(),
              });

              studentsInfo.push(student);

              student.save();

              res.render("createSuccess", {
                succMsg: "Successfully created the data:",
                succFName: _.upperFirst([
                  _.toLower([req.body.createStudentFName]),
                ]),
                succLName: _.upperFirst([
                  _.toLower([req.body.createStudentLName]),
                ]),
                succBirthMonth: req.body.dobMonth,
                succBirthDay: req.body.dobDay,
                succBirthYear: req.body.dobYear,
                succStartingMonth: String(originalSDate.getMonth() + 1),
                succStartingDay: originalSDate.getDate(),
                succStartingYear: originalSDate.getFullYear(),
                succEndingMonth: String(sDate.getMonth() + 1),
                succEndingDay: sDate.getDate(),
                succEndingYear: sDate.getFullYear(),
                succNumOfWeeks: String(numWeeks),
              });

              // data already exists
            } else {
              res.render("create", {
                dataAlreadyExists: "The data already exists.",
              });
            }

            // if there is an error
          } else {
            console.log("Error");
            res.render("createFailure");
          }
        }
      );
    } else {
      res.render("createFailure");
      throw err;
    }
  });
});

/* **** **** **** **** **** **** **** **** **** **** **** **** Edit Student **** **** **** **** **** **** **** **** **** **** **** **** */
/* **** **** **** **** **** **** **** **** **** **** **** **** Edit Student **** **** **** **** **** **** **** **** **** **** **** **** */
app.post("/edit", (req, res) => {
  Student.find(
    {
      $and: [
        {
          $and: [
            {
              fName: _.upperFirst([_.toLower([req.body.editStudentFName])]),
            },
            {
              lName: _.upperFirst([_.toLower([req.body.editStudentLName])]),
            },
          ],
        },
        {
          $and: [
            {
              birthMonth: req.body.editBirthMonth,
            },
            {
              birthDay: req.body.editBirthDay,
            },
            {
              birthYear: req.body.editBirthYear,
            },
          ],
        },
      ],
    },
    (err, foundStudent) => {
      // if there is no error
      // find the data and edit
      if (!err) {
        // if no matches were found (there's no such student)
        // show a message
        if (foundStudent.length < 1) {
          res.render("edit", {
            noMatches: "No match(es) found",
          });

          // if there is a match
          // find it and update
        } else {
          // running the algorithm again as the student's starting date data has changed
          const numWeeks = Number(req.body.editNumOfWeeks);

          // keeping original data
          const originalSDate = new Date(
            req.body.editStartingYear,
            String(Number(req.body.editStartingMonth) - 1),
            req.body.editStartingDay
          );

          // the actual data that is going to be used
          const sDate = new Date(
            req.body.editStartingYear,
            String(Number(req.body.editStartingMonth) - 1),
            req.body.editStartingDay
          );

          // start date are always Monday,
          // and the end date have to be Friday, hence add 4
          sDate.setDate(sDate.getDate() + 4);

          // count is inclusive of the week of the start date
          sDate.setDate(sDate.getDate() + (numWeeks - 1) * 7);

          res.render("editSuccess", {
            editMsgOne: "The following student's data:",
            editSuccFName: _.upperFirst([
              _.toLower([req.body.findStudentFName]),
            ]),
            editSuccLName: _.upperFirst([
              _.toLower([req.body.findStudentLName]),
            ]),
            editSuccBirthMonth: req.body.editBirthMonth,
            editSuccBirthDay: req.body.editBirthDay,
            editSuccBirthYear: req.body.editBirthYear,
            editMsgTwo: "Has been modified as follows:",
            editSuccStartingMonth: String(originalSDate.getMonth() + 1),
            editSuccStartingDay: originalSDate.getDate(),
            editSuccStartingYear: originalSDate.getFullYear(),
            editSuccEndingMonth: String(sDate.getMonth() + 1),
            editSuccEndingDay: sDate.getDate(),
            editSuccEndingYear: sDate.getFullYear(),
            editSuccNumOfWeeks: String(numWeeks),
          });

          Student.findOneAndUpdate(
            {
              $and: [
                {
                  $and: [
                    {
                      fName: _.upperFirst([
                        _.toLower([req.body.editStudentFName]),
                      ]),
                    },
                    {
                      lName: _.upperFirst([
                        _.toLower([req.body.editStudentLName]),
                      ]),
                    },
                  ],
                },
                {
                  $and: [
                    {
                      birthMonth: req.body.editBirthMonth,
                    },
                    {
                      birthDay: req.body.editBirthDay,
                    },
                    {
                      birthYear: req.body.editBirthYear,
                    },
                  ],
                },
              ],
              // just update student's starting date
            },
            {
              $set: {
                startingMonth: String(originalSDate.getMonth() + 1),
                startingDay: originalSDate.getDate(),
                startingYear: originalSDate.getFullYear(),
                endingMonth: String(sDate.getMonth() + 1),
                endingDay: sDate.getDate(),
                endingYear: sDate.getFullYear(),
                numOfWeeks: String(numWeeks),
              },
            },
            (err, result) => {
              if (!err) {
                console.log("Job's done!");
              } else {
                throw err;
              }
            }
          );
        }
      }
    }
  );
});

/* **** **** **** **** **** **** **** **** **** **** **** **** Delete Student **** **** **** **** **** **** **** **** **** **** **** **** */
/* **** **** **** **** **** **** **** **** **** **** **** **** Delete Student **** **** **** **** **** **** **** **** **** **** **** **** */
app.post("/delete", (req, res) => {
  Student.find(
    {
      $and: [
        {
          $and: [
            {
              fName: _.upperFirst([_.toLower([req.body.findStudentFName])]),
            },
            {
              lName: _.upperFirst([_.toLower([req.body.findStudentLName])]),
            },
          ],
        },
        {
          $and: [
            {
              birthMonth: req.body.deleteBirthMonth,
            },
            {
              birthDay: req.body.deleteBirthDay,
            },
            {
              birthYear: req.body.deleteBirthYear,
            },
          ],
        },
      ],
    },
    (err, foundStudent) => {
      // when there is no error
      if (!err) {
        // when no matches found
        // do not delete anything
        if (foundStudent.length < 1) {
          res.render("delete", {
            deleteConfirmMessage: "No match(es) found",
          });

          // if a match is found
          // show message...

          // 7/2/2020 everything is working fine
          // the collection with current documents would not work well
          // because i was too lazy and added a couple of documents with the same f/l name and dobs
        } else {
          res.render("deleteSuccess", {
            delFName: _.upperFirst([_.toLower([req.body.findStudentFName])]),
            delLName: _.upperFirst([_.toLower([req.body.findStudentLName])]),
            delBirthMonth: req.body.deleteBirthMonth,
            delBirthDay: req.body.deleteBirthDay,
            delBirthYear: req.body.deleteBirthYear,
          });

          // ...and delete it
          Student.findOneAndDelete(
            {
              $and: [
                {
                  $and: [
                    {
                      fName: _.upperFirst([
                        _.toLower([req.body.findStudentFName]),
                      ]),
                    },
                    {
                      lName: _.upperFirst([
                        _.toLower([req.body.findStudentLName]),
                      ]),
                    },
                  ],
                },
                {
                  $and: [
                    {
                      birthMonth: req.body.deleteBirthMonth,
                    },
                    {
                      birthDay: req.body.deleteBirthDay,
                    },
                    {
                      birthYear: req.body.deleteBirthYear,
                    },
                  ],
                },
              ],
            },
            (err, result) => {
              if (err) {
                throw err;
              } else {
                console.log("Job's done!");
              }
            }
          );
        }
      } else {
        throw err;
      }
    }
  );
});

/* **** **** **** **** **** **** **** **** **** **** **** **** Vacation **** **** **** **** **** **** **** **** **** **** **** **** */
/* **** **** **** **** **** **** **** **** **** **** **** **** Vacation **** **** **** **** **** **** **** **** **** **** **** **** */
/* **** **** **** **** **** **** **** **** **** **** **** **** Vacation **** **** **** **** **** **** **** **** **** **** **** **** */
/* **** **** **** **** **** **** **** **** **** **** **** **** Vacation **** **** **** **** **** **** **** **** **** **** **** **** */

/* **** **** **** **** **** **** **** **** **** **** **** **** Create Vacation **** **** **** **** **** **** **** **** **** **** **** **** */
/* **** **** **** **** **** **** **** **** **** **** **** **** Create Vacation **** **** **** **** **** **** **** **** **** **** **** **** */
app.post("/vacationCreate", (req, res) => {
  // Add new vacation to the database
  Vacation.find({}, {}, (err, vacationDatabase) => {
    // check if the data already exists
    // does not create the data if it already exists (name, date)

    Vacation.find(
      {
        $and: [
          {
            vName: req.body.createVacationName,
          },
          {
            $and: [
              {
                startMonth: req.body.vacationStartingMonth,
              },
              {
                startDay: req.body.vacationStartingDay,
              },
              {
                startYear: req.body.vacationStartingYear,
              },
            ],
          },
          {
            $and: [
              {
                endMonth: req.body.vacationEndingMonth,
              },
              {
                endDay: req.body.vacationEndingDay,
              },
              {
                endYear: req.body.vacationEndingYear,
              },
            ],
          },
        ],
      },
      {},
      (err, foundVacation) => {
        if (!err) {
          // no such data exists
          // create and save a new one
          if (foundVacation.length < 1) {
            const vStartDate = new Date(
              req.body.vacationStartingYear,
              String(Number(req.body.vacationStartingMonth) - 1),
              req.body.vacationStartingDay
            );
            const vEndDate = new Date(
              req.body.vacationEndingYear,
              String(Number(req.body.vacationEndingMonth) - 1),
              req.body.vacationEndingDay
            );

            const vacation = new Vacation({
              vName: _.upperFirst([_.toLower([req.body.createVacationName])]),
              startMonth: String(vStartDate.getMonth() + 1),
              startDay: vStartDate.getDate(),
              startYear: vStartDate.getFullYear(),
              endMonth: String(vEndDate.getMonth() + 1),
              endDay: vEndDate.getDate(),
              endYear: vEndDate.getFullYear(),
              createdAt: new Date(),
            });

            vacationsInfo.push(vacation);

            vacation.save();

            res.render("vacationSuccess", {
              vacMsg: "Successfully created the data:",
              vacSuccName: _.upperFirst([
                _.toLower([req.body.createVacationName]),
              ]),

              vacSuccStartingMonth: String(vStartDate.getMonth() + 1),
              vacSuccStartingDay: vStartDate.getDate(),
              vacSuccStartingYear: vStartDate.getFullYear(),
              vacSuccEndingMonth: String(vEndDate.getMonth() + 1),
              vacSuccEndingDay: vEndDate.getDate(),
              vacSuccEndingYear: vEndDate.getFullYear(),
            });

            // data already exists
          } else {
            res.render("vacationCreate", {
              vacDataAlreadyExists: "The data already exists.",
            });
          }

          // if there is an error
        } else {
          throw err;
        }
      }
    );
  });
});

/* **** **** **** **** **** **** **** **** **** **** **** **** Edit Vacation **** **** **** **** **** **** **** **** **** **** **** **** */
/* **** **** **** **** **** **** **** **** **** **** **** **** Edit Vacation **** **** **** **** **** **** **** **** **** **** **** **** */

app.post("/vacationEdit", (req, res) => {
  Vacation.find(
    {
      $and: [
        {
          vName: _.upperFirst([_.toLower([req.body.findVacationName])]),
        },
        {
          $or: [
            {
              $and: [
                {
                  startMonth: req.body.findVacationStartingMonth,
                },
                {
                  startDay: req.body.findVacationStartingDay,
                },
                {
                  startYear: req.body.findVacationStartingYear,
                },
              ],
            },
            {
              $and: [
                {
                  endMonth: req.body.findVacationEndingMonth,
                },
                {
                  endDay: req.body.findVacationEndingDay,
                },
                {
                  endYear: req.body.findVacationEndingYear,
                },
              ],
            },
          ],
        },
      ],
    },
    (err, foundVacation) => {
      // if there is no error
      // find the data and edit
      if (!err) {
        // if no matches were found (there's no such vacation)
        // show a message
        if (foundVacation.length < 1) {
          res.render("vacationEdit", {
            noVMatches: "No match(es) found",
          });

          // if there is a match
          // find it and update
        } else {
          const updateVacStartDate = new Date(
            req.body.updateVacationStartingYear,
            String(Number(req.body.updateVacationStartingMonth) - 1),
            req.body.updateVacationStartingDay
          );
          const updateVacEndDate = new Date(
            req.body.updateVacationEndingYear,
            String(Number(req.body.updateVacationEndingMonth) - 1),
            req.body.updateVacationEndingDay
          );

          res.render("vacationEditSuccess", {
            vacUpdateMsgOne: "The following data:",
            vacFoundName: _.upperFirst([
              _.toLower([req.body.findVacationName]),
            ]),
            vacFoundStartingMonth: req.body.findVacationStartingMonth,
            vacFoundStartingDay: req.body.findVacationStartingDay,
            vacFoundStartingYear: req.body.findVacationStartingYear,
            vacFoundEndingMonth: req.body.findVacationEndingMonth,
            vacFoundEndingDay: req.body.findVacationEndingDay,
            vacFoundEndingYear: req.body.findVacationEndingYear,
            vacUpdateMsgTwo: "Has been modified as follows:",
            vacUpdateName: _.upperFirst([
              _.toLower([req.body.updateVacationName]),
            ]),
            vacUpdateStartingMonth: String(updateVacStartDate.getMonth() + 1),
            vacUpdateStartingDay: updateVacStartDate.getDate(),
            vacUpdateStartingYear: updateVacStartDate.getFullYear(),
            vacUpdateEndingMonth: String(updateVacEndDate.getMonth() + 1),
            vacUpdateEndingDay: updateVacEndDate.getDate(),
            vacUpdateEndingYear: updateVacEndDate.getFullYear(),
          });

          Vacation.findOneAndUpdate(
            {
              $and: [
                {
                  vName: _.upperFirst([_.toLower([req.body.findVacationName])]),
                },
                {
                  $or: [
                    {
                      $and: [
                        {
                          startMonth: req.body.findVacationStartingMonth,
                        },
                        {
                          startDay: req.body.findVacationStartingDay,
                        },
                        {
                          startYear: req.body.findVacationStartingYear,
                        },
                      ],
                    },
                    {
                      $and: [
                        {
                          endMonth: req.body.findVacationEndingMonth,
                        },
                        {
                          endDay: req.body.findVacationEndingDay,
                        },
                        {
                          endYear: req.body.findVacationEndingYear,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              $set: {
                vName: _.upperFirst([_.toLower([req.body.updateVacationName])]),
                startMonth: String(updateVacStartDate.getMonth() + 1),
                startDay: updateVacStartDate.getDate(),
                startYear: updateVacStartDate.getFullYear(),
                endMonth: String(updateVacEndDate.getMonth() + 1),
                endDay: updateVacEndDate.getDate(),
                endYear: updateVacEndDate.getFullYear(),
              },
            },
            (err, result) => {
              if (!err) {
                console.log("Job's done!");
              } else {
                throw err;
              }
            }
          );
        }
      }
    }
  );
});

/* **** **** **** **** **** **** **** **** **** **** **** **** Delete Vacation **** **** **** **** **** **** **** **** **** **** **** **** */
/* **** **** **** **** **** **** **** **** **** **** **** **** Delete Vacation **** **** **** **** **** **** **** **** **** **** **** **** */
app.post("/vacationDelete", (req, res) => {
  Vacation.find(
    {
      $and: [
        {
          vName: _.upperFirst([_.toLower([req.body.getVacationName])]),
        },
        {
          $and: [
            {
              $and: [
                {
                  startMonth: req.body.deleteStartMonth,
                },
                {
                  startDay: req.body.deleteStartDay,
                },
                {
                  startYear: req.body.deleteStartYear,
                },
              ],
            },
            {
              $and: [
                {
                  endMonth: req.body.deleteEndMonth,
                },
                {
                  endDay: req.body.deleteEndDay,
                },
                {
                  endYear: req.body.deleteEndYear,
                },
              ],
            },
          ],
        },
      ],
    },
    (err, foundStudent) => {
      // when there is no error
      if (!err) {
        // when no matches found
        // do not delete anything
        if (foundStudent.length < 1) {
          res.render("vacationDelete", {
            vacDeleteConfirmMessage: "No match(es) found",
          });

          // if a match is found
          // show message...
        } else {
          res.render("vacationDeleteSuccess", {
            delVacName: _.upperFirst([_.toLower([req.body.getVacationName])]),
            delVacStartMonth: req.body.deleteStartMonth,
            delVacStartDay: req.body.deleteStartDay,
            delVacStartYear: req.body.deleteStartYear,
            delVacEndMonth: req.body.deleteEndMonth,
            delVacEndDay: req.body.deleteEndDay,
            delVacEndYear: req.body.deleteEndYear,
          });

          // ...and delete it
          Vacation.findOneAndDelete(
            {
              $and: [
                {
                  vName: _.upperFirst([_.toLower([req.body.getVacationName])]),
                },
                {
                  $and: [
                    {
                      $and: [
                        {
                          startMonth: req.body.deleteStartMonth,
                        },
                        {
                          startDay: req.body.deleteStartDay,
                        },
                        {
                          startYear: req.body.deleteStartYear,
                        },
                      ],
                    },
                    {
                      $and: [
                        {
                          endMonth: req.body.deleteEndMonth,
                        },
                        {
                          endDay: req.body.deleteEndDay,
                        },
                        {
                          endYear: req.body.deleteEndYear,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            (err, result) => {
              if (err) {
                throw err;
              } else {
                console.log("Job's done!");
              }
            }
          );
        }
      } else {
        throw err;
      }
    }
  );
});

// Post methods

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
  console.log("Server is running...");
});