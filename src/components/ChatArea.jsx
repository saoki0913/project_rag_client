import React, { useEffect, useRef } from "react";
import { Box, Typography, Paper, Avatar, CircularProgress } from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const ChatArea = ({ messages, isGenerating }) => {
  // メッセージの最後にスクロールするための参照
  const messagesEndRef = useRef(null);

  // メッセージや解答生成中フラグが更新されたときにスクロールする
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  return (
    <Box
      sx={{
        padding: "8px",
        overflowY: "auto", // スクロール可能に設定
        height: "100%",    // チャットエリア全体を埋める
      }}
    >
      {messages.map((message, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column", // アイコンと吹き出しを縦方向に並べる
            alignItems: message.type === "answer" ? "flex-start" : "flex-end",
            marginBottom: "8px", // 吹き出し間の間隔を少し増やす
          }}
        >
          {/* チャットの回答用アイコン */}
          {message.type === "answer" && (
            <Avatar
              sx={{
                bgcolor: "#f5f5f5", // アイコンの背景色
                color: "text.primary",
                width: 24,
                height: 24,
                fontSize: "1rem",
                marginBottom: "4px", // アイコンと吹き出しの間の余白
              }}
            >
              <SupportAgentIcon fontSize="small" />
            </Avatar>
          )}

          {/* 吹き出し */}
          <Paper
            sx={{
              padding: "10px 15px",
              borderRadius: "10px",
              maxWidth: "70%", // 吹き出しの幅を調整
              backgroundColor: message.type === "answer" ? "#f5f5f5" : "#ffffff", // 回答は薄いグレー、質問は白
              wordBreak: "break-word", // URLや長い単語が吹き出し内で折り返される
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.85rem", // 文字サイズを調整
                color: "text.primary",
                fontWeight: "normal",
              }}
            >
              {message.content}
            </Typography>
          </Paper>
        </Box>
      ))}

      {/* 解答生成中のエフェクト */}
      {isGenerating && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#f5f5f5",
              color: "text.primary",
              width: 32,
              height: 32,
            }}
          >
            <SupportAgentIcon fontSize="small" />
          </Avatar>
          <Paper
            sx={{
              padding: "10px 15px",
              borderRadius: "10px",
              maxWidth: "70%",
              backgroundColor: "#f5f5f5",
              wordBreak: "break-word",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CircularProgress size={16} sx={{ color: "#00796b" }} />
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.85rem",
                color: "text.primary",
              }}
            >
              回答を生成中
            </Typography>
          </Paper>
        </Box>
      )}

      {/* スクロール位置を確保するためのダミー要素 */}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default ChatArea;
