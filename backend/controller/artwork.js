const path = require('path');
const sequelize = require('../database/connection');
const fs = require('fs')
const cloudinary = require('../cloudinary/connection')
const { Op } = require('sequelize');
const { User, Artwork } = require('../models');

const RequestHandler = require("../utils/RequestHandler");
const requestHandler = new RequestHandler();

exports.search = async (req, res) => {
    const { query, minPrice, maxPrice, artist, status } = req.query;
    const whereConditions = {};
    const includeOptions = [];

    if (query) {
        whereConditions[Op.or] = [
            sequelize.where(sequelize.fn('LOWER', sequelize.col('Artwork.title')), 'LIKE', `%${query.toLowerCase()}%`),
            sequelize.where(sequelize.fn('LOWER', sequelize.col('Artwork.description')), 'LIKE', `%${query.toLowerCase()}%`)
        ];
    }

    if (minPrice) {
        whereConditions.price = { ...whereConditions.price, [Op.gte]: minPrice };
    }
    if (maxPrice) {
        whereConditions.price = { ...whereConditions.price, [Op.lte]: maxPrice };
    }
    if (artist) {
        includeOptions.push({
            model: User,
            as: 'artist',
            where: sequelize.where(sequelize.fn('LOWER', sequelize.col('artist.username')), 'LIKE', `%${artist.toLowerCase()}%`)
        });
    }
    if (status) {
        whereConditions.status = status;
    }

    try {
        const artworks = await Artwork.findAll({
            where: whereConditions,
            include: includeOptions
        });
        return requestHandler.sendSuccess(
            res,
            `Search result fetched`,
            200
        )(artworks);
    } catch (error) {
        return requestHandler.sendUnhandledError(req, res, error);
    }
};

exports.uploadArtwork = async (req, res) => {
    const { title, description, price } = req.body;
    console.log('cloudinary = ', cloudinary.upload)
    try {
        const filePath = req.file.path;
        const cloudinaryPulicId = path.parse(req.file.originalname).name

        // Upload the file to Cloudinary
        const image = await cloudinary.uploader.upload(filePath, {
            public_id: cloudinaryPulicId, // Use the original file name as public_id
        });

        // Remove the file from the server after upload
        fs.unlinkSync(filePath);

        const imageAutoCropUrl = cloudinary.url(cloudinaryPulicId, {
            crop: 'auto',
            gravity: 'auto',
            width: 500,
            height: 500,
        });


        const artwork = await Artwork.create({
            title,
            description,
            price,
            image_url: imageAutoCropUrl,
            artist_id: req.user.userId
        });
        return requestHandler.sendSuccess(
            res,
            `Artwork uploaded successfully`,
            201
        )(artwork.id);
    } catch (error) {
        return requestHandler.sendUnhandledError(req, res, error);
    }
};

exports.updateArtwork = async (req, res) => {
    const { id } = req.params;
    const { title, description, price } = req.body;

    try {
        const filePath = req.file.path;
        const cloudinaryPulicId = path.parse(req.file.originalname).name

        // Upload the file to Cloudinary
        const image = await cloudinary.uploader.upload(filePath, {
            public_id: cloudinaryPulicId, // Use the original file name as public_id
        });

        // Remove the file from the server after upload
        fs.unlinkSync(filePath);

        const imageAutoCropUrl = cloudinary.url(cloudinaryPulicId, {
            crop: 'auto',
            gravity: 'auto',
            width: 500,
            height: 500,
        });

        const artwork = await Artwork.findOne({ where: { id, artist_id: req.user.userId } });

        if (!artwork) {
            return requestHandler.sendError(
                res,
                "Artwork not found or unauthorized",
                404
              )();
        }

        if (title) artwork.title = title;
        if (description) artwork.description = description;
        if (price) artwork.price = price;
        if (imageAutoCropUrl) artwork.image_url = imageAutoCropUrl;

        await artwork.save();
        return requestHandler.sendSuccess(
            res,
            `Artwork updated successfully`,
            200
        )(artwork.id);
    } catch (error) {
        return requestHandler.sendUnhandledError(req, res, error);
    }
}

exports.getArtworkDetailsById = async (req, res) => {
    const { artworkId } = req.params;
    try {
        const artworks = await Artwork.findOne({
            where: { id: artworkId }
        });
        return requestHandler.sendSuccess(
            res,
            `Artwork details fetched`,
            200
        )(artworks);
    } catch (error) {
        return requestHandler.sendUnhandledError(req, res, error);
    }
}

exports.marksArtworkAsSold = async (req, res) => {
    const { artworkId } = req.params;
    try {
        const [updatedRows] = await Artwork.update(
            { status: 'sold' },
            { where: { id: artworkId, artist_id: req.user.userId } }
        );

        if (updatedRows === 0) {
            return requestHandler.sendError(
                res,
                "Artwork not found or unauthorized",
                404
              )();
        }

        return requestHandler.sendSuccess(
            res,
            `Artwork marked as sold`,
            200
        )(artwork);

    } catch (error) {
        return requestHandler.sendUnhandledError(req, res, error);
    }
}