import React, { createContext, useContext, useMemo, useState } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

// テーマ設定用のContext
const ThemeContext = createContext();

// Contextを使いやすくするためのカスタムフック
export const useThemeContext = () => useContext(ThemeContext);

// プロバイダーコンポーネント
export const ThemeContextProvider = ({ children }) => {
  // グローバルに管理したいステート（ダークモード・フォントサイズ）
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  // ダークモード/ライトモードの切り替え
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // フォントサイズを変更
  const handleFontSizeChange = (newFontSize) => setFontSize(newFontSize);

  // 全ページ共通テーマ（useMemoで再生成を抑制）
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
        },
        typography: {
          fontSize,
        },
      }),
    [isDarkMode, fontSize]
  );

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        fontSize,
        handleFontSizeChange,
      }}
    >
      <ThemeProvider theme={theme}>
        {/* ダーク/ライトテーマを全画面に反映するために CssBaseline を使用 */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
