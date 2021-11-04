const Sequelize = require("sequelize");
const express = require("express");
 
const app = express();
const urlencodedParser = express.urlencoded({extended: false});
 
// определяем объект Sequelize
const sequelize = new Sequelize("tek_kaz", "root", "Corei5", {
  dialect: "mysql",
  host: "localhost",
  define: {
    timestamps: false
  }
});

// определяем модель User
const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  firstname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  secondname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  login: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ts: {
    type: Sequelize.STRING,
    allowNull: false
  }

});
 

app.set("view engine", "hbs");
 
// синхронизация с бд, после успшной синхронизации запускаем сервер
sequelize.sync().then(()=>{
  app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
  });
}).catch(err=>console.log(err));
 
// получение данных
app.get("/", function(req, res){
    User.findAll({raw: true }).then(data=>{
      res.render("index.hbs", {
        users: data
      });
    }).catch(err=>console.log(err));
});
 
app.get("/create", function(req, res){
    res.render("create.hbs");
});
 
// добавление данных
app.post("/create", urlencodedParser, function (req, res) {
         
    if(!req.body) return res.sendStatus(400);
         
    const userfirstname = req.body.firstname;
    const usersecondname = req.body.secondname;
    const userlastname = req.body.lastname;
    const userlogin = req.body.login;
    const userpassword = req.body.password;
    const userts = req.body.ts;
    User.create({ firstname: userfirstname, secondname: usersecondname, lastname: userlastname, login: userlogin, password: userpassword, ts: userts}).then(()=>{
      res.redirect("/");
    }).catch(err=>console.log(err));
});
 
// получаем объект по id для редактирования
app.get("/edit/:id", function(req, res){
  const userid = req.params.id;
  User.findAll({where:{id: userid}, raw: true })
  .then(data=>{
    res.render("edit.hbs", {
      user: data[0]
    });
  })
  .catch(err=>console.log(err));
});
 
// обновление данных в БД
app.post("/edit", urlencodedParser, function (req, res) {
         
  if(!req.body) return res.sendStatus(400);
 
  const userfirstname = req.body.firstname;
  const usersecondname = req.body.secondname;
  const userlastname = req.body.lastname;
  const userlogin = req.body.login;
  const userpassword = req.body.password;
  const userts = req.body.ts;
  const userid = req.body.id;
  User.update({firstname: userfirstname, secondname: usersecondname, lastname: userlastname, login: userlogin, password: userpassword, ts: userts}, {where: {id: userid} }).then(() => {
    res.redirect("/");
  })
  .catch(err=>console.log(err));
});
 
// удаление данных
app.post("/delete/:id", function(req, res){  
  const userid = req.params.id;
  User.destroy({where: {id: userid} }).then(() => {
    res.redirect("/");
  }).catch(err=>console.log(err));
});
