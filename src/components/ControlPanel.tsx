import React, { useState } from 'react';
import { RefreshCw, FileText, HelpCircle, BarChart2, FileSpreadsheet, Calendar, DollarSign, User, Send, Sparkles } from './Icons';

interface ControlPanelProps {
    onAnalyze: (query: string) => void;
    isAnalyzing: boolean;
    onRefreshDashboard: () => void;
    onExport: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ onAnalyze, isAnalyzing, onRefreshDashboard, onExport }) => {
    const [query, setQuery] = useState('');

    const suggestions = [
        { text: '各分行逾期客户数量', icon: <HelpCircle size={18} /> },
        { text: '产品类型贷款金额图表', icon: <BarChart2 size={18} /> },
        { text: '导出30岁以下按揭逾期明细', icon: <FileSpreadsheet size={18} /> },
        { text: '分析12期以内逾期客户', icon: <Calendar size={18} /> },
        { text: '逾期贷款金额最多的产品', icon: <DollarSign size={18} /> },
        { text: '统计年龄分布', icon: <User size={18} /> },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onAnalyze(query);
        }
    };

    return (
        <div className="control-panel">
            <div className="brand" onClick={onRefreshDashboard} style={{ cursor: 'pointer' }}>
                <img src="/images/logo.png" alt="EdgeRisk" style={{ height: '32px', marginRight: '10px' }} />
                <span>EdgeRisk Insight</span>
            </div>

            <div className="chat-window">
                <div className="chat-messages">
                    <div className="message system-message">
                        <Sparkles size={16} className="mr-2 text-yellow-500" />
                        <span>您好，我是智能信贷助手。请告诉我您想分析什么数据？</span>
                    </div>
                </div>
            </div>

            <div className="input-area">
                <form className="input-box-wrapper" onSubmit={handleSubmit}>
                    <textarea
                        placeholder="在此输入分析指令，例如：各分行不良率排名..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    // onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }} 
                    // Optional: Enter to submit
                    />
                    <button type="submit" className="send-btn" disabled={isAnalyzing}>
                        <Send size={20} />
                    </button>
                </form>

                <div className="suggestions">
                    {suggestions.map((s, i) => (
                        <div key={i} className="suggestion-item" onClick={() => setQuery(s.text)}>
                            <div style={{ color: 'var(--primary-color)', marginBottom: '8px' }}>{s.icon}</div>
                            {s.text}
                        </div>
                    ))}
                </div>
            </div>

            <div className="actions-area">
                <button className="action-item" onClick={onRefreshDashboard}>
                    <BarChart2 size={18} />
                    <span>风险大盘</span>
                </button>
                <button className="action-item" onClick={onExport}>
                    <FileText size={16} />
                    <span>导出报告</span>
                </button>
            </div>

            {/* Spacer to push content to top but allow expansion */}
            <div style={{ flexGrow: 1 }}></div>
        </div>
    );
};
