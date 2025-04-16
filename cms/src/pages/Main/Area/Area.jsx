import React, { useState } from "react";
import Form from "../../../components/Form";

const Area = () => {
  const initialFields = [
    {
      id: "area_name",
      type: "text",
      label: "Add your area",
      value: "",
      warning: "Please enter the area.",
      showWarning: false,
    },
  ];

  const [mainSet, setMainSet] = useState(initialFields);
  const [editMode, setEditMode] = useState(false);

  return (
      <div className="pt-14">
        <Form
          sectionName="Add the Area"
          dataSets={[
            {
              name: "Fields",
              fields: mainSet,
              setFields: setMainSet,
              template: initialFields,
              showEntryButtons: false,
            },
          ]}
          editMode={editMode}
          setEditMode={setEditMode}
          apiEndpoint="/area/add-area/"
          identifierField="id"
          showAddItems={true}
          contentDisplay={false}
          updatedContentTitle="Updated area:"
        />
      </div>
  );
};

export default Area;
