var app = angular.module('travel', ['ngRoute']);
        
app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'pages/homepage.html',
      controller: 'HomeController'
    })
    .when('/about', {
      templateUrl: 'pages/aboutpage.html',
      controller: 'AboutController'
    })
    .when('/trip', {
      templateUrl: 'pages/trippage.html',
      controller: 'TripController'
    })
    .when('/contact', {
      templateUrl: 'pages/contact.html',
      controller: 'ContactController'
    })
    .when('/tour', {
      templateUrl: 'pages/tourpage.html',
      controller: 'TourController'
    })
    .otherwise({
      redirectTo: '/'
    });
});
app.controller('HomeController', function($scope) {
  let currentSlide = 0;

function showSlide(index) {
  const slides = document.querySelectorAll('.slide');
  if (index >= slides.length) {
    currentSlide = 0;
  } else if (index < 0) {
    currentSlide = slides.length - 1;
  } else {
    currentSlide = index;
  }

  
  slides.forEach((slide) => {
    slide.style.display = 'none';
  });

 
  slides[currentSlide].style.display = 'block';
}

function moveSlide(direction) {
  showSlide(currentSlide + direction);
}


document.addEventListener('DOMContentLoaded', function() {
  showSlide(currentSlide);
});


const menuBar = document.getElementById('menu-bar');
const header = document.querySelector('header');

menuBar.onclick = () => {
    header.classList.toggle('active');
}


const date = new Date()
const span =  document.querySelector('#spanDate');
const actualYear = date.getFullYear();
span.textContent = actualYear

});

app.controller('AboutController', function($scope) {
  let valueDisplays=document.querySelectorAll('.num')
let interval=1000;
valueDisplays.forEach((valueDisplay)=>{
    let startValue=0;
    let endValue= parseInt(valueDisplay.getAttribute("data-val"));
    console.log(endValue);
    let duration=Math.floor(interval/endValue);
    let counter= setInterval(function(){
        startValue+=1;
        valueDisplay.textContent=startValue;
        if(startValue==endValue){
            clearInterval(counter);
        }

    }, duration)
})

const container = document.querySelector('.cards');
const cards = document.querySelectorAll('.card');

let currentIndex = 0;

function scrollCards() {
    currentIndex++;
    if (currentIndex >= cards.length) {
        currentIndex = 0;
    }
    const offset = currentIndex * container.offsetWidth;
    container.style.transform = `translateX(-${offset}px)`;
}

setInterval(scrollCards, 3000);


});
app.controller('ContactController', function($scope, $http) {
  var map = L.map('map');
map.setView([51.505, -0.09], 13)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

navigator.geolocation.watchPosition(success,error);

let marker,circle,zoomed;
function success(pos){

    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const accuracy = pos.coords.accuracy;


    if(marker){
        map.removeLayer(marker)
        map.removeLayer(circle)

    }
     marker= L.marker([lat,lng]).addTo(map);
     circle = L.circle([lat,lng],{ radius: accuracy}).addTo(map);


     if (!zoomed){
       zoomed = map.fitBounds(circle.getBounds());
     }
  
    map.setView([lat,lng])
}

function error(err){
    if (err.code === 1){
        alert("Please allow geolocation access")
    }else{
        alert("Cannot get current location")
    }
}
});

app.controller('TripController', function($scope, $http) {
    $scope.trips = [];
    $scope.sortPrice = '';
    $scope.sortPopularity = '';
    $scope.sortAlphabetical = '';
    $scope.searchQuery = '';
    $scope.selectedContinent = '';
    $scope.activities = ['Family Tour', 'Adventure Tour', 'Luxury Tour', 'Cultural Tour'];
    $scope.transportationItems = ['Car', 'Bus', 'Train', 'Plane'];
    $scope.isActivitiesDropdownVisible = false;
    $scope.isDropdownVisible = {
        transportation: false,
        accommodation: false
    };
    $scope.selectedTrip = null;
    $scope.currentSlide = 0;

    $scope.limit = 6; 
    $scope.showAll = false; 

    // Load trip data from JSON file
    $http.get('../json/trips.json').then(function(response) {
        $scope.trips = response.data;
        $scope.trips.forEach(trip => {
            trip.currentImageIndex = 0;
        });
    });

    app.filter('range', function() {
      return function(input, total) {
          total = parseInt(total);
          for (var i = 0; i < total; i++) {
              input.push(i);
          }
          return input;
      };
  });
    $scope.nextSlide = function() {
        if ($scope.selectedTrip) {
            var totalImages = $scope.selectedTrip.images.length;
            $scope.selectedTrip.currentImageIndex = ($scope.selectedTrip.currentImageIndex + 1) % totalImages;
        }
    };

    // Function to move to the previous image in the carousel
    $scope.prevSlide = function() {
        if ($scope.selectedTrip) {
            var totalImages = $scope.selectedTrip.images.length;
            $scope.selectedTrip.currentImageIndex = ($scope.selectedTrip.currentImageIndex - 1 + totalImages) % totalImages;
        }
    };

    // Toggle the visibility of the dropdowns
    $scope.toggleDropdown = function(type) {
        $scope.isDropdownVisible[type] = !$scope.isDropdownVisible[type];
    };

    // Toggle the visibility of the activities dropdown
    $scope.toggleActivitiesDropdown = function() {
        $scope.isActivitiesDropdownVisible = !$scope.isActivitiesDropdownVisible;
    };

    // Sorting logic
    $scope.sortTrips = function() {
        if ($scope.sortPrice === 'low-to-high') {
            $scope.sortOrder = 'price';  
        } else if ($scope.sortPrice === 'high-to-low') {
            $scope.sortOrder = '-price';  
        }

        if ($scope.sortPopularity === 'most-popular') {
            $scope.sortOrder = '-popularity';  
        } else if ($scope.sortPopularity === 'least-popular') {
            $scope.sortOrder = 'popularity';  
        }

        if ($scope.sortAlphabetical === 'a-to-z') {
            $scope.sortOrder = 'name';  
        } else if ($scope.sortAlphabetical === 'z-to-a') {
            $scope.sortOrder = '-name';  
        }

        // Reset display to show six trips after sorting
        $scope.showAll = false;
        $scope.limit = 6;
    };

    // Filter trips based on continent selection
    $scope.filterByContinent = function() {
        if ($scope.selectedContinent) {
            $scope.searchQuery = $scope.selectedContinent;
        } else {
            $scope.searchQuery = '';
        }

        // Reset display to show six trips after filtering
        $scope.showAll = false;
        $scope.limit = 6;
    };

    // Function to toggle showing all trips
    $scope.toggleShowAll = function() {
        $scope.showAll = !$scope.showAll;
        $scope.limit = $scope.showAll ? $scope.trips.length : 6;
    };

    // Open modal with trip details
    $scope.openModal = function(trip) {
        $scope.selectedTrip = trip;
        $scope.currentSlide = 0;
        document.getElementById('modal').style.display = 'block';
    };

    // Close the modal
    $scope.closeModal = function() {
        document.getElementById('modal').style.display = 'none';
    };

    // Existing countdown and toggleGreeceDetails functions...

// Set the end date we're counting down to (5 days from now for this example)
var countDownDate = new Date().getTime() + (5 * 24 * 60 * 60 * 1000); // 5 days from now

// Update the countdown every 1 second
var countdownFunction = setInterval(function() {
    // Get the current date and time
    var now = new Date().getTime();

    // Find the time remaining
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="countdown"
    document.getElementById("countdown").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

    // If the countdown is over, display a message
    if (distance < 0) {
        clearInterval(countdownFunction);
        document.getElementById("countdown").innerHTML = "EXPIRED";
    }
}, 1000);

});
function toggleGreeceDetails() {
  const details = document.getElementById('greece-details');
  const button = document.querySelector('.greece-toggle-btn');
  if (details.style.display === "none") {
      details.style.display = "block";
      button.textContent = "Hide Details";
  } else {
      details.style.display = "none";
      button.textContent = "Show Details";
  }
}

function toggleitalyDetail() {
  var details = document.getElementById("italy-details");
  if (details.style.display === "none" || details.style.display === "") {
      details.style.display = "block";
  } else {
      details.style.display = "none";
  }
}

app.controller('AboutContler', function($scope) {
  // Controller logic for Home
});
app.controller('TourController', function($scope) {
  const stars = document.querySelectorAll('.star');

stars.forEach((star, index) => {
    star.addEventListener('click', () => {
        let selectedRating = index + 1;

        // Toggle the stars based on the selected rating
        stars.forEach((s, i) => {
            if (i < selectedRating) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    });
});
});

