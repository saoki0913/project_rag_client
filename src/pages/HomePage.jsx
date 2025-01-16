import React, { useState, useRef } from "react";
import SideBar from "../components/SideBar";
import TextInput from "../components/TextInput";
import ChatArea from "../components/ChatArea";
import logo from "../assets/logo.png"; // ロゴ画像をインポート
import { Box, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GlobalStyles } from '@mui/material';




const HomePage = () => {
  const [chatHistory, setChatHistory] = useState([]);//チャット履歴を格納する配列
  const [messages, setMessages] = useState([]); //現在のチャットセッションのメッセージリスト
  const [isGenerating, setIsGenerating] = useState(false);//メッセージの応答生成中かを示すフラグ
  const [projects, setProjects] = useState([]);//利用可能なプロジェクト一覧
  const [folders, setFolders] = useState([]);//利用可能なフォルダ一覧
  const [selectedProject, setSelectedProject] = useState("ALL");//現在選択されているプロジェクト名
  const [selectedFolder, setSelectedFolder] = useState("all");//現在選択されているフォルダ名
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);//サイドバーが開いているかを示すフラグ
  const hasDisplayedWarning = useRef(false); // 警告表示を追跡するフラグ

  const navigate = useNavigate();

  //プロジェクト一覧を取得する非同期関数
  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:7071/projects");
      const data = await response.json();
      setProjects(
        Array.isArray(data.projects) ? data.projects.filter((p) => p && p.project_name) : []
      );
    } catch (error) {
      console.error("エラー: プロジェクト一覧の取得に失敗しました。", error);
    }
  };

  // フォルダ一覧を取得する非同期関数
  const fetchFolders = async () => {
    try {
      const response = await fetch("http://localhost:7071/get_spo_folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          project_name: selectedProject
         }),
      });
      const data = await response.json();

      // 'folders' フィールドが配列か確認して状態にセット
      setFolders(Array.isArray(data.folders) ? data.folders : []);
    } catch (error) {
      console.error("エラー: フォルダ一覧の取得に失敗しました。", error);
    }
  };

  
  // ドロップダウンでプロジェクトを選択した際に呼び出され,selectedProjectを更新する関数
  const handleSelectProject = (event) => {
    setSelectedProject(event.target.value);
    hasDisplayedWarning.current = false; // プロジェクト選択時にフラグをリセット
  };

  // ドロップダウンでプロジェクトを選択した際に呼び出され,selectedProjectを更新する関数
  const handleSelectFolders = (event) => {
    setSelectedFolder(event.target.value);
  };

  // メッセージ入力欄がフォーカスされたときにプロジェクト選択を確認する関数
  const handleFocusMessageInput = () => {
    if (!selectedProject || selectedProject === "ALL") {
      // 警告がまだ表示されていない場合のみ表示
      if (!hasDisplayedWarning.current) {
        alert("プロジェクトは選択されていませんがよろしいですか？");
        hasDisplayedWarning.current = true; // フラグを設定
      }
    }
  };
  
  // ユーザーがメッセージを送信した際に呼び出される関数
  const handleSendMessage = async (text) => {
    // selectedProjectが未選択の場合、警告を表示する．
    if (!selectedProject) {
      alert("プロジェクトを選択してください。");
      return;
    }

    setIsGenerating(true);
    const questionMessage = { type: "question", content: text };
    setMessages((prevMessages) => [...prevMessages, questionMessage]);

    try {
      // APIエンドポイントにユーザーの質問を送信
      const response = await fetch("http://localhost:7071/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user_question: text, 
          project_name: selectedProject,
          ...(selectedFolder && { folder_name: selectedFolder }) // 選択されていれば追加
         }),
      });
      const data = await response.json();
      const { answer, documentUrl=[], documentName=[], last_modified=[] } = data;
      
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
                        <a href={documentUrl[index]} target="_blank" rel="noopener noreferrer">
                          {documentUrl[index]}
                        </a>
                      ) : (
                        "URLなし"
                      )}
                      ）
                      <br />
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
  // チャット履歴をクリックした際に、その履歴をmessages状態に復元
  const handleSelectChat = (chat) => {
    setMessages(chat.messages);
  };
  // サイドバーの開閉状態を切り替える
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      {/*Material-UIの GlobalStylesを使用し，CSSを適応*/}
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
              <TextField
                select
                label="プロジェクトを選択"
                value={selectedProject}
                onClick={fetchProjects}
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
                <option value="ALL">ALL</option>
                {projects.map((project, index) => (
                  <option key={index} value={project.project_name}>
                    {project.project_name}
                  </option>
                ))}
              </TextField>
              {selectedProject !== "ALL" && (
                <TextField
                  select
                  label="フォルダ、ファイルを選択"
                  value={selectedFolder}
                  onClick={fetchFolders}
                  onChange={handleSelectFolders}
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
                  <option value="all">未選択</option>
                  {folders.map((folder, index) => (
                    <option key={index} value={folder}>
                      {folder}
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
              marginRight:"-10px",
              padding: "8px",
              backgroundColor: "white",
              borderBottom: "none", // フッターとの境界線を削除,
              overflowX: "hidden", // スクロールをなくす設定
              overflowY: "hidden", // スクロールをなくす設定
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
