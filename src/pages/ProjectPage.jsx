import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import AlertComponent from "../components/AlertComponent";
import ProjectForm from "../components/ProjectForm";
import ProjectTable from "../components/ProjectTable";
import DeleteDialog from "../components/DeleteDialog";

// APIのベースURLを設定
// const BASE_URL ="https://func-rag.azurewebsites.net";
const BASE_URL ="http://localhost:7071";


const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [spoUrl, setSpoUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [includeRootFiles, setIncludeRootFiles] = useState(false);


  const navigate = useNavigate();

  const fetchProjects = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`${BASE_URL}/projects`);
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
      const response = await fetch(`${BASE_URL}/delete_project`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_name: projectName }),
      });

      if (response.ok) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.project_name !== projectName)
        );
        setAlert({ type: "success", message: `プロジェクト「${projectName}」を削除しました。` });
      } else {
        const errorData = await response.json();
        setAlert({ type: "error", message: `削除失敗: ${errorData.message || "不明なエラーが発生しました。"}` });
      }
    } catch (error) {
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
      const response = await fetch(`${BASE_URL}/resist_project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          project_name: projectName, 
          spo_url: spoUrl,
          include_root_files: includeRootFiles,
         }),
      });
      const data = await response.json();
      setProjects((prevProjects) => [
        ...prevProjects,
        { project_name: projectName, spo_url: data.spo_url },
      ]);
      setAlert({ type: "success", message: "プロジェクトの登録に成功しました。" });
      await fetchProjects();
      setProjectName("");
      setSpoUrl("");
      setIncludeRootFiles(false);
    } catch (error) {
      setAlert({ type: "error", message: "プロジェクトの登録に失敗しました。" });
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
          display: "flex",
          flexDirection: "column",
          padding: "16px",
        }}
      >
        {loading ? (
          <Box sx={{ textAlign: "center", padding: "16px" }}>データを取得しています...</Box>
        ) : (
          <>
            <AlertComponent alert={alert} onClose={() => setAlert({ type: "", message: "" })} />
            <Box sx={{ display: "flex", gap: 1, marginBottom: 2, alignItems: "flex-start" }}>
              <Box sx={{ width: "300px", marginRight: "-40px" }}>
                <ProjectForm
                  projectName={projectName}
                  spoUrl={spoUrl}
                  setProjectName={setProjectName}
                  setSpoUrl={setSpoUrl}
                  isRegistering={isRegistering}
                  onRegister={handleRegisterProject}
                  includeRootFiles={includeRootFiles} 
                  setIncludeRootFiles={setIncludeRootFiles} 
                />
              </Box>
              <Box sx={{ flexGrow: 1, height: "calc(100vh - 100px)" }}>
                <ProjectTable
                  projects={projects}
                  onDelete={openDeleteDialog}
                  isUpdating={isUpdating}
                  onUpdate={fetchProjects}
                />
              </Box>
            </Box>
            <DeleteDialog
              open={openDialog}
              onClose={closeDeleteDialog}
              onConfirm={handleDeleteProject}
              projectName={selectedProject}
            />
          </>
        )}
      </Box>
    </Box>
  );  
};

export default ProjectPage;
