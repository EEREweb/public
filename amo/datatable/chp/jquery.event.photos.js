/**
 *  Time lapse
 *  rotate in a new time lapse image every 
 *  /2017/photos-time-lapse.html 
 */
$(document).ready(function() {
    if ($('.time-lapse-photo')) {
        setInterval(function() {

            var ts = new Date().getTime();
						//camera1
            $('.time-lapse-photo').attr('src', 'https://oxblue.com/archive/9ba23a7d708a134876f47699730b9f37/2048x1536.jpg?ts=' + ts);
						//cameras on timelapse page
					  $('.time-lapse-oxblue1').attr('src', 'https://oxblue.com/open/sd2017/camera1?ts=' + ts);
					  $('.time-lapse-oxblue2').attr('src', 'https://oxblue.com/open/sd2017/camera2?ts=' + ts);
					
        }, 600000);
    }
})


$(document).ready(function() {
	// grab all galleries from page and iterate
	$( ".flickr-gallery" ).each(function( index ) {
  
    /*
     * Configure this to match your DOM and your Flickr info
     */
    var config = {
        domTarget: this,
        nsid: '38890715@N08' // flickr ID
            ,
        waitElement: '.loading-msg',
        itemTemplate: '' +
            '<div class="media-block">' +
            '    <div class="row">' +
            '        <div class="col-sm-4">' +
            '           <img src="{{image_b}}" alt=""  class="img-responsive">' +
            '        </div>' +
            '        <div class="col-sm-8">' +
            '            <p>{{description}}</p>' +
            '            <p><a href="{{image_m}}" target="_blank">Download photo</a></p>' +
            '        </div>' +
            '    </div>' +
            '</div>'
    }

    var $target = $(config.domTarget)
    var flickerSet = $target.data('set') // grab the set from the data attribute

    $target.jflickrfeed({
            qstrings: {
                cleanDescription: false,
                nsid: config.nsid,
                set: flickerSet,
                format: 'json',
                jsoncallback: '?'
            },
            feedapi: 'photoset.gne',
            useTemplate: true,
            itemTemplate: config.itemTemplate,
            itemCallback: function(item) {
                /* 
                 * Flickr requires you to make a call to their API to get the secret key for the original image.
                 * URLs have a structure like this:
                 * http://farm{farm-id}.staticflickr.com/{server-id}/{id}_{o-secret}_o.(jpg|gif|png)    
                 * We need the o-secret and the original file format (eg jpg)
                 *
                 * More background info here: http://www.flickr.com/services/api/misc.urls.html
                 */

                // parse out the photo's id and secret key so we can build the URL to call the flickr API
                var photo_id = item.image.match(/(\/)([\d\w\s]*)(_)/)[2]
                var secret = item.image.match(/(_)([\d\w\s]*)(\.)/)[2]

                // Grab the anchor link, that we'll need to update after another call to Flickr
                var $dllink = $(this).find('a[href="' + item.image_m + '"]')

                var secretAPI = 'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=c0f476c651274617d714f93fa5759288&photo_id=' + photo_id + '&secret=' + secret + '&format=json&jsoncallback=?'

                var deferred = $.ajax({
                    url: secretAPI,
                    dataType: 'jsonp'
                })

                /*
                 * Success callback for retrieving the secret key for the original image
                 */
                deferred.done(function(response) {

                    var original = {
                        secret: response.photo.originalsecret,
                        ext: response.photo.originalformat
                    }

                    // build the proper original image URL
                    var oUrl = item.image_m.replace(/(_)([\d\w\s]*)(\.)/, "$1" + original.secret + "_o" + "$3").replace(/jpg|gif|png/, original.ext)

                    

                    // update the URL in our itemTemplate to have the oURL
                    //$dllink.attr('href', oUrl.replace(/http/i,'https'))
					$dllink.attr('href', oUrl)

                })
            }
        },
        function() {
            $(config.waitElement).fadeOut('slow', function() {
                $(this).remove()
            })
        }
    )
})
	
});