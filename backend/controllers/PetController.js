const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const Pet = require('../models/Pet');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = class PetController {
    static async create(req, res){

        const {name, age, weight, color} = req.body;
        const errors = [];
        const available = true;

        //imgs
        const images = req.files;

        //validation
        if(!name){
            errors.push('O nome é obrigatório!');
        }

        if(!age){
            errors.push('A idade é obrigatória!');
        }

        if(!weight){
            errors.push('O peso é obrigatório!');
        }

        if(!color){
            errors.push('A cor é obrigatória!');
        }

        if(images.length === 0){
            errors.push("A imagem é obrigatória!");
        }

        if(errors.length > 0){
            res.status(422).json({message: errors});
            return;
        }

        const token = getToken(req);
        const user = await getUserByToken(token);
        //create a pet
        const pet = new Pet({
            name, 
            age, 
            weight, 
            color, 
            available, 
            images: [], 
            user:{
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
                email: user.email
            }
        });

        images.map(image => pet.images.push(image.filename));

        try{
            const newPet = await pet.save();
            res.status(201).json({
                message: 'Pet cadastrado com sucesso!',
                newPet
            });
            return;
        }catch(e){
            res.status(500).json({message: [e]});
        }
        res.json({message: 'Deu certo!'});
    }

    static async getAll(req, res){

        const pets = await Pet.find().sort('-createdAt');

        res.status(200).json({
            pets
        })
    }

    static async getAllUserPets(req, res){
        const token = getToken(req);
        const user = await getUserByToken(token);

        const pets = await Pet.find({'user._id': user._id}).sort('-createdAt');

        res.status(200).json({pets});
    }

    static async getAllUserAdoptions(req, res){
        const token = getToken(req);
        const user = await getUserByToken(token);

        const pets = await Pet.find({'adopter._id':user._id}).sort('-createdAt');

        res.status(200).json({pets});
    }

    static async getPetById(req, res){
        const id = req.params.id;

        if(!ObjectId.isValid(id)){
            res.status(422).json({message: ['ID inválido']});
            return;
        }

        const pet = await Pet.findOne({_id: id});

        if(!pet){
            res.status(404).json({message: ['Pet não encontrado']});
            return;
        }

        res.status(200).json({
            pet
        });
    }

    static async removePetById(req, res){
        const id = req.params.id;

        if(!ObjectId.isValid(id)){
            res.status(422).json({message: ['ID inválido']});
            return;
        }

        const pet = await Pet.findOne({_id: id});

        if(!pet){
            res.status(404).json({message: ['Pet não encontrado']});
            return;
        }

        const token = getToken(req);
        const user = await getUserByToken(token);
        
        if(user._id.toString() !== pet.user._id.toString()){
            res.status(422).json({message: ['Este pet não pertence a você!']});
            return;
        }

        await Pet.findByIdAndDelete(id);

        res.status(200).json({message: 'Removido com sucesso!'});
    }

    static async updatePet(req, res){
        const id = req.params.id;
        const {name, age, weight, color, available} = req.body;
        const images = req.files || [];
        let updatedData = {};
        const errors = [];

        //validation
        const pet = await Pet.findOne({_id: id});

        if(!pet){
            res.status(404).json({message: ['Pet não encontrado']});
            return;
        }

        const token = getToken(req);
        const user = await getUserByToken(token);
        
        if(user._id.toString() !== pet.user._id.toString()){
            res.status(422).json({message: ['Este pet não pertence a você!']});
            return;
        }


        if(!name){
            errors.push('O nome é obrigatório!');
        }

        if(!age){
            errors.push('A idade é obrigatória!');
        }

        if(!weight){
            errors.push('O peso é obrigatório!');
        }

        if(['Selecione uma opção...', '', undefined, null].includes(color)){
            errors.push('A cor é obrigatória!');
        }

        if(errors.length > 0){
            res.status(422).json({message: errors});
            return;
        }

        updatedData = {
            name, age, weight, color, available
        }

        if(images.length > 0){
            updatedData['images'] = images.map(item => item.filename)
        }

        await Pet.findByIdAndUpdate(id, updatedData);

        res.status(200).json({message: 'Pet atualizado com sucesso'});
    }

    static async schedule(req, res){
        const id = req.params.id;

        if(!ObjectId.isValid(id)){
            res.status(422).json({message: ['ID inválido']});
            return;
        }

        const pet = await Pet.findOne({_id: id});

        if(!pet){
            res.status(404).json({message: ['Pet não encontrado']});
            return;
        }

        const token = getToken(req);
        const user = await getUserByToken(token);

        if(pet.user._id.equals(user._id)){
            res.status(422).json({message: ['Este pet já pertence a você!']});
            return;
        }

        if(pet.adopter){
            if(pet.adopter._id.equals(user._id)){
                res.status(422).json({message: ['Você já agendou uma visita para este pet!']});
                return;
            }
        }

        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image,
            email: user.email,
            phone: user.phone
        }

        await Pet.findByIdAndUpdate(id, pet);

        res.status(200).json({message: `Visita agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone} ou email ${pet.user.email}`});
        return;
    }

    static async concludeAdoption(req, res){
        const id = req.params.id;

        if(!ObjectId.isValid(id)){
            res.status(422).json({message: ['ID inválido']});
            return;
        }

        const pet = await Pet.findOne({_id: id});

        if(!pet){
            res.status(404).json({message: ['Pet não encontrado']});
            return;
        }


        const token = getToken(req);
        const user = await getUserByToken(token);

        if(pet.user._id.toString() !== user._id.toString()){
            res.status(422).json({message: ['Este pet já pertence a você!']});
            return;
        }

        pet.available = false;

        await Pet.findByIdAndUpdate(id, pet);

        res.status(200).json({message: 'Parabéns, o ciclo de adoção foi concluido com sucesso!'});
        return;
    }


}