var cnt = 0;
function request(params) {
  console.log(params);
  $.ajax({
  // The URL for the request
    url: params.url,
    // The data to send (will be converted to a query string)
    data: params.data,
    // Whether this is a POST or GET request
    type: params.request,
    // The type of data we expect back
    dataType : "json",
  })
  // Code to run if the request succeeds (is done);
  // The response is passed to the function
  .done(function( json ) {
    // Reset the form
    console.log('json = ', json);
    if(cnt === 0){
      cnt++;
      ai($('#ask').val());
    }
    $('#ask').prop('selectedIndex', 0);
    $('#custom').val('');
    $('#response').append(json.msg);
  })
  // Code to run if the request fails; the raw request and
  // status codes are passed to the function
  .fail(function( xhr, status, errorThrown ) {
    console.log( "Sorry, there was a problem!" );
    console.log( "Error: " + errorThrown );
    console.log( "Status: " + status );
    console.dir( xhr );
  })
  // Code to run regardless of success or failure;
  .always(function( xhr, status ) {

  });

};

var coords = '';



function eventListeners() {
  var timer;

  $('#ask').change(function () {
    request({
      url: '/help/ask',
      data: { 'msg' : this.value, 'location': coords },
      request: 'post'
    });
    addMarker();
  });
  $('#custom').keyup(function () {
    var that = this;
    clearTimeout(timer);
    timer = setTimeout(function () {
      request({
        url: '/help/ask',
        data: { 'msg' : that.value, 'location': coords },
        request: 'post'
      });
    }, 500);
  });



}
function addMarker(){
  var marker = new google.maps.Marker({
          position: myLatlng,
          map: map
        });
}
function initMap(){
  myLatlng = new google.maps.LatLng(coords.latitude, coords.longitude);
  var mapOptions = {
    zoom: 8,
    center: myLatlng,
    mapTypeId: 'satellite'
  };

  map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

function ai(val){
  request({
    url: '/help/ask/ai',
    data: { 'msg' : val },
    request: 'post'
  });
}

const init = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(cb);
  }
  function cb(position) {
    coords = position.coords;
  }
  setTimeout(function(){
    eventListeners();
    initMap();
  },500);
};

$(document).ready(function () {
  init();
});
