const express = require('express');
const router = express.Router();
const {
    addCar,
    getAllCars,
    getCarById,
    updateCar,
    deleteCar
} = require('../controllers/car.controller');
const isAdmin = require('../middlewares/isAdmin');
const verifyToken = require('../middlewares/verifyToken')

/**
 * @swagger
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       required:
 *         - modelo
 *         - año
 *         - precio_diario
 *         - disponible
 *         - brandId
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del auto
 *           example: 1
 *         modelo:
 *           type: string
 *           description: Modelo del auto
 *           example: "Corolla"
 *         año:
 *           type: integer
 *           description: Año de fabricación del auto
 *           example: 2023
 *         color:
 *           type: string
 *           description: Color del auto
 *           example: "Blanco"
 *         precio_diario:
 *           type: number
 *           format: decimal
 *           description: Precio de alquiler por día
 *           example: 50.00
 *         disponible:
 *           type: boolean
 *           description: Si el auto está disponible para alquiler
 *           example: true
 *         brandId:
 *           type: integer
 *           description: ID de la marca del auto
 *           example: 1
 *         Brand:
 *           $ref: '#/components/schemas/Brand'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *           example: "2024-01-15T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *           example: "2024-01-15T10:30:00.000Z"
 *     CarCreate:
 *       type: object
 *       required:
 *         - modelo
 *         - año
 *         - precio_diario
 *         - disponible
 *         - brandId
 *       properties:
 *         modelo:
 *           type: string
 *           description: Modelo del auto
 *           example: "Corolla"
 *         año:
 *           type: integer
 *           minimum: 1900
 *           maximum: 2030
 *           description: Año de fabricación del auto
 *           example: 2023
 *         color:
 *           type: string
 *           description: Color del auto
 *           example: "Blanco"
 *         precio_diario:
 *           type: number
 *           format: decimal
 *           minimum: 0
 *           description: Precio de alquiler por día
 *           example: 50.00
 *         disponible:
 *           type: boolean
 *           description: Si el auto está disponible para alquiler
 *           example: true
 *         brandId:
 *           type: integer
 *           description: ID de la marca del auto
 *           example: 1
 *     CarUpdate:
 *       type: object
 *       properties:
 *         modelo:
 *           type: string
 *           description: Modelo del auto
 *           example: "Corolla Hybrid"
 *         año:
 *           type: integer
 *           minimum: 1900
 *           maximum: 2030
 *           description: Año de fabricación del auto
 *           example: 2024
 *         color:
 *           type: string
 *           description: Color del auto
 *           example: "Azul"
 *         precio_diario:
 *           type: number
 *           format: decimal
 *           minimum: 0
 *           description: Precio de alquiler por día
 *           example: 55.00
 *         disponible:
 *           type: boolean
 *           description: Si el auto está disponible para alquiler
 *           example: false
 *         brandId:
 *           type: integer
 *           description: ID de la marca del auto
 *           example: 1
 */

/**
 * @swagger
 * /car:
 *   post:
 *     summary: Crear nuevo auto (solo administradores)
 *     tags: [Autos]
 *     security:
 *       -  bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarCreate'
 *     responses:
 *       201:
 *         description: Auto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Marca no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/',verifyToken,isAdmin, addCar);

/**
 * @swagger
 * /car:
 *   get:
 *     summary: Obtener todos los autos (usuarios registrados)
 *     tags: [Autos]
 *     security:
 *       -  bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de autos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/',verifyToken, getAllCars);

/**
 * @swagger
 * /car/{id}:
 *   get:
 *     summary: Obtener auto por ID (usuarios registrados)
 *     tags: [Autos]
 *     security:
 *       -  bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del auto
 *         example: 1
 *     responses:
 *       200:
 *         description: Auto encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       404:
 *         description: Auto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', verifyToken, getCarById);

/**
 * @swagger
 * /car/{id}:
 *   put:
 *     summary: Actualizar auto por ID (solo administradores)
 *     tags: [Autos]
 *     security:
 *       -  bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del auto a actualizar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarUpdate'
 *     responses:
 *       200:
 *         description: Auto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Auto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id',verifyToken, isAdmin, updateCar);

/**
 * @swagger
 * /car/{id}:
 *   delete:
 *     summary: Eliminar auto por ID (solo administradores)
 *     tags: [Autos]
 *     security:
 *       -  bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del auto a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Auto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Auto eliminado exitosamente"
 *       404:
 *         description: Auto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', verifyToken, isAdmin, deleteCar);

module.exports = router;
