import React, { useState, useRef, useEffect, useCallback } from "react";
import SideBar from "../components/SideBar";
import TextInput from "../components/TextInput";
import ChatArea from "../components/ChatArea";
import logo from "../assets/logo.png"; // ロゴ画像をインポート
import { Box, TextField, Button } from "@mui/material"; // CircularProgressを追加
import { useNavigate } from "react-router-dom";
import { GlobalStyles } from '@mui/material';


// APIのベースURLを設定
// const BASE_URL ="https://func-rag.azurewebsites.net";
const BASE_URL ="http://localhost:7071";

// 初期値などを定数化して管理
const INITIAL_PROJECT = "PROJECT_ALL";
const INITIAL_FOLDER = "FOLDER_ALL";
const INITIAL_SUBFOLDER = "SUBFOLDER_ALL";

const HomePage = () => {
  // ステート管理 
  const [chatHistory, setChatHistory] = useState([]);  //チャット履歴を格納する配列
  const [messages, setMessages] = useState([]);        //現在のチャットセッションのメッセージリスト
  const [isGenerating, setIsGenerating] = useState(false); //メッセージの応答生成中かを示すフラグ

  // プロジェクトとフォルダのステート
  const [projects, setProjects] = useState([]); //利用可能なプロジェクト一覧
  const [folders, setFolders] = useState([]);   //利用可能なフォルダ一覧
  const [subfolders, setSubFolders] = useState([]);   //利用可能なサブフォルダ一覧

  const [selectedProject, setSelectedProject] = useState(INITIAL_PROJECT); 
  const [selectedFolder, setSelectedFolder] = useState(INITIAL_FOLDER);
  const [selectedSubFolder, setSelectedSubFolder] = useState(INITIAL_SUBFOLDER);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true); //サイドバーが開いているかを示すフラグ
  const hasDisplayedWarning = useRef(false);                //警告表示を追跡するフラグ

  // ローディング状態のステートを追加（プロジェクト一覧、フォルダ一覧の取得用）
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [loadingSubFolders, setLoadingSubFolders] = useState(false);

  const navigate = useNavigate();

  // プロジェクト一覧を取得
  const fetchProjects = useCallback(async () => {
    setLoadingProjects(true);
    try {
      const response = await fetch(`${BASE_URL}/projects`);
      const data = await response.json();
      const validProjects = Array.isArray(data.projects)
        ? data.projects.filter((p) => p && p.project_name)
        : [];
      setProjects(validProjects);
    } catch (error) {
      console.error("エラー: プロジェクト一覧の取得に失敗しました。", error);
    } finally {
      setLoadingProjects(false);
    }
  }, []); // 依存配列が空なので、関数が再生成されるのは初回レンダリング時のみ

 
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]); // fetchProjectsが依存関係として指定されている

  // フォルダ一覧を取得する関数
  // selectedProjectが切り替わったときに自動で実行する
  useEffect(() => {
    // ALLが選択されている場合はフォルダ一覧をクリアして早期return
    if (selectedProject === INITIAL_PROJECT) {
      setFolders([]);
      return;
    }

    const fetchFolders = async () => {
      setLoadingFolders(true);
      try {
        const response = await fetch(`${BASE_URL}/get_spo_folders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            project_name: selectedProject,
          }),
        });
        const data = await response.json();
        setFolders(Array.isArray(data.folders) ? data.folders : []);
      } catch (error) {
        console.error("エラー: フォルダ一覧の取得に失敗しました。", error);
      } finally {
        setLoadingFolders(false);
      }
    };

    fetchFolders();
  }, [selectedProject]); 
  // [selectedProject] を依存配列に指定 -> project が変わるたびに呼び出し

  // サブフォルダ一覧を取得する関数
  // selectedFolderが切り替わったときに自動で実行する
  useEffect(() => {
    // ALLが選択されている場合はフォルダ一覧をクリアして早期return
    if (selectedFolder === INITIAL_FOLDER) {
      setSubFolders([]);
      return;
    }

    const fetchSubFolders = async () => {
      setLoadingSubFolders(true);
      try {
        const response = await fetch(`${BASE_URL}/get_spo_subfolders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            project_name: selectedProject,
            folder_name: selectedFolder
          }),
        });
        const data = await response.json();
        setSubFolders(Array.isArray(data.subfolders) ? data.subfolders : []);
      } catch (error) {
        console.error("エラー: サブフォルダ一覧の取得に失敗しました。", error);
      } finally {
        setLoadingSubFolders(false);
      }
    };

    fetchSubFolders();
  }, [selectedProject, selectedFolder]); 
  // [selectedFolder] を依存配列に指定 -> folder が変わるたびに呼び出し


  // ドロップダウンの操作
  const handleSelectProject = (event) => {
    setSelectedProject(event.target.value);
    // プロジェクト切り替え時に選択フォルダを初期化
    setSelectedFolder(INITIAL_FOLDER);
    hasDisplayedWarning.current = false; // プロジェクト選択時にフラグをリセット
  };

  const handleSelectFolder = (event) => {
    setSelectedFolder(event.target.value);
  };

  const handleSelectSubFolder = (event) => {
    setSelectedSubFolder(event.target.value);
  };

  // メッセージ入力フォーカス時の警告
  const handleFocusMessageInput = () => {
    // プロジェクトが未選択(ALL)の場合
    if (!selectedProject || selectedProject === INITIAL_PROJECT) {
      if (!hasDisplayedWarning.current) {
        alert("プロジェクトは選択されていませんがよろしいですか？");
        hasDisplayedWarning.current = true;
      }
    }
  };
  
  // ユーザーがメッセージ送信した際
  const handleSendMessage = async (text) => {
    // selectedProjectが未選択orALLの場合、警告を表示
    if (!selectedProject || selectedProject === INITIAL_PROJECT) {
      alert("プロジェクトを選択してください。");
      return;
    }

    setIsGenerating(true);
    const questionMessage = { type: "question", content: text };
    setMessages((prevMessages) => [...prevMessages, questionMessage]);

    try {
      // APIエンドポイントにユーザーの質問を送信
      const response = await fetch(`${BASE_URL}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user_question: text, 
          project_name: selectedProject,
          ...(selectedFolder && { folder_name: selectedFolder }) ,
          ...(selectedSubFolder && { subfolder_name: selectedSubFolder }) 
        }),
      });

      const data = await response.json();
      const { answer, documentUrl = [], documentName = [], last_modified = [] } = data;
      
      // 回答メッセージの生成
      const answerMessage = {
        type: "answer",
        content: (
          <div>
            <p><strong>回答:</strong> {answer}</p>
            {documentName.length > 0 && (
              <div>
                <strong>関連ドキュメント:</strong>
                <ul>
                  {documentName.slice(0, 3).map((name, index) => (
                    <li key={index}>
                      {name}（
                      {documentUrl[index] ? (
                        <a
                          href={documentUrl[index]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {documentUrl[index]}
                        </a>
                      ) : (
                        "URLなし"
                      )}
                      ）<br />
                      最終更新: {last_modified[index] || "更新日時なし"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ),
      };

      // 新しいメッセージをmessagesとchatHistoryに追加
      setMessages((prevMessages) => [...prevMessages, answerMessage]);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          id: prevHistory.length + 1,
          title: text.slice(0, 20) || "新しい会話",
          messages: [...messages, questionMessage, answerMessage],
        },
      ]);
    } catch (error) {
      console.error("エラー: チャット応答の取得に失敗しました。", error);
      alert("エラー: チャット応答の取得に失敗しました。");
    } finally {
      setIsGenerating(false);
    }
  };

  // チャット履歴を選択した際に復元
  const handleSelectChat = (chat) => {
    setMessages(chat.messages);
  };

  // サイドバーの開閉切り替え
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  // レンダリング部
  return (
    <div>
      {/* Material-UIの GlobalStylesを使用し，CSSを適応 */}
      <GlobalStyles
        styles={{
          html: { height: '100%' },
          body: { height: '100%', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' },
          '#root': { height: '100%' },
        }}
      />

      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {/* サイドバー */}
        <SideBar
          chatHistory={chatHistory}
          onSelectChat={handleSelectChat}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        {/* ページ全体 */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column"
          }}
        >
          {/* ヘッダー */}
          <Box
            sx={{
              display: "flex",
              height: "50px", // 固定の高さを指定
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 16px",
              backgroundColor: "#f5f5f5", // ヘッダーの背景を薄いグレーに設定
              color: "#000",
              borderBottom: "1px solid #ddd",
              flexShrink: 0, // ヘッダーがスクロールの影響を受けないように
            }}
          >
            <img src={logo} alt="Company Logo" style={{ height: "35px", marginLeft: "45px" }} />
            <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {/* プロジェクト選択 */}
              <TextField
                select
                label="プロジェクトを選択"
                value={selectedProject}
                onChange={handleSelectProject}
                size="small"
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "4px",
                  width: "150px",
                  minWidth: "120px"
                }}
                InputLabelProps={{
                  style: { fontSize: "0.75rem" },
                }}
                SelectProps={{
                  native: true,
                  sx: { fontSize: "0.75rem" },
                }}
              >
                <option value={INITIAL_PROJECT}>ALL</option>
                {loadingProjects && (
                  <option>読み込み中...</option>
                )}
                {!loadingProjects && projects.map((project, index) => (
                  <option key={index} value={project.project_name}>
                    {project.project_name}
                  </option>
                ))}
              </TextField>

              {/* フォルダ／ファイル選択 (プロジェクトがALLの場合は非表示) */}
              {selectedProject !== INITIAL_PROJECT && (
                <TextField
                  select
                  label="フォルダ／ファイルを選択"
                  value={selectedFolder}
                  onChange={handleSelectFolder}
                  size="small"
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "4px",
                    width: "150px",
                    minWidth: "120px"
                  }}
                  InputLabelProps={{
                    style: { fontSize: "0.75rem" },
                  }}
                  SelectProps={{
                    native: true,
                    sx: { fontSize: "0.75rem" },
                  }}
                >
                  <option value={INITIAL_FOLDER}>未選択</option>
                  {loadingFolders && (
                    <option>読み込み中...</option>
                  )}
                  {!loadingFolders && folders.map((folder, index) => (
                    <option key={index} value={folder}>
                      {folder}
                    </option>
                  ))}
                </TextField>
              )}
              {/* サブフォルダ／ファイル選択 (フォルダが未選択の場合は非表示) */}
              {selectedFolder !== INITIAL_FOLDER && (
                <TextField
                  select
                  label="サブフォルダを選択"
                  value={selectedSubFolder}
                  onChange={handleSelectSubFolder}
                  size="small"
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "4px",
                    width: "150px",
                    minWidth: "120px"
                  }}
                  InputLabelProps={{
                    style: { fontSize: "0.75rem" },
                  }}
                  SelectProps={{
                    native: true,
                    sx: { fontSize: "0.75rem" },
                  }}
                >
                  <option value={INITIAL_SUBFOLDER}>未選択</option>
                  {loadingSubFolders && (
                    <option>読み込み中...</option>
                  )}
                  {!loadingSubFolders && subfolders.map((subfolder, index) => (
                    <option key={index} value={subfolder}>
                      {subfolder}
                    </option>
                  ))}
                </TextField>
              )}

              <Button
                variant="contained"
                onClick={() => navigate("/project")}
                sx={{
                  backgroundColor: "#333333",
                  color: "#fff",
                  fontSize: "0.85rem",
                  padding: "4px 12px",
                  minWidth: "120px",
                  "&:hover": { backgroundColor: "#333" },
                }}
              >
                プロジェクトページ
              </Button>
            </Box>
          </Box>

          {/* メインコンテンツ */}
          <Box
            sx={{
              flexGrow: 1,
              marginRight: "-10px",
              padding: "8px",
              backgroundColor: "white",
              borderBottom: "none", 
              overflowX: "hidden",
              overflowY: "hidden",
            }}
          >
            <ChatArea messages={messages} isGenerating={isGenerating} />
          </Box>

          {/* フッター部分 */}
          <Box
            sx={{
              padding: "16px",
              display: "flex",
              backgroundColor: "white",
              borderTop: "none",
            }}
          >
            <TextInput
              onSendMessage={handleSendMessage}
              onFocusMessageInput={handleFocusMessageInput} // フォーカス時にプロジェクト選択の確認
            />
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default HomePage;
