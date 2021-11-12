const express = require('express');
const app = express();

app.use(express.json());


const port = 5000;
app.listen(port,() => console.log("http://localhost:5000"));

const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect:'sqlite',
    storage:'./database.sqlite'
});

sequelize.authenticate()
.then(() => {
    console.log("conexion establecida");
})
.catch(err=>{
    console.log("Erro en la conexión a la BD");
});


const Mentores = sequelize.define(
    'mentores',
    {
        nombre:Sequelize.TEXT,
        especialidad:Sequelize.STRING
    });

sequelize.sync({force:true})
.then(()=>
{
    console.log("BD y tabla creada");
    Mentores.bulkCreate(
        [
            {nombre: 'Cesar Mayta',especialidad:'Backend'},
            {nombre: 'Jorge Garnica',especialidad:'FrontEnd'},
        ]).then(function() {
            return Mentores.findAll();
        }).then(function(mentores){
            console.log(mentores)
        })
})

app.get('/',(req,res)=> res.send("Nuestros Mentores"));

app.get('/mentores',
function(req,res){
    Mentores.findAll().then(
        mentores => res.json(mentores)
    );
}
)

app.get('/mentores/:id',
function(req,res){
    Mentores.findAll({where: {id:req.params.id}}).then(
        mentores => res.json(mentores)
    );
}
)

app.post('/mentores',
function(req,res){
    Mentores.create(
        {
            nombre : req.body.nombre,
            especialidad: req.body.especialidad
        })
        .then(function(mentores){
            res.json(mentores);
        })

})

app.delete('/mentores/:id',
function(req,res){
    Mentores.findByPk(req.params.id)
    .then(function(mentores){
        mentores.destroy();
    }).then(function(mentores){
        res.sendStatus(200);
    })

})

app.put('/mentores/:id',
function(req,res){
    Mentores.findByPk(req.params.id)
    .then(function(mentores){
        mentores.update(
            {
                nombre : req.body.nombre,
                especialidad: req.body.especialidad
            }
        ).then(function(mentores){
            res.json(mentores)
        })
    })
})
