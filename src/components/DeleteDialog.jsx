import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const DeleteDialog = ({
  open,
  onClose,
  onConfirm,
  projectName,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          padding: 2,
          backgroundColor: "#fdfdfd",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          textAlign: "center",
          color: "#333",
        }}
      >
        プロジェクト削除確認
      </DialogTitle>
      <DialogContent
        sx={{
          marginTop: 2,
          marginBottom: 2,
        }}
      >
        <DialogContentText
          sx={{
            fontSize: "1rem",
            color: "#555",
            lineHeight: 1.6,
            textAlign: "center",
          }}
        >
          本当に「<b>{projectName}</b>」を削除しますか？<br />
          この操作は取り消せません。
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: "#333",
            borderColor: "#ddd",
            ":hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          キャンセル
        </Button>
        <Button
          onClick={() => onConfirm(projectName)}
          variant="contained"
          sx={{
            backgroundColor: "#d32f2f",
            color: "#fff",
            ":hover": {
              backgroundColor: "#b71c1c",
            },
          }}
        >
          削除
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
