import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FieldRenderer = ({ field, setFields, onChange, isSubmitted }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleFieldChange = (id, value) => {
    if (onChange) {
      onChange(id, value);
    } else {
      setFields((fields) =>
        fields.map((f) => (f.id === id ? { ...f, value } : f))
      );
    }
  };

  const handleFileChange = (id, file) => {
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File size should not exceed 5MB.");
        return;
      }
      handleFieldChange(id, file);
    }
  };

  const displayWarning =
    isSubmitted && field.showWarning && field.warning && !field.value;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (value) => {
    handleFieldChange(field.id, value);
    setIsDropdownOpen(false);
  };

  switch (field.type) {
    case "image":
      return (
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-800 mb-2">
            {field.label}
          </label>
          {field.value && typeof field.value === "string" && (
            <p className="text-xs text-gray-600">
              Current file: {field.value.split("/").pop()}
            </p>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(field.id, e.target.files[0])}
            className="w-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all duration-200 bg-gray-100 hover:bg-gray-50 file:bg-blue-200 file:text-blue-800 file:border-0 file:px-4 file:py-1 file:text-xs file:cursor-pointer"
          />
          {(field.error || displayWarning) && (
            <p className="text-xs text-red-500 mt-1">
              {field.error || field.warning}
            </p>
          )}
        </div>
      );
    case "text":
      return (
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-800 mb-2">
            {field.label}
          </label>
          <input
            type="text"
            value={field.value || ""}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 text-gray-800 text-sm placeholder:italic placeholder:text-gray-800 placeholder:font-normal focus:outline-none transition-all duration-200 bg-gray-100 hover:bg-gray-50"
            placeholder={`Write your ${field.label.toLowerCase()} here...`}
          />
          {(field.error || displayWarning) && (
            <p className="text-xs text-red-500 mt-1">
              {field.error || field.warning}
            </p>
          )}
        </div>
      );
    case "number":
      return (
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-800 mb-2">
            {field.label}
          </label>
          <input
            type="number"
            value={field.value || ""}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 text-gray-800 text-sm italic placeholder:text-gray-800 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all duration-200 bg-gray-100 hover:bg-gray-50"
            placeholder={`Write your ${field.label.toLowerCase()} here...`}
          />
          {(field.error || displayWarning) && (
            <p className="text-xs text-red-500 mt-1">
              {field.error || field.warning}
            </p>
          )}
        </div>
      );
    case "date":
      return (
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-800 mb-2">
            {field.label}
          </label>
          <input
            type="date"
            value={field.value || ""}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 text-gray-800 text-sm placeholder:italic placeholder:text-gray-800 placeholder:font-normal focus:outline-none transition-all duration-200 bg-gray-100 hover:bg-gray-50"
          />
          {(field.error || displayWarning) && (
            <p className="text-xs text-red-500 mt-1">
              {field.error || field.warning}
            </p>
          )}
        </div>
      );

    case "url":
      return (
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-800 mb-2">
            {field.label}
          </label>
          <input
            type="text"
            value={field.value || ""}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 text-gray-800 text-sm italic placeholder:text-gray-800 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all duration-200 bg-gray-100 hover:bg-gray-50"
            placeholder={`Write your ${field.label.toLowerCase()} here...`}
          />
          {(field.error || displayWarning) && (
            <p className="text-xs text-red-500 mt-1">
              {field.error || field.warning}
            </p>
          )}
        </div>
      );
    case "checkbox":
      return (
        <div className="flex items-center space-x-4">
          <label className="text-xs text-gray-800">{field.label}</label>
          <input
            type="checkbox"
            checked={field.value || false}
            onChange={(e) => handleFieldChange(field.id, e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-200 rounded focus:ring-blue-200 focus:ring-2 transition-all duration-200 bg-gray-100"
          />
          {(field.error || displayWarning) && (
            <p className="text-xs text-red-500 mt-1">
              {field.error || field.warning}
            </p>
          )}
        </div>
      );
    case "radio":
      return (
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-800 mb-2">
            {field.label}
          </label>
          <input
            type="radio"
            name={field.id}
            checked={field.value || false}
            onChange={(e) => handleFieldChange(field.id, e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-200 rounded focus:ring-blue-200 focus:ring-2 transition-all duration-200 bg-gray-100"
          />
          {(field.error || displayWarning) && (
            <p className="text-xs text-red-500 mt-1">
              {field.error || field.warning}
            </p>
          )}
        </div>
      );
    case "select":
      return (
        <div className="space-y-2 relative">
          <label className="block text-xs font-bold text-gray-800 mb-2">
            {field.label}
          </label>
          <div
            className="w-full px-3 py-2 border border-gray-300 text-gray-800 text-sm italic placeholder:text-gray-800 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all duration-200 bg-gray-100 hover:bg-gray-50 cursor-pointer"
            onClick={toggleDropdown}
          >
            {field.value
              ? field.options.find((option) => option.value === field.value)
                  .label
              : `Select ${field.label.toLowerCase()}`}
          </div>
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg overflow-hidden"
              >
                {field.options.map((option) => (
                  <motion.li
                    key={option.value}
                    className="px-3 py-2 text-sm font-normal hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleOptionClick(option.value)}
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                  >
                    {option.label}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
          {(field.error || displayWarning) && (
            <p className="text-xs text-red-500 mt-1">
              {field.error || field.warning}
            </p>
          )}
        </div>
      );
    default:
      console.warn(`Unsupported field type: ${field.type}`);
      return null;
  }
};

export default FieldRenderer;
