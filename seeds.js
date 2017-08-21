var mongoose = require("mongoose");
var HuntingGround = require("./models/huntingGround");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Jeffreys Bay, South Africa", 
        image: "http://travel.home.sndimg.com/content/dam/images/travel/fullrights/2016/08/5/0/CI_Calvert_County_Dept_Economic_Development-Sharks-Tooth-Calvert-Cliffs-Beach.jpg.rend.hgtvcom.616.462.suffix/1491593549472.jpeg",
        description: "Jeffreys Bay (Afrikaans: Jeffreysbaai, also known as J-bay) is a town located in the Eastern Cape province of South Africa. The town is situated just off the N2 Highway, about 75 km southwest of Port Elizabeth."
    },
    {
        name: "Causeway Beaches", 
        image: "https://sanibel-captiva.org/wp-content/uploads/2016/12/Sanibel-Island-Captiva-Island-Causeway-Beach.jpg",
        description: "Great for swimming, fishing, windsurfing and picnicking. Pull your vehicle right to waters edge. There is no fee when you park on the causeway beach. Located along both sides of the road. Restrooms are available."
    },
    {
        name: "Lighthouse Beach & Fishing Pier", 
        image: "https://sanibel-captiva.org/wp-content/uploads/2016/12/Sanibel-Island-Captiva-Island-Lighthouse-Beach.jpg",
        description: "This is the site of our historic functioning lighthouse. Located on the eastern tip of Sanibel, wrapping around to the bay side. This is where the t-dock-fishing pier is and a boardwalk nature trail winding through native wetlands. Turn left on Periwinkle Way from Causeway Road."
    }
]

function seedDB(){
   //Remove all campgrounds
   HuntingGround.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed hunting grounds!");
         //add a few campgrounds
        data.forEach(function(seed){
            HuntingGround.create(seed, function(err, huntingGround){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a hunting ground!");
                    //create a comment
                    Comment.create(
                        {
                            text: "I'm  fanatical about shelling and I'm an obsessed artist.",
                            author: "Pam Rambo"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                huntingGround.comments.push(comment);
                                huntingGround.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;