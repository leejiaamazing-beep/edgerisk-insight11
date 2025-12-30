
import { useState, useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { Dashboard } from './components/Dashboard';
import type { DashboardData, AnalysisResult } from './types';
import { parse } from 'marked';
import { Lightbulb, Download } from './components/Icons';

const API_BASE = 'http://localhost:8000';

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
        console.warn("Dashboard data fetch failed, using fallback or empty.");
        // Optional: set a mock data or partial data here to verify UI
        // setDashboardData(MOCK_DATA); 
        setDashboardData({} as any); // Force render to stop spinner, or handle error in Dashboard
      }
    } catch (e) {
      console.error("Failed to load dashboard data", e);
      setDashboardData({} as any); // Force render
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
              <img src="/images/welcome.png" alt="Neural Finance" style={{ width: '100%', maxWidth: '300px', margin: '0 auto 20px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} />
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
