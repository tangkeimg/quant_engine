# 项目总结 — 量化交易学习计划

## **项目概述**
- **目标**: 通过这个工程从零学习量化交易：掌握数据获取、策略实现、回测评估与结果可视化。你当前没有投资经验，项目以教学与实践并重，逐步带你从基础概念到完整回测流程。

## **我的背景与前提**
- **投资经验**: 无。
- **期望**: 通过实践掌握量化交易的核心流程（数据 → 策略 → 回测 → 分析 → 可视化），并能读懂并改写示例策略。

## **项目目录结构**

```text
PROJECT_ROOT/
├─ PROJECT_SUMMARY.md
├─ backend/
│  ├─ .python-version
│  ├─ .gitignore
│  ├─ uv.lock
│  ├─ main.py
│  ├─ README.md
│  ├─ pyproject.toml
│  └─ app/
│     ├─ __init__.py
│     ├─ api/
│     │  ├─ __init__.py
│     │  └─ stock_api.py
│     └─ services/
│        ├─ __init__.py
│        └─ data_fetcher.py
└─ frontend/
	├─ package.json
	├─ .env.example
	├─ vite.config.js
	├─ pnpm-lock.yaml
	├─ jsconfig.json
	├─ README.md
	├─ .gitignore
	├─ index.html
	├─ public/
	│  ├─ favicon.svg
	│  └─ icons.svg
	└─ src/
		├─ App.css
		├─ App.jsx
		├─ index.css
		├─ main.jsx
		├─ api/
		│  ├─ request.js
		│  └─ stock.js
		├─ store/
		│  └─ useThemeStore.js
		├─ components/
		│  └─ StockChart/
		│     └─ index.jsx
		├─ pages/
		│  └─ Dashboard/
		│     └─ index.jsx
		└─ router/
			└─ index.jsx
```

## 目前进度
- 全年收盘图表

