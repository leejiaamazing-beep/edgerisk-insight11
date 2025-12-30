# 长策 - 智能风险分析平台

一个基于 React + TypeScript + Vite 构建的现代化金融风险分析平台，专注于信贷后管理和风险数据可视化。

## ✨ 功能特性

- 📊 **风险数据大盘**: 实时展示全行对私贷款风险数据
- 💬 **智能对话分析**: 通过自然语言进行数据查询和分析
- 📈 **可视化图表**: 使用 ECharts 展示多维度风险指标
- 🎨 **现代化UI**: 采用深色主题和玻璃态设计风格
- 📱 **响应式布局**: 适配不同屏幕尺寸

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173 查看应用

### 生产构建

```bash
npm run build
```

构建产物将生成在 `dist` 目录

### 预览生产构建

```bash
npm run preview
```

## 📦 技术栈

- **前端框架**: React 18
- **开发语言**: TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **图表库**: ECharts
- **图标库**: Remix Icon, Lucide React
- **Markdown**: Marked

## 📁 项目结构

```
edgerisk-insight/
├── src/
│   ├── components/        # React 组件
│   │   ├── ControlPanel.tsx    # 左侧控制面板
│   │   ├── Dashboard.tsx       # 数据大盘
│   │   ├── Icons.tsx           # 图标组件
│   │   └── types.ts            # 类型定义
│   ├── App.tsx           # 主应用组件
│   ├── main.tsx          # 应用入口
│   ├── types.ts          # 全局类型定义
│   └── index.css         # 全局样式
├── public/               # 静态资源
├── index.html           # HTML 模板
├── package.json         # 项目配置
├── tsconfig.json        # TypeScript 配置
├── vite.config.ts       # Vite 配置
└── tailwind.config.js   # Tailwind 配置
```

## 🎯 核心功能

### 1. 风险数据大盘

展示以下关键指标：
- 全行总贷款余额
- 全行逾期总余额
- 全行整体不良率
- 总逾期客户数
- 总不良余额
- 总不良客户数

### 2. 多维度分析图表

- 各分行不良率排行
- 资产质量结构分布
- 各产品不良率排行
- 各产品逾期金额分布
- 逾期贷款逾期天数分布
- 各年龄段风险表现

### 3. 智能分析助手

支持自然语言查询，例如：
- "各分行逾期客户数量"
- "产品类型贷款金额图表"
- "导出30岁以下按揭逾期明细"
- "分析12期以内逾期客户"

## 🔧 配置说明

### 后端API配置

在 `src/App.tsx` 中修改 API 地址：

```typescript
const API_BASE = 'http://localhost:8000';
```

### 模拟数据

当后端服务不可用时，系统会自动使用模拟数据展示界面。模拟数据定义在 `src/App.tsx` 的 `MOCK_DASHBOARD_DATA` 中。

## 🌐 部署

### 部署到 Aliyun ESA Pages

1. 构建项目：
```bash
npm run build
```

2. 将代码推送到 GitHub

3. 在 Aliyun ESA Console 创建 Pages 项目

4. 配置构建设置：
   - 框架: Vite / React
   - 构建命令: `npm run build`
   - 输出目录: `dist`

5. 部署完成后获取公开访问URL

## 📝 开发说明

### 添加新的分析功能

1. 在 `src/types.ts` 中定义数据类型
2. 在 `src/components/` 中创建新组件
3. 在 `src/App.tsx` 中集成组件

### 自定义主题

修改 `src/index.css` 中的 CSS 变量：

```css
:root {
  --bg-color: #0f172a;
  --primary-color: #3b82f6;
  --brand-highlight-color: #38bdf8;
  /* ... 更多变量 */
}
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👥 作者

EdgeRisk Insight Team

---

**注意**: 本项目为演示项目，模拟数据仅供展示使用。
