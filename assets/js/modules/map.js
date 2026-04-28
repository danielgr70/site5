export function setupMap() {
    const mapElement = document.getElementById("map");
    if (!mapElement || !window.google || !window.google.maps) return;

    const latitude = 34.038405;
    const longitude = -117.946944;
    const markerImage = "assets/img/map-marker.png";
    const mapStyle = [
        { "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] },
        { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] },
        { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] },
        { "featureType": "poi", "elementType": "labels.text", "stylers": [{ "visibility": "off" }] },
        { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] },
        { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] },
        { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
        { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] },
        { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#dbdbdb" }, { "visibility": "on" }] }
    ];

    const mapCenter = new window.google.maps.LatLng(latitude, longitude);
    const map = new window.google.maps.Map(mapElement, {
        zoom: 13,
        center: mapCenter,
        disableDefaultUI: true,
        scrollwheel: false,
        styles: mapStyle
    });

    new window.google.maps.Marker({
        position: new window.google.maps.LatLng(latitude, longitude),
        map: map,
        icon: markerImage,
        draggable: false
    });
}
