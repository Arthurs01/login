const express = require('express')
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use('/', require('./router'));
app.use(express.static(path.join(__dirname,'public')));

app.listen(process.env.PORT || 3000, ()=>{
    console.log('Servidor activo enhttp://localhost:3000');
});