import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import IconButton from "@mui/icons-material/Delete";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteDialog from "../components/DeleteDialog"; // ダイアログをインポート


// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import Tooltip from "@mui/material/Tooltip";

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [spoUrl, setSpoUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" }); // Alertの状態管理
  const [openDialog, setOpenDialog] = useState(false); // ダイアログの状態管理
  const [selectedProject, setSelectedProject] = useState(null); // 削除対象プロジェクト

  const navigate = useNavigate();

  const fetchProjects = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch("http://localhost:7071/projects");
      const data = await response.json();
      setProjects(
        Array.isArray(data.projects) ? data.projects.filter((p) => p && p.project_name) : []
      );
    } catch (error) {
      setAlert({ type: "error", message: "プロジェクト一覧の取得に失敗しました。" });
    } finally {
      setLoading(false);
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openDeleteDialog = (projectName) => {
    setSelectedProject(projectName);
    setOpenDialog(true);
  };

  const closeDeleteDialog = () => {
    setOpenDialog(false);
    setSelectedProject(null);
  };


  const handleDeleteProject = async (projectName) => {
    if (!selectedProject) return;

    try {
      // 削除リクエストを送信
      const response = await fetch("http://localhost:7071/delete_project", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_name: projectName }),
      });
  
      if (response.ok) {
        // 削除成功時
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.project_name !== projectName)
        );
        setAlert({ type: "success", message: `プロジェクト「${projectName}」を削除しました。` });
      } else {
        // サーバーからエラーレスポンスを受け取った場合
        const errorData = await response.json();
        setAlert({ type: "error", message: `削除失敗: ${errorData.message || "不明なエラーが発生しました。"}` });
      }
    } catch (error) {
      // リクエストが失敗した場合
      setAlert({ type: "error", message: "プロジェクト削除中にエラーが発生しました。" });
    } finally {
      closeDeleteDialog();
    }
  };
  


  const handleRegisterProject = async () => {
    if (!projectName || !spoUrl) {
      setAlert({ type: "error", message: "プロジェクト名とSharePoint URLを入力してください。" });
      return;
    }

    setIsRegistering(true);
    try {
      const response = await fetch("http://localhost:7071/resist_project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_name: projectName, spo_url: spoUrl }),
      });
      const data = await response.json();
      // プロジェクトリストに追加
      setProjects((prevProjects) => [
        ...prevProjects,
        { project_name: projectName, spo_url: data.spo_url },
      ]);
      
      // 成功メッセージを表示
      setAlert({ type: "success", message: "プロジェクトの登録に成功しました。" });

      // プロジェクトの一覧を再取得
      await fetchProjects();

      // フォームをリセット
      setProjectName("");
      setSpoUrl("");

    } catch (error) {
      console.error("エラー: プロジェクト登録に失敗しました。", error);
      alert("プロジェクト登録中にエラーが発生しました。");
    } finally {
      setIsRegistering(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <SideBar
        chatHistory={[]}
        onSelectChat={() => {}}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onHomeClick={handleHomeClick}
      />

      <Box
        sx={{
          flexGrow: 1,
          marginLeft: isSidebarOpen ? 0 : "50px",
          transition: "margin-left 0.3s",
          display: "flex",
          flexDirection: "column",
          padding: "8px",
        }}
      >
        {/* Alert表示エリア */}
        {alert.message && (
          <Alert
            severity={alert.type}
            onClose={() => setAlert({ type: "", message: "" })}
            sx={{ marginBottom: 2 }}
          >
            {alert.message}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5, // 全体の間隔を少し広げる
              width: "200px",
              border: "1px solid #ddd",
              borderRadius: 1.5,
              padding: 2, // 内側の余白を調整
              backgroundColor: "#f9f9f9",
            }}
          >
            <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: "bold" }} gutterBottom>
              プロジェクト登録
            </Typography>
            <TextField
              label="プロジェクト名"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              // size="small"
              sx={{ fontSize: "0.75rem", mt: 1 }} // 各入力エリアの上部余白を調整
              InputLabelProps={{ style: { fontSize: "1rem" } }}
            />
            <TextField
              label="SharePoint URL"
              value={spoUrl}
              onChange={(e) => setSpoUrl(e.target.value)}
              // size="small"
              sx={{ fontSize: "0.75rem", mt: 1 }} // 前の入力エリアとの距離を設定
              InputLabelProps={{ style: { fontSize: "1rem" } }}
            />
            <Button
              variant="contained"
              onClick={handleRegisterProject}
              disabled={isRegistering}
              sx={{
                fontSize: "0.75rem",
                padding: "6px 12px", // ボタン内の余白を調整
                mt: 1.5, // ボタンと入力エリアの間隔を広げる
                backgroundColor: isRegistering ? "#999999" : "#333333",
                color: "#fff",
              }}
              startIcon={
                isRegistering && (
                  <CircularProgress
                    size={16}
                    sx={{ color: "#ffffff" }} // ボタン内のスピナーの色を設定
                  />
                )
              }
            >
              {isRegistering ? "登録中..." : "登録"}
            </Button>
          </Box>

          <Box sx={{ flexGrow: 1 }}>
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
                sx={{ fontSize: "0.9rem", fontWeight: "bold", marginTop: "8px" }}
                gutterBottom
              >
                プロジェクト一覧
              </Typography>
              <Button
                variant="contained"
                onClick={fetchProjects}
                disabled={isUpdating}
                sx={{
                  fontSize: "0.85rem",
                  padding: "4px 6px",
                  minWidth: "50px",
                  backgroundColor: "#333333"
                }}
              >
                {isUpdating ? "更新中..." : "更新"}
              </Button>
            </Box>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : projects.length > 0 ? (
              <TableContainer component={Paper} sx={{ borderRadius: 2}}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                      <TableCell sx={{ fontSize: "0.8rem", fontWeight: "bold", borderBottom: "2px solid #ccc" }}>
                        プロジェクト名
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.8rem", fontWeight: "bold", borderBottom: "2px solid #ccc" }}>
                        SharePoint URL
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.8rem", fontWeight: "bold", borderBottom: "2px solid #ccc" }}>
                      </TableCell>
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
                        <TableCell sx={{ fontSize: "0.75rem", borderBottom: "1px solid #ddd" }}>
                          {project.project_name}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.75rem", borderBottom: "1px solid #ddd" }}>
                          <a
                            href={project.spo_url} //half属性でリンク先URLを指定
                            target="_blank" //新しいタブでリンクを開く
                            rel="noopener noreferrer" //セキュリティリスクを軽減
                            style={{ textDecoration: "none", color: "#1a73e8" }} // リンクの見た目を変更可能
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
                        <TableCell sx={{ fontSize: "0.75rem", borderBottom: "1px solid #ddd" }}>
                          <Tooltip title="削除" placement="left">
                            <IconButton
                              size="small"
                              color="#333333"
                              onClick={() => openDeleteDialog(project.project_name)}
                              sx={{ padding: "0px" }}
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
            ) : (
              <Typography sx={{ fontSize: "0.8rem" }}>プロジェクトが見つかりません。</Typography>
            )}
          </Box>
        </Box>
        {/* 削除確認ダイアログ */}
        <DeleteDialog
        open={openDialog}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteProject}
        projectName={selectedProject}
      />
      </Box>
    </Box>
  );
};

export default ProjectPage;
