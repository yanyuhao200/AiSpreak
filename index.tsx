import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * 清晰之声 - Articulation Training Assistant
 * 使用 React 18.2.0 构建
 */
const renderApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("致命错误：无法在 DOM 中找到 #root 节点");
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("渲染 React 应用时发生错误:", error);
  }
};

// 确保 DOM 准备就绪，防止 document.getElementById 失败
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}