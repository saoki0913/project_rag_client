import React from "react";
import { Alert } from "@mui/material";

const AlertComponent = ({ alert, onClose }) => {
  if (!alert.message) return null;

  return (
    <Alert
      severity={alert.type}
      onClose={onClose}
      sx={{ marginBottom: 2 }}
    >
      {alert.message}
    </Alert>
  );
};

export default AlertComponent;
