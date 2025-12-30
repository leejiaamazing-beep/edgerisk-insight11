
import { useState, useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { Dashboard } from './components/Dashboard';
import type { DashboardData, AnalysisResult } from './types';
import { parse } from 'marked';
import { Lightbulb, Download } from './components/Icons';

const API_BASE = 'http://localhost:8000';

// Mock data for dashboard when backend is not available
const MOCK_DASHBOARD_DATA: DashboardData = {
  summary: {
    total_loan_balance_wan: 125000,
    total_overdue_balance_wan: 8500,
    overall_npl_ratio: 3.2,
    total_overdue_customers: 450,
    total_npl_balance_wan: 4000,
    total_npl_customers: 180
  },
  branch_npl_rank: [
    { branch_name: '西安分行', npl_ratio: 4.5 },
    { branch_name: '咸阳分行', npl_ratio: 3.8 },
    { branch_name: '宝鸡分行', npl_ratio: 3.2 },
    { branch_name: '渭南分行', npl_ratio: 2.9 },
    { branch_name: '延安分行', npl_ratio: 2.5 }
  ],
  asset_quality_distribution: [
    { category: '正常', value_wan: 110000, percentage: 88.0 },
    { category: '关注', value_wan: 7000, percentage: 5.6 },
    { category: '次级', value_wan: 3000, percentage: 2.4 },
    { category: '可疑', value_wan: 3000, percentage: 2.4 },
    { category: '损失', value_wan: 2000, percentage: 1.6 }
  ],
  product_npl_rank: [
    { product_name: '个人经营贷', npl_ratio: 5.2 },
    { product_name: '消费贷', npl_ratio: 4.1 },
    { product_name: '按揭贷款', npl_ratio: 2.8 },
    { product_name: '汽车贷款', npl_ratio: 2.3 }
  ],
  product_overdue_balance: [
    { product_name: '按揭贷款', overdue_balance_wan: 3500 },
    { product_name: '个人经营贷', overdue_balance_wan: 2800 },
    { product_name: '消费贷', overdue_balance_wan: 1500 },
    { product_name: '汽车贷款', overdue_balance_wan: 700 }
  ],
  overdue_day_distribution: [
    { bucket: '1-30天', overdue_balance_wan: 2500, customer_count: 150 },
    { bucket: '31-60天', overdue_balance_wan: 2000, customer_count: 120 },
    { bucket: '61-90天', overdue_balance_wan: 1500, customer_count: 90 },
    { bucket: '91-180天', overdue_balance_wan: 1200, customer_count: 60 },
    { bucket: '180天以上', overdue_balance_wan: 1300, customer_count: 30 }
  ],
  age_risk_performance: [
    { age_segment: '18-25岁', npl_ratio: 4.5, overdue_ratio: 7.2 },
    { age_segment: '26-35岁', npl_ratio: 3.2, overdue_ratio: 5.8 },
    { age_segment: '36-45岁', npl_ratio: 2.8, overdue_ratio: 4.5 },
    { age_segment: '46-55岁', npl_ratio: 3.5, overdue_ratio: 5.2 },
    { age_segment: '56岁以上', npl_ratio: 4.0, overdue_ratio: 6.0 }
  ]
};

function App() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [view, setView] = useState<'dashboard' | 'analysis'>('dashboard');

  const loadDashboardData = async () => {
    try {
      const res = await fetch(`${API_BASE}/dashboard_data`);
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      } else {
        console.warn("Dashboard data fetch failed, using mock data.");
        setDashboardData(MOCK_DASHBOARD_DATA);
      }
    } catch (e) {
      console.warn("Failed to load dashboard data, using mock data", e);
      setDashboardData(MOCK_DASHBOARD_DATA);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleAnalyze = async (query: string) => {
    setIsAnalyzing(true);
    setView('analysis'); // switch to analysis view
    setAnalysisResult(null); // clear previous

    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (res.ok) {
        setAnalysisResult({
          analysis: data.analysis,
          image_path: data.image_path ? `${API_BASE}${data.image_path}` : null,
          download_path: data.download_path ? `${API_BASE}${data.download_path}` : null,
          notebook_path: data.notebook_path
        });
      } else {
        setAnalysisResult({
          analysis: `### Error\n${data.detail || 'Unknown error'}`,
          image_path: null,
          download_path: null,
          notebook_path: null
        });
      }
    } catch (e) {
      setAnalysisResult({
        analysis: `### Network Error\nAuthentication or Server issue.`,
        image_path: null,
        download_path: null,
        notebook_path: null
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
    setView('dashboard');
  };

  return (
    <div className="main-container">
      <ControlPanel
        onAnalyze={handleAnalyze}
        isAnalyzing={isAnalyzing}
        onRefreshDashboard={handleRefresh}
        onExport={() => alert("功能开发中")}
      />

      <div className="display-panel">
        {view === 'dashboard' && (
          <>
            <div className="result-card welcome-card" style={{ display: 'block' }}>
              <i className="ri-lightbulb-fill" style={{ fontSize: '50px', color: 'var(--brand-highlight-color)', marginBottom: '20px', display: 'block', animation: 'pulse 2s infinite ease-in-out' }}></i>
              <h2>欢迎使用“<span className="brand-name" style={{ color: 'var(--brand-highlight-color)' }}>长策</span>”智能风险分析平台</h2>
              <p>我是您的信贷后管理专家“长策”。您可以通过左侧的指令中心，使用自然语言向我提问，以对我行信贷数据进行深度分析与洞察。</p>
            </div>
            <Dashboard data={dashboardData} />
          </>
        )}

        {view === 'analysis' && (
          <div className="w-full max-w-[900px]">
            {isAnalyzing && <div className="spinner"></div>}

            {analysisResult && (
              <>
                <div className="result-card" style={{ display: 'block' }} id="result-container"
                  dangerouslySetInnerHTML={{ __html: parse(analysisResult.analysis) as string }}
                ></div>

                {analysisResult.image_path && (
                  <div className="result-card" style={{ display: 'block' }}>
                    <h2>数据可视化图表</h2>
                    <img src={analysisResult.image_path} alt="Chart" className="w-full rounded border" />
                  </div>
                )}

                {analysisResult.download_path && (
                  <div className="result-card" style={{ display: 'block' }}>
                    <h2>数据导出</h2>
                    <a
                      id="download-link"
                      href={analysisResult.download_path}
                      download
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      <Download className="mr-2" size={20} /> 点击此处下载数据明细
                    </a>
                  </div>
                )}

                {/* Display IPYNB path for confirmation */}
                {analysisResult.notebook_path && (
                  <div className="mt-4 text-xs text-gray-400 text-center">
                    Generated Code saved to: {analysisResult.notebook_path}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
