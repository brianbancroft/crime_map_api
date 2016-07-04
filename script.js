$(function() {

    //counts for various crimes
    var crimeCount = 0;
    var chosenCrimeCount = 0;
    var asbCount = 0; //Antisocial Behaviour
    var burgCount = 0;
    var cdaCount = 0; //(criminal damage arson)
    var drugsCount = 0;
    var theftCount = 0;
    var pdwCount = 0; //Weapons charges
    var robCount = 0;
    var shopliftCount = 0;
    var vehCount = 0; // Vehicle Crimes
    var violentCount = 0;
    var otherCount = 0;

    //   =================== INITIALIZE MAP =========================

    $('#crime-stats-row').hide();



    var mymap = L.map('mapid').setView([52.629729, -1.131592], 9);
    mymap.doubleClickZoom.disable();

    L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 1,
        maxZoom: 16,
        ext: 'png'
    }).addTo(mymap);

    mymap.on('dblclick', onMapClick);

    var crimeMarkers = L.layerGroup([], {}).addTo(mymap);

    // crimeMarkers.eachLayer.marker.on('mouseover', function (e) {
    //     console.log("popup over marker detected")
    // })

    var popup = L.popup();

    function highlightFeature() {
        this.openPopup();
        console.log("open popup called");
    }

    function resetHighlight() {
        this.closePopup();
    }

    function onMapClick(e) {

        var crimeStatusString = "";
        var latitude = e.latlng.lat.toString();
        var longitude = e.latlng.lng.toString();

        // INPUT VARIABLES VIA JQUERY
        choosemonth = $('#choosemonth').val();
        chooseyear = $('#chooseyear').val();
        choosecrime = $('#choosecrime').val();

        // RESET, RE-INITIALIZE
        mymap.removeLayer(crimeMarkers);
        countReset();
        crimeMarkers = L.layerGroup([
            radiusCircle = L.circle([e.latlng.lat, e.latlng.lng], 1600, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.2
            })
        ]).addTo(mymap);
        mymap.setView([latitude, longitude], 13);

        // AJAX TIME
        $.ajax({
            url: 'https://data.police.uk/api/crimes-street/all-crime?lat=' + latitude + '&lng=' + longitude + '&date=' + chooseyear + '-' + choosemonth,
            method: 'get',
            headers: {
                accept: 'application/json'
            }
        }).done(function(res) {
            res.forEach(function(crime) {
                countCalc(crime);
                if (crime.outcome_status !== null) {
                    crimeStatusString = "Crime Outcome: " + crime.outcome_status.category
                } else {
                    crimeStatusString = "";
                }


                if (choosecrime === 'all' || choosecrime === crime.category) {
                    crimeMarkers.addLayer(L.marker([crime.location.latitude, crime.location.longitude]).bindPopup(
                        'Crime Details: ' + crime.location_type + ' ' + crime.location.name + '\n' +
                        'Location: [' + crime.location.latitude + ',' + crime.location.longitude + ']' + crimeStatusString

                    ).on('mouseover', function(e) {
                        this.openPopup();
                    }).on('mouseout', function(e) {
                        this.closePopup();
                    }));

                }
            });

            switch (choosecrime) {
                case 'anti-social-behaviour':
                    chosenCrimeCount = asbCount;
                    break;
                case 'burglary':
                    chosenCrimeCount = burgCount;
                    break;
                case 'criminal-damage-arson':
                    chosenCrimeCount = cdaCount;
                    break;
                case 'drugs':
                    chosenCrimeCount = drugsCount;
                    break;
                case 'other-theft':
                    chosenCrimeCount = theftCount;
                    break;
                case 'public-disorder-weapons':
                    chosenCrimeCount = pdwCount;
                    break;
                case 'robbery':
                    chosenCrimeCount = robCount;
                    break;
                case 'shoplifting':
                    chosenCrimeCount = shopliftCount;
                    break;
                case 'vehicle-crime':
                    chosenCrimeCount = vehCount;
                    break;
                case 'violent-crime':
                    chosenCrimeCount = violentCount;
                    break;
                default:
                    chosenCrimeCount = crimeCount;

            }

            crimeMarkers.addTo(mymap);
            $('#intro-row').hide();
            if (choosecrime === 'all') {
                $('#crime-category-summary').text('Total Crimes:');
            } else {
                $('#crime-category-summary').text('Count of \"' + choosecrime + '\"');
            }
            $('#crime-category-count').text(chosenCrimeCount);
            $('#total-crimes').text('Total in area: ' + crimeCount);
            $('#crime-stats-row').show();
        });
        // END OF AJAX SEQUENCE, AND FUNCTION

    }

    function countReset() {
        crimeCount = 0;
        asbCount = 0; //Antisocial Behaviour
        burgCount = 0;
        cdaCount = 0; // (criminal damage arson)
        drugsCount = 0;
        theftCount = 0;
        pdwCount = 0; //Weapons charges
        robCount = 0;
        shopliftCount = 0;
        vehCount = 0; // Vehicle Crimes
        violentCount = 0;
        otherCount = 0;
    }

    function countCalc(crime) {
        crimeCount += 1;
        switch (crime.category) {
            case 'anti-social-behaviour':
                asbCount += 1;
                break;
            case 'burglary':
                burgCount += 1;
                break;
            case 'criminal-damage-arson':
                cdaCount += 1;
                break;
            case 'drugs':
                drugsCount += 1;
                break;
            case 'other-theft':
                theftCount += 1;
                break;
            case 'public-disorder-weapons':
                pdwCount += 1;
                break;
            case 'robbery':
                robCount += 1;
                break;
            case 'shoplifting':
                shopliftCount += 1;
                break;
            case 'vehicle-crime':
                vehCount += 1;
                break;
            case 'violent-crime':
                violentCount += 1;
                break;
            default:
                otherCount += 1;
        }
    }


});