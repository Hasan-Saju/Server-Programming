const randomstring = require("randomstring");
const uniqueString = require("unique-string");
const ProgrammingContest = require("../models/ProgrammingContest.model");
const nodemailer = require("nodemailer");

const senderMail = process.env.UserEmail;
const password = process.env.UserPass;

const teamHash = uniqueString();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: senderMail,
    pass: password,
  },
});

const getCP = (req, res) => {
  res.render("programming-contest/register.ejs", {
    error: req.flash("error"),
  });
};

const postCP = (req, res) => {
  const {
    teamName,
    institution,
    coach,
    contactCoach,
    emailCoach,
    tshirtCoach,
    leader,
    contactLeader,
    emailLeader,
    tshirtLeader,
    member1,
    contactMember1,
    emailMember1,
    tshirtMember1,
    member2,
    contactMember2,
    emailMember2,
    tshirtMember2,
  } = req.body;

  const total = 2000;
  const paid = 0;
  const selected = false;
  let error = "";

  ProgrammingContest.findOne({
    teamName: teamName,
    institution: institution,
  }).then((team) => {
    if (team) {
      error = "Team with this team name and institution already exists!";
      console.log(error);
      req.flash("error", error);
      res.redirect("/ProgrammingContest/register");
    } else {
      const team = new ProgrammingContest({
        teamName,
        institution,
        coach,
        contactCoach,
        emailCoach,
        tshirtCoach,
        leader,
        contactLeader,
        emailLeader,
        tshirtLeader,
        member1,
        contactMember1,
        emailMember1,
        tshirtMember1,
        member2,
        contactMember2,
        emailMember2,
        tshirtMember2,
        total,
        paid,
        selected,
        teamHash,
      });
      team
        .save()
        .then(() => {
          error = "Team has been registered successfully!";
          console.log(error);

          const toMailList = [
            emailCoach,
            emailLeader,
            emailMember1,
            emailMember2,
          ];

          const name = [coach, leader, member1, member2];

          var to;
          const subject =
            "Team registration complete in Programming Contest of ICT Fest, 2021";
          var body;
          console.log(teamHash);

          for (let i = 0; i < toMailList.length; i++) {
            to = toMailList[i];
            body = `Welcome to ICT Fest 2021, ${name[i]} . Your team's registration successfully completed for Programming Contest. Team Details: Team Name-${teamName}, Coach- ${coach}, Leader- ${leader}, Member 1- ${member1}, Member 2- ${member2} . Your team's identifier is: ${teamHash}. Best of luck for the contest.`;

            const options = {
              from: senderMail,
              to: to,
              subject: subject,
              text: body,
            };

            transporter.sendMail(options, function (err, info) {
              if (err) {
                console.log(err);
                return;
              }
              console.log("Sent: " + info.response);
            });
          }

          req.flash("error", error);
          res.redirect("/ProgrammingContest/register");
        })
        .catch((err) => {
          error = "An unexpected error occured while registering team";
          console.log(error);
          console.log(err);
          req.flash("error", error);
          res.redirect("/ProgrammingContest/register");
        });
    }
  });
};

const getCPList = (req, res) => {
  let all_team = [];
  let error = "";
  ProgrammingContest.find()
    .then((data) => {
      all_team = data;
      res.render("programming-contest/list.ejs", {
        error: req.flash("error"),
        teams: all_team,
      });
    })
    .catch(() => {
      error = "Failed to retrieve data!";
      res.render("programminh-contest/list.ejs", {
        error: req.flash("error", error),
        teams: all_team,
      });
    });
};
const deleteCP = (req, res) => {
  let error = "";

  ProgrammingContest.deleteOne({ _id: req.params.id })
    .then(() => {
      let error = "Data has been deleted successfully!";
      req.flash("error", error);
      res.redirect("/ProgrammingContest/list");
    })
    .catch(() => {
      let error = "Failed to delete data";
      req.flash("error", error);
      res.redirect("/ProgrammingContest/list");
    });
};
const paymentDoneCP = (req, res) => {
  const id = req.params.id;

  ProgrammingContest.findOne({ _id: id })
    .then((team) => {
      team.paid = team.total;
      team
        .save()
        .then(() => {
          let error = "Payment completed successfully!";
          req.flash("error", error);
          res.redirect("/ProgrammingContest/list");
        })
        .catch(() => {
          let error = "Data could not be updated!";
          req.flash("error", error);
          res.redirect("/ProgrammingContest/list");
        });
    })
    .catch(() => {
      let error = "Data could not be updated!";
      req.flash("error", error);
      res.redirect("/ProgrammingContest/list");
    });
};
const selectCP = (req, res) => {
  const id = req.params.id;

  ProgrammingContest.findOne({ _id: id })
    .then((team) => {
      team.selected = true;
      team
        .save()
        .then(() => {
          let error = "Team has been selected successfully!";
          req.flash("error", error);
          res.redirect("/ProgrammingContest/list");
        })
        .catch(() => {
          let error = "Data could not be updated!";
          req.flash("error", error);
          res.redirect("/ProgrammingContest/list");
        });
    })
    .catch(() => {
      let error = "Data could not be updated!";
      req.flash("error", error);
      res.redirect("/ProgrammingContest/list");
    });
};

const editCP = (req, res) => {
  const id = req.params.id;
  let teamInfo;

  ProgrammingContest.findOne({ _id: id })
    .then((team) => {
      teamInfo = team;
      // console.log(teamInfo);
      res.render("programming-contest/editTeam.ejs", {
        error: req.flash("error"),
        teamInfo: team,
      });
    })
    .catch(() => {
      error = "Failed to update data!";
      res.render("programming-contest/list.ejs", {
        error: req.flash("error", error),
      });
    });
};

const postEditCP = (req, res) => {
  const {
    teamName,
    institution,
    coach,
    contactCoach,
    emailCoach,
    tshirtCoach,
    leader,
    contactLeader,
    emailLeader,
    tshirtLeader,
    member1,
    contactMember1,
    emailMember1,
    tshirtMember1,
    member2,
    contactMember2,
    emailMember2,
    tshirtMember2,
  } = req.body;
  console.log("here");

  ProgrammingContest.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: {
        teamName,
        institution,
        coach,
        contactCoach,
        emailCoach,
        tshirtCoach,
        leader,
        contactLeader,
        emailLeader,
        tshirtLeader,
        member1,
        contactMember1,
        emailMember1,
        tshirtMember1,
        member2,
        contactMember2,
        emailMember2,
        tshirtMember2,
      },
    }
  )
    .then(() => {
      let error = "Data has been updated!";
      req.flash("error", error);
      res.redirect("/ProgrammingContest/list");
    })
    .catch((err) => {
      let error = "Data could not be updated!";
      req.flash("error", error);
      res.redirect("/ProgrammingContest/list");
    });
};

module.exports = {
  getCP,
  postCP,
  getCPList,
  deleteCP,
  paymentDoneCP,
  selectCP,
  editCP,
  postEditCP,
};
