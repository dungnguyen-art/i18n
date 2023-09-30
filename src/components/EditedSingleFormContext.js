import React, { createContext, useContext, useState } from "react";

const EditedSingleFormContext = createContext();

export const EditedSingleFormProvider = ({ children }) => {
  const [editedSingleForm, setEditedSingleForm] = useState({});

  return (
    <EditedSingleFormContext.Provider
      value={{ editedSingleForm, setEditedSingleForm }}
    >
      {children}
    </EditedSingleFormContext.Provider>
  );
};

export const useEditedSingleForm = () => {
  const context = useContext(EditedSingleFormContext);
  if (!context) {
    throw new Error("useEditedSingleForm must be used within an EditedSingleFormProvider");
  }
  return context;
};
