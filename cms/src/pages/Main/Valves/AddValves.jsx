import React, { useState } from "react";
import Form from "../../../components/Form";

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
      warning: "Please enter a number for full open condition.",
      showWarning: true,
      step: "0.1",
      min: "0",
      max: "1000",
    },
    {
      id: "current_condition",
      type: "number",
      label: "Current Condition",
      value: "",
      placeholder: "Enter current condition",
      warning: "Please enter a number for current condition.",
      showWarning: true,
      step: "0.1",
      min: "0",
      max: "",
    },
    {
      id: "mid_point",
      type: "number",
      label: "Mid Point",
      value: "0.5", // Default value, editable by user
      placeholder: "Enter mid point",
      warning: "Please enter a number between 0 and 1 for mid point.",
      showWarning: true,
      step: "0.01",
      min: "0",
      max: "1",
    },
    {
      id: "steepness",
      type: "number",
      label: "Steepness",
      value: "12.5", // Default value, editable by user
      placeholder: "Enter steepness",
      warning: "Please enter a number between 0 and 100 for steepness.",
      showWarning: true,
      step: "0.1",
      min: "0",
      max: "100",
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
      id: "latitude",
      type: "number",
      label: "Latitude",
      value: "",
      placeholder: "Enter latitude",
      warning: "Please enter latitude",
      showWarning: false,
      hidden: false,
      step: "0.000001",
    },
    {
      id: "longitude",
      type: "number",
      label: "Longitude",
      value: "",
      placeholder: "Enter longitude",
      warning: "Please enter longitude",
      showWarning: false,
      hidden: false,
      step: "0.000001",
    },
    {
      id: "previous_position",
      type: "hidden",
      value: "",
    },
  ];

  const [mainSet, setMainSet] = useState(initialFields);
  const [editMode, setEditMode] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleFieldChange = (id, value) => {
    setMainSet((prevFields) => {
      let updatedFields = prevFields.map((field) =>
        field.id === id ? { ...field, value } : field
      );

      if (id === "location_link" && value) {
        const coords = extractCoordsFromUrl(value);
        if (coords) {
          setCurrentPosition(coords);
          updatedFields = updatedFields.map((field) => {
            if (field.id === "latitude") return { ...field, value: coords.lat.toString() };
            if (field.id === "longitude") return { ...field, value: coords.lng.toString() };
            if (field.id === "location_link") return { ...field, value };
            return field;
          });
        }
      }

      // Update max for current_condition
      const fullOpen = updatedFields.find((f) => f.id === "full_open_condition").value;
      updatedFields = updatedFields.map((field) =>
        field.id === "current_condition" ? { ...field, max: fullOpen || "1000" } : field
      );

      // Validate current_condition
      const current = updatedFields.find((f) => f.id === "current_condition").value;
      if (fullOpen && current && parseFloat(current) > parseFloat(fullOpen)) {
        setValidationError("Current condition must be less than or equal to full open condition.");
      } else {
        setValidationError("");
      }

      return updatedFields;
    });
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

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
          setLocationError(null);
          updateLocationFields(latitude, longitude);
          setShowMapModal(true);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("Location permission denied.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location unavailable.");
              break;
            case error.TIMEOUT:
              setLocationError("Location request timed out.");
              break;
            default:
              setLocationError("Error accessing location.");
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

  const updateLocationFields = (lat, lng) => {
    const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
    setMainSet((prevFields) =>
      prevFields.map((field) => {
        if (field.id === "latitude") return { ...field, value: lat.toString() };
        if (field.id === "longitude") return { ...field, value: lng.toString() };
        if (field.id === "location_link") return { ...field, value: mapsLink };
        return field;
      })
    );
  };

  const copyLocationLink = () => {
    const linkField = mainSet.find((field) => field.id === "location_link");
    if (linkField?.value) {
      navigator.clipboard.writeText(linkField.value);
      alert("Location link copied to clipboard!");
    }
  };

  const focusOnLocation = () => {
    if (currentPosition) {
      const url = `https://www.google.com/maps?q=${currentPosition.lat},${currentPosition.lng}`;
      window.open(url, "_blank");
      alert("Refine location in Google Maps and paste the updated URL.");
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
      {validationError && (
        <div className="text-red-500 text-sm mb-4">{validationError}</div>
      )}
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