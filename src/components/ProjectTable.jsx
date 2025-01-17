import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  Box, 
  Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ProjectTable = ({ projects, onDelete, isUpdating, onUpdate }) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 0.5,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontSize: "1rem", fontWeight: "bold", marginTop: "16px" }}
          gutterBottom
        >
          プロジェクト一覧
        </Typography>
        <Button
          variant="contained"
          onClick={onUpdate}
          disabled={isUpdating}
          sx={{
            fontSize: "0.85rem",
            padding: "4px 6px",
            minWidth: "50px",
            backgroundColor: "#333333",
          }}
        >
          {isUpdating ? "更新中..." : "更新"}
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell sx={{ fontSize: "0.8rem", fontWeight: "bold" }}>プロジェクト名</TableCell>
              <TableCell sx={{ fontSize: "0.8rem", fontWeight: "bold" }}>SharePoint URL</TableCell>
              <TableCell sx={{ fontSize: "0.8rem", fontWeight: "bold" }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                  "&:hover": { backgroundColor: "#E0E0E0" },
                }}
              >
                <TableCell sx={{ fontSize: "0.75rem" }}>{project.project_name}</TableCell>
                <TableCell sx={{ fontSize: "0.75rem" }}>
                  <a
                    href={project.spo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "#1a73e8" }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        color: "#333333", // 通常時の色
                        "&:hover": {
                          color: "#1a73e8", // ホバー時の色
                          textDecoration: "underline", // ホバー時の装飾
                        },
                        cursor: "pointer", // ホバー時にカーソルを変更
                      }}
                    >
                      {project.spo_url}
                    </Typography>
                  </a>
                </TableCell>
                <TableCell>
                  <Tooltip title="削除" placement="left">
                    <IconButton 
                      size="small" 
                      color="#333333"
                      onClick={() => onDelete(project.project_name)}
                      sx={{ padding: "2px" }}
                    >
                      <DeleteIcon sx={{ fontSize: "1rem" }} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProjectTable;
