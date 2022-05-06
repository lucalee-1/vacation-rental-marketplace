const Rental = require("../models/rental");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const rentals = await Rental.find({});
  res.render("rentals/allRentals", { rentals, title: "All Rentals" });
};

module.exports.renderAddNewForm = (req, res) => {
  res.render("rentals/addNew", { title: "New Property" });
};

module.exports.addNewRental = async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({ query: req.body.rental.location, limit: 1 })
    .send();
  const rental = new Rental(req.body.rental);
  rental.geometry = geoData.body.features[0].geometry;
  rental.images = req.files.map((f) => ({ url: f.path, fileName: f.filename }));
  rental.owner = req.user._id;
  await rental.save();
  console.log(rental);
  req.flash("success", "New vacation rental added!");
  res.redirect(`/rentals/${rental._id}`);
};

module.exports.showRentalDetails = async (req, res) => {
  const rental = await Rental.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "owner" } })
    .populate("owner");
  if (!rental) {
    req.flash("error", "Vacation rental not found");
    return res.redirect("/rentals");
  }
  res.render("rentals/details", {
    rental,
    title: `Vacation Rental: ${rental.title}`,
  });
};

module.exports.renderUpdateForm = async (req, res) => {
  const { id } = req.params;
  const rental = await Rental.findById(id);
  if (!rental) {
    req.flash("error", "Vacation rental not found");
    return res.redirect("/rentals");
  }
  res.render("rentals/edit", { rental, title: "Edit Property" });
};

module.exports.updateRental = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const rental = await Rental.findByIdAndUpdate(id, { ...req.body.rental });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  rental.images.push(...imgs);
  rental.save();
  if (req.body.deleteImages) {
    for (let fileName of req.body.deleteImages) {
      await cloudinary.uploader.destroy(fileName);
    }
    await rental.updateOne({
      $pull: { images: { fileName: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Vacation rental updated!");
  res.redirect(`/rentals/${rental._id}`);
};

module.exports.deleteRental = async (req, res) => {
  const { id } = req.params;
  const rental = await Rental.findByIdAndDelete(id);
  req.flash("success", "Vacation rental deleted!");
  res.redirect("/rentals");
};
