const getRegister = (req,res) => {
    res.sendFile("register.html",{root:"./views/templates/AdminLTE-master/pages/examples"});   
};

const postRegister = (req,res) => {
    // res.sendFile("index.html",{root:"./views/templates/AdminLTE-master"});
    console.log(req.body.name);
    console.log("hello");
    console.log(req.body.mail);
    res.redirect("/dashboard");
};

const getLogin = (req,res) => {
    res.sendFile("login.html",{root:"./views/templates/AdminLTE-master/pages/examples"});
};

const getDashboard = (req,res) => {
    res.sendFile("index.html",{root:"./views/templates/AdminLTE-master"});
}

module.exports = {getRegister, postRegister, getLogin, getDashboard};
// name mail pass1 pass2