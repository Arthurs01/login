const express = require("express");
const router = express.Router();
const connection = require("./database/users_db");
const bcryptjs = require('bcryptjs');

// Sección Login
router.get("/login", (req, res) => {
  res.render("login");
});

//Nuevo registro GET
router.get("/register", (req, res) => {
  res.render("register");
});
// Nuevo registro POST
router.post("/register", async (req, res) => {
  const { user, name, rol, pass } = req.body;
  let passwordHash = await bcryptjs.hash(pass, 8);
  
  if (user && pass) {
    connection.query("SELECT * FROM users WHERE user = ?",[user], async (error, results) => {
        if (results.length == 0) {
    connection.query("insert into users set ?",{ user: user, name: name, rol: rol, pass:passwordHash },
    async (error, result) => {
      res.render("login",{
      alert: true,
      alertTitle: "Registration",
      alertMessage: "Successfull Registration",
      alertIcon: 'success',
      showConfirmButton: false,
      timer: 1500,
      ruta: 'login'
      })
    }
  )

} else {
          res.render("login", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "El Usuario ya existe!",
            alertIcon: "error",
            showConfirmButton: true,
            timer: 2500,
            ruta: "login",
          });
   
        }
      }
    );
  }
  
}
  )

const session = require("express-session");
router.use(
  session({
    secret: "clave123",
    resave: true,
    saveUninitialized: true,
  })
);

// Autenticación
router.post("/auth", async (req, res) => {
  const user = req.body.user;
  const pass = req.body.pass;
  let passwordHash = await bcryptjs.hash(pass, 8);
  if (user && pass) {
    connection.query(
      "SELECT * FROM users WHERE user = ?",[user], async (error, results) => {
        if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
          res.render("login", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Usuario y/o password incorrectas",
            alertIcon: "error",
            showConfirmButton: true,
            timer: 1500,
            ruta: "login",
          });
        } else {
          req.session.loggedin = true;
          req.session.name = results[0].name;
          res.render("login", {
            alert: true,
            alertTitle: "Conexión exitosa",
            alertMessage: "LOGIN CORRECTO!",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: "",
          });
        }
      }
    );
  } else {
    res.render("login", {
      alert: true,
      alertTitle: "Advertencia",
      alertMessage: "Por favor ingresa un usuario y/o password!",
      alertIcon: "warning",
      showConfirmButton: true,
      timer: null,
      ruta: "login",
    });
  }
});

router.get("/", (req, res) => {
  if (req.session.loggedin) {
    connection.query("SELECT * FROM users", (error, result) => {
      res.render("index", {
        login: true,
        api: result,
        name: req.session.name,
      });
    });
  } else {
    res.render("index", {
      login: false,
      name: "Debe iniciar sesion",
    });
  }
});
// Lista de usuarios Mysql
router.get("/users_db", (req, res) => {
  if (req.session.loggedin) {
    connection.query("SELECT * FROM users", (error, result) => {
      res.render("users_db", {
        login: true,
        api: result,
        name: req.session.name,
      });
    });
  } else {
    res.render("users_db", {
      login: false,
      name: "Debe iniciar sesion",
    });
  }
});

// Cerrar sesión...
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

router.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.render("edit", { api: results[0] });
      }
    }
  );
});

router.post("/update", (req, res) => {
  const id = req.body.id;
  const user = req.body.user;
  const name = req.body.name;
  const rol = req.body.rol;
  /* const pass = req.body.pass; */
  connection.query(
    "UPDATE users SET ? WHERE id = ?",
    [{ user: user, name: name, rol: rol }, id],
    (error, results) => {
      res.redirect("/");
    }
  );
});
router.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.render("edit", { api: results[0] });
      }
    }
  );
});
// Eliminar sencillo...
router.get("/delete/:id", (req, res) => {
const id = req.params.id;
  connection.query("SELECT * FROM users WHERE id = ?",[id],(error, results) =>{
        if (error) {
          throw error;
        } else {
            res.render('delete', {api:results}) 
        }
      }
    );    
});

router.get("/del/:id", (req, res) => {
const id = req.params.id;
  connection.query("DELETE FROM users WHERE id = ?",[id],(error, results) =>{
        if (error) {
          throw error;
        } else {
            res.redirect('/') 
        }
      }
    );    
});

// Lista de usuarios
/* router.get('/users', (req, res) =>{ 
    const result = re.datax 
    res.render('users', {api: result});
}); */

module.exports = router;
