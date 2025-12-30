import React, { useEffect, useRef } from 'react';
// import * as echarts from 'echarts'; 
// Remove top level import to prevent crash
// import * as echarts from 'echarts'; 
// Remove top level import to prevent crash
import type { DashboardData } from '../types';

interface DashboardProps {
    data: DashboardData | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
    const branchRef = useRef<HTMLDivElement>(null);
    const productNplRef = useRef<HTMLDivElement>(null);
    const productOverdueRef = useRef<HTMLDivElement>(null);
    const overdueDayRef = useRef<HTMLDivElement>(null);
    const ageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!data) return;

        let charts: any[] = [];
        let resizeHandler: (() => void) | null = null;

        const initCharts = async () => {
            // Dynamic import to avoid top-level crash
            const echarts = await import('echarts');

            const commonOption = {
                backgroundColor: 'transparent',
                textStyle: { color: '#94a3b8' },
                title: { textStyle: { color: '#f1f5f9' } },
                legend: { textStyle: { color: '#94a3b8' } },
            };

            // 1. Branch NPL
            if (branchRef.current) {
                const chart = echarts.init(branchRef.current, 'dark');
                const sorted = [...data.branch_npl_rank].sort((a, b) => b.npl_ratio - a.npl_ratio);
                const names = sorted.map(i => i.branch_name).reverse();
                const values = sorted.map(i => i.npl_ratio).reverse();

                chart.setOption({
                    ...commonOption,
                    backgroundColor: 'transparent',
                    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}<br/>不良率: {c}%', backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#3b82f6', textStyle: { color: '#fff' } },
                    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                    xAxis: { type: 'value', name: '不良率(%)', axisLabel: { formatter: '{value}%', color: '#94a3b8' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } } },
                    yAxis: { type: 'category', data: names, axisLabel: { interval: 0, color: '#f1f5f9' } },
                    series: [{ name: '不良率', type: 'bar', data: values, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#3b82f6' }, { offset: 1, color: '#60a5fa' }]) }, label: { show: true, position: 'right', formatter: (p: any) => p.value + '%', color: '#fff' } }]
                });
                charts.push(chart);
            }

            // 2. Product NPL
            if (productNplRef.current) {
                const chart = echarts.init(productNplRef.current, 'dark');
                const sorted = [...data.product_npl_rank].sort((a, b) => b.npl_ratio - a.npl_ratio);
                const names = sorted.map(i => i.product_name).reverse();
                const values = sorted.map(i => i.npl_ratio).reverse();

                chart.setOption({
                    ...commonOption,
                    backgroundColor: 'transparent',
                    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}<br/>不良率: {c}%', backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#f59e0b', textStyle: { color: '#fff' } },
                    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                    xAxis: { type: 'value', name: '不良率(%)', axisLabel: { formatter: '{value}%', color: '#94a3b8' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } } },
                    yAxis: { type: 'category', data: names, axisLabel: { interval: 0, color: '#f1f5f9' } },
                    series: [{ name: '不良率', type: 'bar', data: values, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#f59e0b' }, { offset: 1, color: '#fbbf24' }]) }, label: { show: true, position: 'right', formatter: (p: any) => p.value + '%', color: '#fff' } }]
                });
                charts.push(chart);
            }

            // 3. Product Overdue
            if (productOverdueRef.current) {
                const chart = echarts.init(productOverdueRef.current, 'dark');
                const sorted = [...data.product_overdue_balance].sort((a, b) => b.overdue_balance_wan - a.overdue_balance_wan);
                const names = sorted.map(i => i.product_name).reverse();
                const values = sorted.map(i => i.overdue_balance_wan).reverse();

                chart.setOption({
                    ...commonOption,
                    backgroundColor: 'transparent',
                    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}<br/>逾期金额: {c}万元', backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#ef4444', textStyle: { color: '#fff' } },
                    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                    xAxis: { type: 'value', name: '逾期金额(万元)', axisLabel: { formatter: '{value}', color: '#94a3b8' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } } },
                    yAxis: { type: 'category', data: names, axisLabel: { interval: 0, color: '#f1f5f9' } },
                    series: [{ name: '逾期金额', type: 'bar', data: values, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#ef4444' }, { offset: 1, color: '#f87171' }]) }, label: { show: true, position: 'right', formatter: (p: any) => p.value, color: '#fff' } }]
                });
                charts.push(chart);
            }

            // 4. Overdue Day Distribution
            if (overdueDayRef.current) {
                const chart = echarts.init(overdueDayRef.current, 'dark');
                const buckets = data.overdue_day_distribution.map((i: any) => i.bucket);
                const amounts = data.overdue_day_distribution.map((i: any) => i.overdue_balance_wan);
                const counts = data.overdue_day_distribution.map((i: any) => i.customer_count);

                chart.setOption({
                    ...commonOption,
                    backgroundColor: 'transparent',
                    tooltip: { trigger: 'axis', backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#8b5cf6', textStyle: { color: '#fff' } },
                    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                    xAxis: { type: 'category', data: buckets, axisLabel: { color: '#f1f5f9' } },
                    yAxis: [
                        { type: 'value', name: '金额(万元)', axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } } },
                        { type: 'value', name: '客户数', axisLabel: { color: '#94a3b8' }, splitLine: { show: false } }
                    ],
                    series: [
                        { name: '逾期金额', type: 'bar', data: amounts, itemStyle: { color: '#8b5cf6' } },
                        { name: '客户数', type: 'line', yAxisIndex: 1, data: counts, smooth: true, itemStyle: { color: '#10b981' }, lineStyle: { width: 3 } }
                    ]
                });
                charts.push(chart);
            }

            // 5. Age Risk
            if (ageRef.current) {
                const chart = echarts.init(ageRef.current, 'dark');
                const segments = data.age_risk_performance.map((i: any) => i.age_segment);
                const npl = data.age_risk_performance.map((i: any) => i.npl_ratio);
                const overdue = data.age_risk_performance.map((i: any) => i.overdue_ratio);

                chart.setOption({
                    ...commonOption,
                    backgroundColor: 'transparent',
                    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: 'rgba(15,23,42,0.9)', borderColor: '#06b6d4', textStyle: { color: '#fff' } },
                    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                    legend: { data: ['不良率', '逾期率'], textStyle: { color: '#94a3b8' } },
                    xAxis: { type: 'category', data: segments, axisLabel: { color: '#f1f5f9' } },
                    yAxis: { type: 'value', name: '比例(%)', axisLabel: { formatter: '{value}%', color: '#94a3b8' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } } },
                    series: [
                        { name: '不良率', type: 'bar', data: npl, itemStyle: { color: '#06b6d4' } },
                        { name: '逾期率', type: 'bar', data: overdue, itemStyle: { color: '#f59e0b' } }
                    ]
                });
                charts.push(chart);
            }

            resizeHandler = () => charts.forEach(c => c.resize());
            window.addEventListener('resize', resizeHandler);
        };

        initCharts();

        return () => {
            if (resizeHandler) {
                window.removeEventListener('resize', resizeHandler);
            }
            charts.forEach(c => c.dispose());
        };
    }, [data]);

    // Check if data is populated properly
    if (!data || !data.summary) {
        return (
            <div id="dashboard-card">
                <h2 className="dashboard-title">全行对私贷款风险数据大盘</h2>
                <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                    <p>暂无数据或数据加载失败。</p>
                    <p style={{ fontSize: '12px', marginTop: '10px' }}>请确保后台服务已启动 (./start_platform.sh) 且数据文件存在。</p>
                </div>
            </div>
        );
    }

    return (
        <div id="dashboard-card">
            <h2 className="dashboard-title">全行对私贷款风险数据大盘</h2>
            <div className="summary-grid">
                <div className="summary-item">
                    <div className="label">全行总贷款余额</div>
                    <div className="value">{data.summary.total_loan_balance_wan.toLocaleString()} 万元</div>
                </div>
                <div className="summary-item">
                    <div className="label">全行逾期总余额</div>
                    <div className="value">{data.summary.total_overdue_balance_wan.toLocaleString()} 万元</div>
                </div>
                <div className="summary-item">
                    <div className="label">全行整体不良率</div>
                    <div className="value">{data.summary.overall_npl_ratio}%</div>
                </div>
                <div className="summary-item">
                    <div className="label">总逾期客户数</div>
                    <div className="value">{data.summary.total_overdue_customers.toLocaleString()} 人</div>
                </div>
                <div className="summary-item">
                    <div className="label">总不良余额</div>
                    <div className="value">{data.summary.total_npl_balance_wan.toLocaleString()} 万元</div>
                </div>
                <div className="summary-item">
                    <div className="label">总不良客户</div>
                    <div className="value">{data.summary.total_npl_customers.toLocaleString()} 人</div>
                </div>
            </div>

            <div className="chart-grid">
                <div className="chart-container-item">
                    <h3>各分行不良率排行</h3>
                    <div ref={branchRef} className="echart-instance" style={{ width: '100%', height: '340px' }}></div>
                </div>
                <div className="chart-container-item">
                    <h3>资产质量结构</h3>
                    <div className="asset-quality-table-container">
                        <table className="asset-quality-table">
                            <thead>
                                <tr><th>七级分类</th><th>金额(万元)</th><th>占比(%)</th></tr>
                            </thead>
                            <tbody>
                                {data.asset_quality_distribution.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.category}</td>
                                        <td>{item.value_wan.toFixed(2)}</td>
                                        <td>{item.percentage}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="chart-grid">
                <div className="chart-container-item">
                    <h3>各产品不良率排行</h3>
                    <div ref={productNplRef} className="echart-instance" style={{ width: '100%', height: '340px' }}></div>
                </div>
                <div className="chart-container-item">
                    <h3>各产品逾期金额分布</h3>
                    <div ref={productOverdueRef} className="echart-instance" style={{ width: '100%', height: '340px' }}></div>
                </div>
            </div>

            <div className="chart-grid">
                <div className="chart-container-item">
                    <h3>逾期贷款逾期天数分布</h3>
                    <div ref={overdueDayRef} className="echart-instance" style={{ width: '100%', height: '340px' }}></div>
                </div>
                <div className="chart-container-item">
                    <h3>各年龄段风险表现</h3>
                    <div ref={ageRef} className="echart-instance" style={{ width: '100%', height: '340px' }}></div>
                </div>
            </div>
        </div>
    );
};
