# Quant Engine — 项目总结

## 简要描述

Quant Engine 是一个轻量级的全栈演示工程：后端使用 Python + FastAPI，负责抓取并提供大盘（上证指数）历史数据；前端使用 React + TypeScript + Vite，使用 ECharts 渲染交互图表并通过封装的请求层调用后端接口。

## 技术栈

- 后端：Python 3.12+, FastAPI, Uvicorn, akshare, pandas, pyarrow
- 前端：React 18/19, TypeScript, Vite, ECharts, echarts-for-react, Semi UI
- 数据存储：本地 Parquet 文件（data/sh000001.parquet）

## 项目结构（概要）

- backend/
  - main.py — FastAPI 应用入口（包含 CORS 配置）
  - pyproject.toml — 后端依赖声明
  - app/
    - api/stock_api.py — 提供 `/api/stocks/index` 接口
    - services/data_fetcher.py — 使用 akshare 下载并读写 Parquet 数据
  - data/ — 存放下载的 Parquet 数据文件（sh000001.parquet）

- frontend/
  - package.json — 前端依赖与启动脚本（`dev`, `build`）
  - src/
    - App.tsx — 主界面，使用 ECharts 渲染上证指数
    - api/request.ts — 封装的 fetch 请求层（默认 BASE_URL 指向后端）
    - api/stock.ts — 封装的 `getIndexData()` 调用 `/api/stocks/index`

## 主要端点与功能

- 后端接口：
  - GET `/api/stocks/index` — 返回最近默认 365 天的上证指数数据，响应结构：
    ```json
    {
      "dates": ["YYYY-MM-DD", ...],
      "closes": [1234.56, ...]
    }
    ```
  - 数据获取逻辑：在 `app/services/data_fetcher.py` 中，如果本地 Parquet 文件不存在，会调用 `akshare.stock_zh_index_daily(symbol="sh000001")` 下载并保存为 `data/sh000001.parquet`。

- 前端：
  - `src/api/request.ts` 中默认 `BASE_URL = 'http://192.168.10.67:18000'`（开发时需根据实际后端地址修改为 `http://localhost:18000` 或环境变量配置）。
  - `App.tsx` 在挂载时调用 `getIndexData()`，用 ECharts 绘制折线图，并使用 Semi UI 的组件展示加载状态与页面布局。

## 运行说明（开发环境）

后端（在 `backend/`）：

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -U pip
# 安装运行所需依赖（示例）
pip install fastapi uvicorn akshare pandas pyarrow
# 启动服务（开发）
python main.py
# 或者：
uvicorn main:app --host 0.0.0.0 --port 18000 --reload
```

前端（在 `frontend/`）：

```bash
cd frontend
# 推荐使用 pnpm（项目包含 pnpm-lock），也可用 npm/yarn
pnpm install
pnpm run dev
# 访问地址通常为 http://localhost:5173 （或 vite 输出的地址）
```

注意：前后端需要互相可达；若前端 `request.ts` 中的 `BASE_URL` 指向局域网 IP，请根据实际开发机器调整为 `localhost` 或相应地址。

## 数据说明

- 数据文件位置（后端）：`backend/data/sh000001.parquet`
- 数据由 `akshare` 获取并保存为 Parquet，数据字段包含 `date`, `close` 等，后端会将最近 N 天（默认 365）提取并返回前端使用。

## 已知细节与改进建议

- `pyproject.toml` 中列出了后端依赖（akshare、fastapi、pandas、pyarrow、uvicorn），可以把依赖转换为 `requirements.txt` 或使用 Poetry/PEP517 构建工具以便安装。
- 前端目前硬编码了 `BASE_URL`，建议改为使用环境变量（`.env`）或 Vite 的环境变量注入以便不同部署环境使用不同后端地址。
- 考虑在后端添加简单的健康检查接口（`/health`），以及对数据拉取过程的日志/异常处理加强。

## 联系与下一步

如果你想，我可以：

- 将该总结同步到仓库的 `README.md` 或 `docs/` 里；
- 把 `BASE_URL` 改为可配置的环境变量并提交一个小补丁；
- 添加 `requirements.txt` 或 `Makefile` 帮助快速本地启动。

---

*生成于项目扫描（自动摘要）。*