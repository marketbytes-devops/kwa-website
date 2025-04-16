import React, { useState, useEffect, useRef } from "react";
import Form from "../../../components/Form";
import apiClient from "../../../api/apiClient";

const AddValve = () => {
  const initialFields = [
    {
      id: "name",
      type: "text",
      label: "Name",
      value: "",
      placeholder: "Enter valve name",
      warning: "Please enter the valve name.",
      showWarning: true,
    },
    {
      id: "size",
      type: "text",
      label: "Size",
      value: "",
      placeholder: "Enter valve size",
      warning: "Please enter the valve size.",
      showWarning: true,
    },
    {
      id: "full_open_condition",
      type: "number",
      label: "Full Open Condition",
      value: "",
      placeholder: "Enter full open condition",
      warning: "Please enter the full open condition.",
      showWarning: true,
    },
    {
      id: "current_condition",
      type: "number",
      label: "Current Condition",
      value: "",
      placeholder: "Enter current condition",
      warning: "Please enter the current condition.",
      showWarning: true,
    },
    {
      id: "remarks",
      type: "text",
      label: "Remarks",
      value: "",
      placeholder: "Enter any remarks",
      warning: "Please enter any remarks.",
      showWarning: true,
    },
    {
      id: "previous_position",
      type: "text",
      label: "Previous Position",
      value: "",
      placeholder: "Enter previous position",
      warning: "Please enter the previous position.",
      showWarning: true,
    },
    {
      id: "location_type",
      type: "select",
      label: "Add Valve Location",
      value: "",
      options: [
        { label: "Use Current Location", value: "current" },
        { label: "Longitude/Latitude", value: "coordinates" },
      ],
      warning: "Please select the location type.",
      showWarning: true,
    },
    {
      id: "location_link",
      type: "text",
      label: "Location Link",
      value: "",
      placeholder: "Paste Google Maps link here after refining",
      warning: "Please paste a valid Google Maps link",
      showWarning: false,
      hidden: true,
      readOnly: false,
    },
    {
      id: "longitude",
      type: "number",
      label: "Longitude",
      value: "",
      placeholder: "Enter longitude",
      warning: "Please enter longitude",
      showWarning: false,
      hidden: true,
    },
    {
      id: "latitude",
      type: "number",
      label: "Latitude",
      value: "",
      placeholder: "Enter latitude",
      warning: "Please enter latitude",
      showWarning: false,
      hidden: true,
    },
  ];

  const [mainSet, setMainSet] = useState(initialFields);
  const [editMode, setEditMode] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const handleFieldChange = (id, value) => {
    setMainSet((prevFields) => {
      if (id === "location_type") {
        if (value === "current") {
          requestLocationPermission();
          return prevFields.map((field) => {
            if (field.id === "longitude" || field.id === "latitude") {
              return { ...field, hidden: true, value: "" };
            }
            if (field.id === "location_link") {
              return { ...field, hidden: false };
            }
            if (field.id === "location_type") {
              return { ...field, value };
            }
            return field;
          });
        } else if (value === "coordinates") {
          setShowMapModal(false);
          setCurrentPosition(null);
          setLocationError(null);
          return prevFields.map((field) => {
            if (field.id === "longitude" || field.id === "latitude") {
              return { ...field, hidden: false };
            }
            if (field.id === "location_link") {
              return { ...field, hidden: true, value: "" };
            }
            if (field.id === "location_type") {
              return { ...field, value };
            }
            return field;
          });
        }
      } else if (id === "location_link" && value) {
        const coords = extractCoordsFromUrl(value);
        if (coords) {
          setCurrentPosition(coords);
          return prevFields.map((field) => {
            if (field.id === "latitude") return { ...field, value: coords.lat.toString() };
            if (field.id === "longitude") return { ...field, value: coords.lng.toString() };
            if (field.id === "location_link") return { ...field, value };
            return field;
          });
        }
      }
      return prevFields.map((field) =>
        field.id === id ? { ...field, value } : field
      );
    });
  };

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
          setLocationError(null);
          updateLocationLink(latitude, longitude);
          setShowMapModal(true);
          setMainSet((prevFields) =>
            prevFields.map((field) =>
              field.id === "location_type"
                ? { ...field, value: "current" }
                : field
            )
          );
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("Location permission denied. Please allow location access in your browser settings.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location services are unavailable. Please ensure location is enabled on your device.");
              break;
            case error.TIMEOUT:
              setLocationError("Location request timed out. Please try again.");
              break;
            default:
              setLocationError("An error occurred while accessing location.");
          }
          setCurrentPosition(null);
          setShowMapModal(true);
        },
        { timeout: 10000 }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      setShowMapModal(true);
    }
  };

  const updateLocationLink = (lat, lng) => {
    const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
    setMainSet((prevFields) =>
      prevFields.map((field) =>
        field.id === "location_link" ? { ...field, value: mapsLink } : field
      )
    );
  };

  const extractCoordsFromUrl = (url) => {
    const regex = /@?(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match = url.match(regex);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      return { lat, lng };
    }
    return null;
  };

  const focusOnLocation = () => {
    if (currentPosition) {
      const url = `https://www.google.com/maps?q=${currentPosition.lat},${currentPosition.lng}`;
      window.open(url, "_blank");
      alert("Please refine the location in Google Maps and paste the updated URL into the Location Link field.");
    } else {
      requestLocationPermission();
    }
  };

  const copyLocationLink = () => {
    const linkField = mainSet.find((field) => field.id === "location_link");
    if (linkField?.value) {
      navigator.clipboard.writeText(linkField.value);
      alert("Location link copied to clipboard!");
    }
  };

  const MapModal = () => {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-lg font-bold mb-4">Current Location</h2>
          {locationError ? (
            <div className="text-red-500 mb-4">{locationError}</div>
          ) : currentPosition ? (
            <div className="mb-4">
              <p>Latitude: {currentPosition.lat}</p>
              <p>Longitude: {currentPosition.lng}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={focusOnLocation}
                >
                  Focus
                </button>
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded"
                  onClick={copyLocationLink}
                >
                  Copy Link
                </button>
              </div>
            </div>
          ) : (
            <div>Loading location...</div>
          )}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full"
            onClick={() => setShowMapModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-14">
      <Form
        sectionName="Valve Section"
        dataSets={[
          {
            name: "Fields",
            fields: mainSet,
            setFields: setMainSet,
            template: initialFields,
            showEntryButtons: false,
            onFieldChange: handleFieldChange,
          },
        ]}
        editMode={editMode}
        setEditMode={setEditMode}
        apiEndpoint="/valve/valves/"
        identifierField="id"
        showAddItems={false}
        contentDisplay={false}
      />
      {showMapModal && <MapModal />}
    </div>
  );
};

export default AddValve;