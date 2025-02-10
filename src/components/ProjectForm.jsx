"use client";
import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const ProjectForm = ({
  projectName,
  spoUrl,
  setProjectName,
  setSpoUrl,
  isRegistering,
  onRegister,
  includeRootFiles,
  setIncludeRootFiles,
}) => {
  // プロジェクト名のエラー状態を管理
  const [projectNameError, setProjectNameError] = useState("");

  // プロジェクト名に半角英数字のみ許可するバリデーション
  const handleProjectNameChange = (e) => {
    const value = e.target.value;
    // 空の場合も許容するため * を利用
    const pattern = /^[A-Za-z0-9-]*$/;
    if (!pattern.test(value)) {
      setProjectNameError("半角英数字とハイフンのみ使用できます。");
    } else {
      setProjectNameError("");
    }
    // 親から渡された setProjectName を呼び出して状態更新
    setProjectName(value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        width: "200px",
        border: "1px solid #ddd",
        borderRadius: 1.5,
        padding: 2,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontSize: "1rem", fontWeight: "bold" }}
        gutterBottom
      >
        プロジェクト登録
      </Typography>
      <TextField
        label="プロジェクト名"
        value={projectName}
        onChange={handleProjectNameChange}
        error={!!projectNameError}
        helperText={projectNameError}
        sx={{ fontSize: "0.75rem", mt: 1 }}
        InputLabelProps={{ style: { fontSize: "1rem" } }}
      />
      <TextField
        label="SharePoint URL"
        value={spoUrl}
        onChange={(e) => setSpoUrl(e.target.value)}
        sx={{ fontSize: "0.75rem", mt: 1 }}
        InputLabelProps={{ style: { fontSize: "1rem" } }}
      />
      <FormControlLabel
        control={
          <Checkbox
            sx={{
              color: "primary.main",
              "&.Mui-checked": {
                color: "primary.main",
              },
              mt: -1.0,
            }}
            checked={includeRootFiles}
            onChange={(e) => setIncludeRootFiles(e.target.checked)}
          />
        }
        label={
          <Box
            component="span"
            sx={{
              fontSize: "0.9rem",
              lineHeight: 1,
              color: "text.primary",
            }}
          >
            サイト直下のファイルを含める
          </Box>
        }
      />
      <Button
        variant="contained"
        onClick={onRegister}
        disabled={isRegistering}
        sx={{
          fontSize: "0.75rem",
          padding: "6px 12px",
          mt: 1.5,
          backgroundColor: isRegistering ? "#999999" : "#333333",
          color: "#fff",
        }}
        startIcon={
          isRegistering && <CircularProgress size={16} sx={{ color: "#ffffff" }} />
        }
      >
        {isRegistering ? "登録中..." : "登録"}
      </Button>
    </Box>
  );
};

export default ProjectForm;
