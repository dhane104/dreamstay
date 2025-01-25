const Listing = require("../models/listing");
module.exports.index = async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});

};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res)=>{
    let{id}=req.params;
    const listing= await Listing.findById(id)
    .populate({
        path: "reviews", 
        populate:{
            path: "author",
        },
    })
    .populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!"); 
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.createNewListing = async(req, res, next)=>{
    let url = req.file.path;
    let filename =  req.file.filename;
    console.log(url, "..", filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing created!");
    res.redirect("/listings");
    
};

module.exports.editListing = async(req,res)=>{
    let{id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!"); 
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
     
};

module.exports.updateListing = async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");
     res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res)=>{
    let{id}=req.params; 
   let deleteListing=await Listing.findByIdAndDelete(id);
   console.log(deleteListing);
   req.flash("success", "Listing deleted sucessfully!");
   res.redirect("/listings");
};