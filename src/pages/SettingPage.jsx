import React, { useState, useMemo } from "react";
import {
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Button,
  Box,
  TextField,
  Slider,
  Switch,
  FormControlLabel,
  RadioGroup,
  Radio,
  CssBaseline,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const SettingPage = () => {
  // ステート管理
  const [selectedModel, setSelectedModel] = useState("gpt-3.5");
  const [temperature, setTemperature] = useState(0.7);
  const [responseLength, setResponseLength] = useState("standard");
  const [customPrompt, setCustomPrompt] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // モデル選択リスト
  const modelOptions = [
    { value: "gpt-3.5", label: "GPT-3.5" },
    { value: "gpt-4", label: "GPT-4" },
    { value: "azure-openai", label: "Azure OpenAI" },
    { value: "custom-llm", label: "社内モデル" },
  ];

  // テーマをメモ化
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

  // ハンドラ
  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const handleTemperatureChange = (event, newValue) => {
    setTemperature(newValue);
  };

  const handleResponseLengthChange = (event) => {
    setResponseLength(event.target.value);
  };

  const handleFontSizeChange = (event, newValue) => {
    setFontSize(newValue);
  };

  const handlePromptChange = (event) => {
    setCustomPrompt(event.target.value);
  };

  const handleDarkModeToggle = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleSave = () => {
    const settings = {
      model: selectedModel,
      temperature,
      responseLength,
      customPrompt,
      fontSize,
      theme: isDarkMode ? "ダークモード" : "ライトモード",
    };
    console.log("保存された設定:", settings);
    alert("設定が保存されました！");
  };

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaselineを追加してテーマを適用 */}
      <CssBaseline />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* ページ遷移ボタン */}
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            backgroundColor: "#333333",
            color: "#fff",
            fontSize: "0.85rem",
            padding: "4px 12px",
            minWidth: "120px",
            mr: "10px",
            "&:hover": { backgroundColor: "#333" },
          }}
        >
          ホームページ
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/project")}
          sx={{
            backgroundColor: "#333333",
            color: "#fff",
            fontSize: "0.85rem",
            padding: "4px 12px",
            minWidth: "120px",
            mr: "5px",
            "&:hover": { backgroundColor: "#333" },
          }}
        >
          プロジェクトページ
        </Button>

        {/* ライトモード/ダークモード設定 */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            テーマ設定
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={isDarkMode}
                onChange={handleDarkModeToggle}
                name="darkModeToggle"
              />
            }
            label={isDarkMode ? "ダークモード" : "ライトモード"}
          />
        </Box>

        {/* モデル選択セクション */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            使用するLLMモデルを選択
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="llm-model-select-label">LLMモデル</InputLabel>
            <Select
              labelId="llm-model-select-label"
              id="llm-model-select"
              value={selectedModel}
              onChange={handleModelChange}
            >
              {modelOptions.map((model) => (
                <MenuItem key={model.value} value={model.value}>
                  {model.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* モデルパラメータ設定 */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            モデル設定
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>回答の自由度</Typography>
            <Slider
              value={temperature}
              onChange={handleTemperatureChange}
              step={0.1}
              min={0}
              max={1}
              valueLabelDisplay="auto"
            />
          </Box>
        </Box>

        {/* 応答の長さ設定 */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            応答の長さを選択
          </Typography>
          <RadioGroup
            row
            value={responseLength}
            onChange={handleResponseLengthChange}
          >
            <FormControlLabel value="short" control={<Radio />} label="短め" />
            <FormControlLabel
              value="standard"
              control={<Radio />}
              label="標準"
            />
            <FormControlLabel value="detailed" control={<Radio />} label="詳細" />
          </RadioGroup>
        </Box>

        {/* カスタムプロンプト設定 */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            ベースプロンプトを設定
          </Typography>
          <TextField
            fullWidth
            id="custom-prompt"
            label="カスタムプロンプト"
            variant="outlined"
            multiline
            rows={4}
            value={customPrompt}
            onChange={handlePromptChange}
          />
        </Box>

        {/* フォントサイズ設定 */}
        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom>フォントサイズ</Typography>
          <Slider
            value={fontSize}
            onChange={handleFontSizeChange}
            step={1}
            min={12}
            max={24}
            valueLabelDisplay="auto"
          />
        </Box>

        {/* 保存ボタン */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            保存
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SettingPage;
