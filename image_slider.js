if (Meteor.isServer)
  return
galleryImages = new Mongo.Collection(null, {
  transform: function(doc) {
    return _.extend(doc, {
      getNext: function() {
        return galleryImages.findOne(doc.next)
      }
    })
  }
});
_.forEach([{
    _id: "1",
    src: "https://static.pexels.com/photos/909/flowers-garden-colorful-colourful.jpg",
    next: "2"
  }, {
    _id: "2",
    src: "http://weknowyourdreams.com/images/flowers/flowers-02.jpg",
    next: "3"
  }, {
    _id: "3",
    src: "http://weknowyourdreams.com/images/flowers/flowers-03.jpg",
    next: "4"
  }, {
    _id: "4",
    src: "http://weknowyourdreams.com/images/flowers/flowers-04.jpg",
    next: "5"
  }, {
    _id: "5",
    src: "http://weknowyourdreams.com/images/flowers/flowers-05.jpg",
    next: "1"
  }],
  function(i) {
    galleryImages.insert(i);
  });

Template.ImageGallery.onCreated(function() {
  this.viewingImage = new ReactiveVar("1");
})
Template.ImageGallery.events({
  'click .click-to-see-next-image': function(event, template) {
    var viewingImage = galleryImages.findOne(template.viewingImage.get())
    if (viewingImage)
      template.viewingImage.set(viewingImage.getNext()._id)
  }
})
Template.ImageGallery.helpers({
  currentImage: function() {
    return galleryImages.findOne(Template.instance().viewingImage.get())
  }
})

Template.ImageGallery.onRendered(function() {

  var self = this;

  var loadImage = function(image_id) {
    var image = galleryImages.findOne(image_id);
    if (!image.loaded) {
      var imageObj = new Image();
      imageObj.addEventListener('load', function() {
        galleryImages.update(image._id, {
          $set: {
            loaded: true
          }
        })
      })
      imageObj.src = image.src
    }
  }

  self.autorun(function() {
    var viewingImage = self.viewingImage.get()
    Tracker.nonreactive(function() {
      loadImage(viewingImage)
    })
  })
})
