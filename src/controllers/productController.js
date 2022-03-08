//const req = require('express/lib/request');
//const jsonDB = require('../model/jsonDatabase');
//const product = jsonDB('products');
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const path = require('path');
let db = require('../database/models');
const sequelize = db.sequelize;
const { Op, where } = require("sequelize");
const { buildCheckFunction } = require('express-validator');
const { createConnection } = require('net');

//una forma de llamar a modelos de la carpeta models
const Products = db.Products;
const Categories = db.Categories;
const Numbersofinstallments = db.Numbersofinstallments;
const Sections = db.Sections;

const productController={
    
    all:(req,res)=>{
        
        let productos =Products.findAll()
        .then(function(productos){
            res.render('./products/index',{productos:productos,mil:toThousand})
        })
        
    },
    listAdmi:(req,res)=>{//listado para los admi
        let listadoAdmi= Products.findAll()
        .then(function(listadoAdmi) {
            
            res.render('./products/allproducts',{listadoAdmi:listadoAdmi,mil:toThousand})})
        .catch(error => res.send(error))
    },
    listClient:(req,res)=>{//listado para los clientes
        let listadoClientProduct= Products.findAll()
        .then(function(listadoClientProduct) {
            
            res.render('./products/todos',{listadoClientProduct:listadoClientProduct,mil:toThousand})})
        .catch(error => res.send(error))
    },
    
    add:(req, res)=>{
        let promesaCuotas= Numbersofinstallments.findAll();
        let promesaSections= Sections.findAll();
        let promesaCategories= Categories.findAll();
        
        Promise.all([promesaCuotas, promesaSections, promesaCategories])
        .then(function([ cuotas, secciones, categorias]) {
            console.log(cuotas);
            console.log(secciones);
            console.log(categorias);
            res.render('./products/productAdd', {cuotas:cuotas, secciones:secciones, categorias:categorias})})
        .catch(error => res.send(error))
    
    },
    create:(req,res)=>{
        console.log(req.file.filename)
            Products.create({
                name:req.body.nombre,
                description:req.body.descripcion,
                duesId:req.body.cuotas,
                price:req.body.precio,
                img:req.file.filename,
                visibility:req.body.visualizacion,
                stock:req.body.stock,
                stockMin:req.body.stockMinimo,
                stockMax:req.body.stockMaximo,
                sectionId:req.body.secciones,
                categoryId:req.body.categorias,
            })
            
        .then(()=>{
            res.redirect('/');
        })
            
        .catch(error => res.send(error))
    },
    
    edit:(req, res)=> {
        let pedidoProducto=Products.findByPk(req.params.id);

        let promesaCuotas= Numbersofinstallments.findAll();
        let promesaSections= Sections.findAll();
        let promesaCategories= Categories.findAll();
        
        Promise.all([pedidoProducto, promesaCuotas, promesaSections, promesaCategories])
        .then(function([ producto, cuotas, secciones, categorias]) {
            
            res.render('./products/editProduct', {producto:producto, cuotas:cuotas, secciones:secciones, categorias:categorias})})
        .catch(error => res.send(error))

    },

    update:(req, res)=> {
        let unProducto=Products.findByPk(req.params.id);
        //console.log(req.file.filename)

        Products.update({
            name:req.body.nombre,
            description:req.body.descripcion,
            duesId:req.body.cuotas,
            price:req.body.precio,
            img:req.file!=null?req.file.filename:unProducto.img,
            visibility:req.body.visualizacion,
            stock:req.body.stock,
            stockMin:req.body.stockMinimo,
            stockMax:req.body.stockMaximo,
            sectionId:req.body.seccion,
            categoryId:req.body.categoria,
        },{
            where:{
                id:req.params.id
            }
        })
        .then(()=>{
            res.redirect("/allproducts")
        })
        .catch(error => res.send(error))

    },
    detail:(req,res)=>{
        let pedidoProducto= Products.findByPk(req.params.id);
        let pedidoListas= Products.findAll();
        let promesaCuotas= Numbersofinstallments.findAll();
        let promesaSections= Sections.findAll();
        let promesaCategories= Categories.findAll();
        
        Promise.all([pedidoProducto, pedidoListas, promesaCuotas, promesaSections, promesaCategories])
        .then(function([ producto, productos, cuotas, secciones, categorias]) {
            
            res.render('./products/productDetail', {producto:producto, productos:productos, cuotas:cuotas, secciones:secciones, categorias:categorias, mil:toThousand})
        })
        .catch(error => res.send(error))    
    },
    cart: (req,res)=>{
        res.render('./products/productCart')
    },
    resumen: function(req,res) {
        res.render('./products/resumen')
    },
    delete:(req,res)=>{
        Products.destroy({
            where:{
                id:req.params.id
            }
        })
        res.redirect("/allproducts");
    },

    search: (req, res) => {
    
        let search = req.query.search.toLowerCase()
        
        db.Products.findAll({
            include: ['Category']
        })
        .then( products => {
            let filtrados = products.filter(e => e.name.toLowerCase().includes(search) || e.Category.name.toLowerCase().includes(search));
            res.render('./products/categories', { filtrados})
        })
    },

    ayuda: (req, res) => { 
        res.render('./products/ayuda');
    }

}

module.exports=productController;