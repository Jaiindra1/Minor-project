const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
const bcrypt = require("bcrypt");
const dbPath = path.join(__dirname, "javapoint.db");
const jwt = require("jsonwebtoken");

app.use(express.json());

let db = null;
let jwtToken = null;
let loginStatus = null;
let userName = null;
let hallticket_number = userName;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
const authenticateToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Login First");
      } else {
        request.username = payload.username;
        next();
      }
    });
  }
};
app.get('/', async(request,response) => {
  response.sendFile("/index.html",{root : __dirname});
});
app.get('/signup', async(request,response)=>{
  response.sendFile(__dirname + "/signup.html")
});
app.get('/Homepage',authenticateToken, async(request,response) => {
    response.sendFile(__dirname + '/Homepage.html');
});
app.get('/Homedetails', async(request, response) => {
  const quer = `select name from 'student' where ROLLNO = '${userName}';`;
  const con =await  db.all(quer);
  response.json(con);
})
app.get('/ok',authenticateToken,async(req,res)=> {
  res.sendFile(__dirname + "/ok.html");
})
app.post('/login/user',async(request,response) =>{
  const {name,password} = request.body;
  userName = name;
  const selectUserQuery = `SELECT * FROM login ;`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid User");
    loginStatus = "failed";
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      loginStatus = "success"
      const payload = {
        username: name,
      };
       jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
      let Loginarray = ["Login success !",jwtToken]
      response.json(Loginarray);
      console.log("login success",name);
    } else {
      response.status(400);
      response.send("Invalid Password");
    }
  }
});
app.post('/signup/userdetails',async(request,response)=>{
  const {name,password} = request.body;
  const hasedPassword =  await bcrypt.hash(request.body.password, 10);
  const selectUserQuery = `select * from login where name='${name}';`;
  const dbuser = await db.get(selectUserQuery);
  if (dbuser === undefined) {
    const q = `insert into login (name,password) 
    values('${name}','${hasedPassword}');`;
    const dbResponse = await db.run(q);
  response.sendFile(__dirname + "/index.html");
  console.log("created");
  }
  else {
    response.status = 400;
    response.json("user lready exists " + `${name}`);
    console.log("user exits");
  }
});
app.get('/1-1Results', async(request, response)=> {
  response.sendFile(__dirname + "/src/Results/1-1Results.html");
});       
app.get('/1-2Results', async(request, response)=> {
  response.sendFile(__dirname + "/src/Results/1-1Results.html");
});
app.get('/2-1Results', async(request, response)=> {
  response.sendFile(__dirname + "/src/Results/1-1Results.html");
});
app.get('/2-2Results', async(request, response)=> {
  response.sendFile(__dirname + "/src/Results/1-1Results.html");
});
app.get('/3-1Results', async(request, response)=> {
  response.sendFile(__dirname + "/src/Results/1-1Results.html");
});
app.get('/3-2Results', async(request, response)=> {
  response.sendFile(__dirname + "/src/Results/1-1Results.html");
});
app.get('/4-1Results', async(request, response)=> {
  response.sendFile(__dirname + "/src/Results/1-1Results.html");
});
app.get('/4-2Results', async(request, response)=> {
  response.sendFile(__dirname + "/src/Results/1-1Results.html");
});                                                      
app.get("/1-1Res",authenticateToken, async(request, response) => {
  const resultquery = `SELECT * FROM "1-1results" where Htno = '18X41A1229';`;
  const array = await db.all(resultquery);
  response.json(array);
});
app.get("/1-2Res",authenticateToken, async(request, response) => {
  const resultquery = `SELECT * FROM "1-2results" where Htno = '${request.username}';`;
  const array = await db.all(resultquery);
  response.json(array);
});
app.get("/2-1Res",authenticateToken, async(request, response) => {
  const resultquery = `SELECT * FROM "2-1results" where Htno = '${request.username}';`;
  const array = await db.all(resultquery);
  response.json(array);
});
app.get("/2-2Res",authenticateToken, async(request, response) => {
  const resultquery = `SELECT * FROM "2-2results" where Htno = '${request.username}';`;
  const array = await db.all(resultquery);
  response.json(array);
});
app.get("/3-1Res",authenticateToken, async(request, response) => {
  const resultquery = `SELECT * FROM "3-1results" where Htno = '${request.username}';`;
  const array = await db.all(resultquery);
  response.json(array);
});
app.get("/3-2Res",authenticateToken, async(request, response) => {
  const resultquery = `SELECT * FROM "3-2results" where Htno = '${request.username}';`;
  const array = await db.all(resultquery);
  response.json(array);
});
app.get("/4-1Res",authenticateToken, async(request, response) => {
  const resultquery = `SELECT * FROM "4-1results" where Htno = '${request.username}';`;
  const array = await db.all(resultquery);
  response.json(array);
});
app.get("/4-2Res",authenticateToken, async(request, response) => {
  const resultquery = `SELECT * FROM "4-2results" where Htno = '${request.username}';`;
  const array = await db.all(resultquery);
  response.json(array);
});
