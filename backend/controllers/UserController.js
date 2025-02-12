const createUserToken = require('../helpers/create-user-token');
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = class UserController{

    static async register(req, res){
        const {name, email, phone, password, confirmpassword} = req.body;
        const errors = [];
        //validations
        if(!name){
            errors.push('O nome é obrigatório!');
        }

        if(!email){
            errors.push('O email é obrigatório!');
        }

        if(!phone){
            errors.push('O telefone é obrigatório!');
        }

        if(!password){
            errors.push('A senha é obrigatória!');
        }

        if(!confirmpassword){
            errors.push('A confirmação da senha é obrigatória!');
        }

        if(password !== confirmpassword){
            errors.push('A senha e a confirmação de senha devem ser iguais!');
        }

        const userExists = await User.findOne({email: email});

        if(userExists){
            errors.push('Este usuário já existe, por favor utilize outro email!');
        }

        if(errors.length > 0){
            res.status(422).json({message: errors});
            return;
        }

        //create password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = new User({name, email, phone, password: passwordHash});

        try{
            const newUser = await user.save();
            await createUserToken(newUser, req, res);
            // res.status(201).json({message: 'Usuário cadastrado com sucesso!', data: newUser});
            return;
        }catch(e){
            res.status(500).json({message: e});
            return;
        }
    }

    static async login(req, res){
        const { email, password } = req.body;

        const errors = [];
        //validations
        if(!email){
            errors.push('O email é obrigatório!');
        }

        if(!password){
            errors.push('A senha é obrigatória!');
        }

        const user = await User.findOne({email: email});

        if(!user){
            errors.push('Este usuário não existe!');
        }else{
            const checkPassword = await bcrypt.compare(password, user.password);

            if(!checkPassword){
                errors.push('Senha inválida');
            }
        }

       
        if(errors.length > 0){
            res.status(422).json({message: errors});
            return;
        }

        await createUserToken(user, req, res);
        return;
    }

    static async checkUser(req, res){
        let currentUser;

        if(req.headers.authorization){
            const token = getToken(req);
            const decoded = jwt.verify(token, 'nossosecret');

            currentUser = await User.findById(decoded.id);
            currentUser.password = undefined;
        }else{
            currentUser = null;
        }

        res.status(200).send(currentUser);
    }

    static async getUserById(req, res){
        const id = req.params.id;

        const user = await User.findById(id).select('-password');

        const errors = [];
        //validations
        if(!user){
            errors.push('Usuário não encontrado!');
        }

        if(errors.length > 0){
            res.status(422).json({message: errors});
            return;
        }

        res.status(200).json({user});
    }

    static async editUser(req, res){
        const id = req.params.id;
        let passwordHash;
        const token = getToken(req);
        const user = await getUserByToken(token);

        const errors = [];
        const {name, email, phone, password, confirmpassword} = req.body;

        let image = '';

        if(req.file){
            image = req.file.filename
        }

        const userExists = await User.findOne({email: email});

        if(user.email !== email && userExists){
           errors.push('Email já cadastrado no sistema!');
        }

        //validations
        if(!name){
            errors.push('O nome é obrigatório!');
        }

        if(!email){
            errors.push('O email é obrigatório!');
        }

        if(!phone){
            errors.push('O telefone é obrigatório!');
        }

        if(password !== confirmpassword){
            errors.push('A senha e a confirmação de senha devem ser iguais!');
        }else if(password === confirmpassword && password != null){
            const salt = await bcrypt.genSalt(12);
            passwordHash = await bcrypt.hash(password, salt);
        }

        if(errors.length > 0){
            res.status(422).json({message: errors});
            return;
        }

        const userData = {
            name, email, phone, password: passwordHash, image
        }

        try {
            await User.findByIdAndUpdate(user._id, {$set: userData}, {new: true});

            res.status(200).json({message: 'Dados atualizados com sucesso'});
            return;
        } catch (error) {
            res.status(500).json({message: [error]});
            return;
        }

    }

}