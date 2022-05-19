const Rental = require("../models/rental");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

// To do:
// Add image validation,
// Add location validation
// Add autocomplete location when adding new


module.exports.browse = async (req, res) => {
  const rentals = await Rental.find({});
  res.render("rentals/browse", { rentals, title: "Vacation Place: Browse" });
};

module.exports.renderAddNewForm = (req, res) => {
  res.render("rentals/addNew", { title: "Vacation Place: New Property" });
};

module.exports.addNewRental = async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({ query: req.body.rental.location, limit: 1 })
    .send();
  const rental = new Rental(req.body.rental);
  rental.geometry = geoData.body.features[0].geometry;
  if (typeof req.files !== "undefined" && req.files.length > 0) {
    rental.images = req.files.map((f) => ({
      url: f.path,
      fileName: f.filename,
    }));
  } else {
    rental.images = [
      {
        url: "https://res.cloudinary.com/aefpxxc8p/image/upload/v1652430160/vacantion-rental/f2tyqfurlfxqdmimf3jo.jpg",
        fileName: "vacantion-rental/f2tyqfurlfxqdmimf3jo",
      },
    ];
  }
  rental.owner = req.user._id;
  await rental.save();
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
    title: `Vacation Place: ${rental.title}`,
  });
};

module.exports.renderUpdateForm = async (req, res) => {
  const { id } = req.params;
  const rental = await Rental.findById(id);
  if (!rental) {
    req.flash("error", "Vacation rental not found");
    return res.redirect("/rentals");
  }
  res.render("rentals/edit", { rental, title: "Vacation Place: Edit Property" });
};

module.exports.updateRental = async (req, res) => {
  const { id } = req.params;
  const rental = await Rental.findByIdAndUpdate(id, { ...req.body.rental });
  const imgs = req.files.map((f) => ({ url: f.path, fileName: f.filename }));
  rental.images.push(...imgs);
  const geoData = await geocoder
    .forwardGeocode({ query: req.body.rental.location, limit: 1 })
    .send();
  rental.geometry = geoData.body.features[0].geometry;
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
