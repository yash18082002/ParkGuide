const Park = require('../models/park');
const { cloudinary } = require('../cloudinary/config');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

module.exports.index = async (req, res) => {
    const parks = await Park.find({});
    res.render('parks/index', { parks, page: "all" });
}

module.exports.createPark = async (req, res) => {
    const park = new Park(req.body.park);
    const geoData = await geocoder.forwardGeocode({
        query: park.location,
        limit: 1
    }).send()
    park.geometry = geoData.body.features[0].geometry;
    park.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    park.author = req.user._id;
    await park.save();
    req.flash('success', 'Park added successfully!');
    res.redirect(`/parks/${park._id}`, { page: 0 });
}

module.exports.renderNew = (req, res) => {
    res.render('parks/new', { page: "add" });
}

module.exports.showPark = async (req, res) => {
    const { id } = req.params;
    const park = await Park.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!park) {
        req.flash('error', 'Park not found!');
        return res.redirect('/parks');
    }
    res.render('parks/show', { park, page: 0 });
}

module.exports.editPark = async (req, res) => {
    const { id } = req.params;
    const park = await Park.findByIdAndUpdate(id, { ...req.body.park });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    park.images.push(...imgs);
    if (req.body.deleteImages) {
        for (filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await park.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    await park.save();
    req.flash('success', 'Park edited successfully!');
    res.redirect(`/parks/${park._id}`, { page: 0 });
}

module.exports.renderEdit = async (req, res) => {
    const { id } = req.params;
    const park = await Park.findById(id);
    if (!park) {
        req.flash('error', 'Park not found!');
        return res.redirect('/parks');
    }
    if (!park.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that!');
        return res.redirect(`/parks/${id}`);
    }
    res.render('parks/edit', { park, page: 0 });
}

module.exports.deletePark = async (req, res) => {
    const { id } = req.params;
    await Park.findByIdAndDelete(id);
    req.flash('success', 'Park deleted successfully!');
    res.redirect('/parks');
}