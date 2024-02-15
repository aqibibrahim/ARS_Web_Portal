import React, { useState } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

const GOOGLE_MAPS_APIKEY = "AIzaSyDZiTIdSoTe6XJ7-kiAadVrOteynKR9_38";
const Mapsgoogle = (props) => {
  const { ControlPosition, Geocoder } = props.google.maps;
  const [position, setPosition] = useState({
    lat: 26.9894429391302,
    lng: 17.761961078429668,
  });

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [address, setAddress] = useState("No address available");

  const geocoder = new Geocoder();

  const sendDataToParent = (data) => {
    props.onData(data);
  };

  const handleMarkerDragEnd = (t, map, coord) => {
    const newPosition = {
      lat: coord.latLng.lat(),
      lng: coord.latLng.lng(),
    };

    geocoder.geocode({ location: newPosition }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          setAddress(results[0].formatted_address);
          sendDataToParent({
            latitude: newPosition.lat,
            longitude: newPosition.lng,
            address: results[0].formatted_address,
          });
        } else {
          setAddress("No address available");
        }
      } else {
        setAddress("Geocoding failed due to: " + status);
      }
    });

    setPosition(newPosition);
  };

  const handleMapClick = (mapProps, map, clickEvent) => {
    const newPosition = {
      lat: clickEvent.latLng.lat(),
      lng: clickEvent.latLng.lng(),
    };

    geocoder.geocode({ location: newPosition }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          setAddress(results[0].formatted_address);
          sendDataToParent({
            latitude: newPosition.lat,
            longitude: newPosition.lng,
            address: results[0].formatted_address,
          });
        } else {
          setAddress("No address available");
        }
      } else {
        setAddress("Geocoding failed due to: " + status);
      }
    });

    setPosition(newPosition);
  };
  const handlePlaceChange = () => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 50.064192, lng: -130.605469 },
      zoom: 3,
    });
    const card = document.getElementById("pac-card");
    map.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(card);
    const center = { lat: 50.064192, lng: -130.605469 };
    const defaultBounds = {
      north: center.lat + 0.1,
      south: center.lat - 0.1,
      east: center.lng + 0.1,
      west: center.lng - 0.1,
    };
    const input = document.getElementById("address");
    const options = {
      bounds: defaultBounds,
      componentRestrictions: { country: "lby" },
      fields: [
        "address_components",
        "geometry",
        "icon",
        "name",
        "formatted_address",
      ],

      strictBounds: false,
    };

    const autocomplete = new window.google.maps.places.Autocomplete(
      input,
      options
    );
    autocomplete.setComponentRestrictions({
      country: ["sa"],
      // country: ["us", "pr", "vi", "gu", "mp"],
    });

    const southwest = { lat: 5.610854545454, lng: 136.58932649554995 };
    const northeast = { lat: 61.1792875455454, lng: 2.643255454545 };
    const newBounds = new window.google.maps.LatLngBounds(southwest, northeast);
    autocomplete.setBounds(newBounds);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      let address = "";
      if (place.address_components) {
        address = [
          (place.address_components[0] &&
            place.address_components[0].long_name) ||
            "",
          (place.address_components[1] &&
            place.address_components[1].long_name) ||
            "",
          (place.address_components[2] &&
            place.address_components[2].long_name) ||
            "",
        ].join(" ");
      }

      console.log(place.formatted_address);
      // setLocationAddress(address);
      // setFormattedAddress(place.formatted_address);

      let postalCode = "";
      for (const component of place.address_components) {
        for (const type of component.types) {
          if (type === "postal_code") {
            postalCode = component.short_name;
            break;
          }
        }
        if (postalCode) break;
      }

      // Retrieve the latitude, longitude, and place ID
      const latitude = place.geometry.location.lat();
      const longitude = place.geometry.location.lng();
      const placeId = place.place_id;
      setLongitude(longitude);
      setLatitude(latitude);
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
      // console.log("Place ID:", placeId);
      // console.log("Postal Code:", postalCode);
    });
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      {" "}
      <div id="pac-card" className="flex rounded-md gap-10 justify-center my-4">
        <input
          id="address"
          name="address"
          required
          className="peer block w-[30rem] rounded-md px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
          type="text"
          placeholder="أدخل الموقع"
          onChange={handlePlaceChange}
          // value={locationAddress}
        />
        <button onClick={() => props.modelClose()}>Close Second Moda </button>
      </div>
      <div
        id="map"
        // style={{ height: "0px", width: "0px" }}
      ></div>
      <Map
        google={props.google}
        zoom={10}
        onClick={handleMapClick}
        zoomControlOptions={{
          position: ControlPosition.BOTTOM_LEFT,
        }}
        mapTypeControlOptions={{
          position: ControlPosition.TOP_CENTER,
        }}
        initialCenter={position}
      >
        <Marker
          position={position}
          draggable={true}
          onDragend={handleMarkerDragEnd}
        />
      </Map>
      <div style={{ marginTop: "10px" }}>
        <strong> عنوان : </strong> {address}
      </div>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: GOOGLE_MAPS_APIKEY,
})(Mapsgoogle);
