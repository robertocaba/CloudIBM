const { User, Post, Token, Sequelize } = require('../models/index.js');
const bcrypt= require ('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwt_secret } = require('../config/config.json')['development'];
const { Op} = Sequelize;
const transporter = require("../config/nodemailer")


const UserController = {
    async create(req, res) {
        try {
          const hash = bcrypt.hashSync(req.body.password, 10);
          const user = await User.create({
            ...req.body,
            password: hash,
            confirmed: false,
            rol: "user",
          });
          const url = 'http://localhost:3000/users/confirm/'+ req.body.email
          await transporter.sendMail({
            to: req.body.email,
            subject: "Confirme su registro",
            html: `<h3>Bienvenido, estás a un paso de registrarte </h3>
            <a href="#"> Click para confirmar tu registro</a>
            `,
          });
          res.status(201).send({
            message: "Te hemos enviado un correo para confirmar el registro",
            user,
          });
        } catch (err) {
          console.log(err);
          res.status(500).send({
            message: "Ha habido un problema al intentar logearse",
            errMessage: err.errors[0].message,
          });
        }
      },
      async confirm(req,res){
        try {
          const user = await User.update({confirmed:true},{
            where:{
              email: req.params.email
            }
          })
          res.status(201).send( "Usuario confirmado con exito" );
        } catch (error) {
          console.error(error)
        }
      },
    
    
    

    getAll(req, res) {
        User.findAll({
                include: [Post]
            })
            .then(users => res.send(users))
            .catch(err => {
                console.log(err)
                res.status(500).send({ message: 'Ha habido un problema al cargar las publicaciones' })
            })
    },
    async delete(req, res) {
        await User.destroy({
            where: {
                id: req.params.id
            }
        })
        await Post.destroy({
            where: {
                UserId: req.params.id
            }
        })
        res.send(
            'El usuario ha sido eliminado con éxito'
        )
    },
    async update(req, res) {
        await User.update({...req.body},
        {
            where: {
                id: req.params.id
            }
        })
            res.send('Usuario actualizado con éxito');
    },
    login(req,res){
        User.findOne({
            where:{
                email:req.body.email
            }
        }).then(user=>{
            if(!user){
                return res.status(400).send({message:"Usuario o contraseña incorrectos"})
            }
            const isMatch = bcrypt.compareSync(req.body.password, user.password);
            if(!isMatch){
                return res.status(400).send({message:"Usuario o contraseña incorrectos"})
            }
            token = jwt.sign({ id: user.id }, jwt_secret);
 			Token.create({ token, UserId: user.id });
            res.send({ message: 'Bienvenid@' + user.name, user, token });
        })

    },
    async logout(req, res) {
        try {
            await Token.destroy({
                where: {
                    [Op.and]: [
                        { UserId: req.user.id },
                        { token: req.headers.authorization }
                    ]
                }
            });
            res.send({ message: 'Desconectado con éxito' })
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: 'hubo un problema al tratar de desconectarte' })
        }
    },





}

module.exports = UserController
