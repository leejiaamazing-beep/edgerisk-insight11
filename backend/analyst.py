import pandas as pd
import datetime

class DataAnalyst:
    def __init__(self, data_path):
        self.data_path = data_path
        # Pre-load data to ensure it exists and valid
        self.df = pd.read_csv(data_path)

    def generate_code(self, query):
        """
        Simulates an LLM generating code based on the query.
        For this prototype, we map specific queries to pre-defined code templates.
        In a real production environment, you would call an LLM API here.
        """
        query = query.lower()
        
        base_code = f"""
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Set font for Chinese characters
plt.rcParams['font.sans-serif'] = ['Arial Unicode MS', 'SimHei', 'Heiti TC'] 
plt.rcParams['axes.unicode_minus'] = False

df = pd.read_csv('{self.data_path}')

# Output Variables (Injected by Executor)
# code_output_chart = "chart_XXX.png"
# code_output_csv = "data_XXX.csv"
"""

        if "分行" in query and ("逾期" in query or "不良" in query):
            # Example: 各分行逾期客户数量
            return base_code + """
# Filter for overdue customers (assuming '七级分类' not '正常' or '本金逾期天数' > 0)
overdue_df = df[df['本金逾期天数'] > 0]
result = overdue_df.groupby('信贷分行名称')['客户编号'].nunique().sort_values(ascending=False)

# Plot
plt.figure(figsize=(10, 6))
sns.barplot(x=result.index, y=result.values)
plt.title('各分行逾期客户数量')
plt.ylabel('客户数量')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig(code_output_chart)

print("各分行逾期客户数量统计如下：")
print(result.to_markdown())
result.to_csv(code_output_csv)
"""
        elif "产品" in query and "金额" in query:
             # Example: 产品类型贷款金额图表
            return base_code + """
result = df.groupby('信贷产品名称（三级）')['贷款余额'].sum().sort_values(ascending=False) / 10000 # Convert to Wan

plt.figure(figsize=(12, 6))
sns.barplot(x=result.index, y=result.values)
plt.title('各产品类型贷款余额 (万元)')
plt.ylabel('贷款余额 (万元)')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig(code_output_chart)

print("各产品类型贷款余额（万元）：")
print(result.to_frame(name='余额(万元)').to_markdown())
result.to_csv(code_output_csv)
"""
        elif "年龄" in query:
             # Example: 统计年龄分布
            return base_code + """
df['出生年份'] = pd.to_datetime(df['出生年月']).dt.year
current_year = pd.Timestamp.now().year
df['年龄'] = current_year - df['出生年份']

plt.figure(figsize=(10, 6))
sns.histplot(df['年龄'], bins=20, kde=True)
plt.title('客户年龄分布')
plt.xlabel('年龄')
plt.ylabel('人数')
plt.savefig(code_output_chart)

print("客户年龄统计描述：")
print(df['年龄'].describe().to_markdown())
df[['客户编号', '年龄']].head(20).to_csv(code_output_csv, index=False)
"""
        else:
            # Default fallback analysis
            return base_code + """
print("为您展示数据的前5行概览：")
print(df.head().to_markdown())
df.describe().to_csv(code_output_csv)
plt.figure()
plt.text(0.5, 0.5, '未匹配到特定分析模版', ha='center')
plt.savefig(code_output_chart)
"""

    def get_dashboard_stats(self):
        """
        Calculate summary stats for the dashboard.
        """
        df = self.df
        total_loan_balance = df['贷款余额'].sum()
        
        # Define Overdue and NPL logic
        # Overdue: 本金逾期天数 > 0
        overdue_mask = df['本金逾期天数'] > 0
        total_overdue_balance = df.loc[overdue_mask, '贷款余额'].sum()
        total_overdue_customers = df.loc[overdue_mask, '客户编号'].nunique()
        
        # NPL (Non-Performing Loan): Usually '次级', '可疑', '损失'
        npl_categories = ['次级', '可疑', '损失']
        npl_mask = df['七级分类'].isin(npl_categories)
        total_npl_balance = df.loc[npl_mask, '贷款余额'].sum()
        total_npl_customers = df.loc[npl_mask, '客户编号'].nunique()
        
        overall_npl_ratio = (total_npl_balance / total_loan_balance * 100) if total_loan_balance > 0 else 0

        # Branch NPL Rank
        branch_npl = df[npl_mask].groupby('信贷分行名称')['贷款余额'].sum()
        branch_total = df.groupby('信贷分行名称')['贷款余额'].sum()
        branch_npl_ratio = (branch_npl / branch_total * 100).fillna(0).reset_index()
        branch_npl_ratio.columns = ['branch_name', 'npl_ratio']
        branch_npl_rank = branch_npl_ratio.to_dict('records')

        # Product NPL Rank
        prod_npl = df[npl_mask].groupby('信贷产品名称（三级）')['贷款余额'].sum()
        prod_total = df.groupby('信贷产品名称（三级）')['贷款余额'].sum()
        prod_npl_ratio = (prod_npl / prod_total * 100).fillna(0).reset_index()
        prod_npl_ratio.columns = ['product_name', 'npl_ratio']
        product_npl_rank = prod_npl_ratio.to_dict('records')

        # Product Overdue Balance
        prod_overdue = df[overdue_mask].groupby('信贷产品名称（三级）')['贷款余额'].sum() / 10000
        product_overdue_rank = prod_overdue.reset_index()
        product_overdue_rank.columns = ['product_name', 'overdue_balance_wan']
        product_overdue_balance = product_overdue_rank.to_dict('records')

        # Asset Quality Distribution
        asset_quality = df.groupby('七级分类')['贷款余额'].sum().reset_index()
        asset_quality['value_wan'] = asset_quality['贷款余额'] / 10000
        asset_quality['percentage'] = (asset_quality['贷款余额'] / total_loan_balance * 100).round(2)
        asset_quality.rename(columns={'七级分类': 'category', '贷款余额': 'value'}, inplace=True)
        asset_quality_dist = asset_quality[['category', 'value', 'value_wan', 'percentage']].to_dict('records')

        # Overdue Day Distribution (Buckets)
        bins = [0, 30, 60, 90, 180, 360, 99999]
        labels = ['1-30天', '31-60天', '61-90天', '91-180天', '181-360天', '360天以上']
        df['overdue_bucket'] = pd.cut(df['本金逾期天数'], bins=bins, labels=labels)
        overdue_dist = df[overdue_mask].groupby('overdue_bucket', observed=False).agg(
            overdue_balance_wan=('贷款余额', lambda x: x.sum() / 10000),
            customer_count=('客户编号', 'nunique')
        ).reset_index()
        overdue_dist.rename(columns={'overdue_bucket': 'bucket'}, inplace=True)
        overdue_day_dist = overdue_dist.to_dict('records')

        # Age Risk Performance
        df['出生年份'] = pd.to_datetime(df['出生年月']).dt.year
        current_year = pd.Timestamp.now().year
        df['年龄'] = current_year - df['出生年份']
        age_bins = [0, 25, 35, 45, 55, 100]
        age_labels = ['25岁以下', '26-35岁', '36-45岁', '46-55岁', '55岁以上']
        df['age_segment'] = pd.cut(df['年龄'], bins=age_bins, labels=age_labels)
        
        age_stats = df.groupby('age_segment', observed=False).apply(lambda x: pd.Series({
            'npl_ratio': (x.loc[x['七级分类'].isin(npl_categories), '贷款余额'].sum() / x['贷款余额'].sum() * 100) if x['贷款余额'].sum() > 0 else 0,
            'overdue_ratio': (x.loc[x['本金逾期天数'] > 0, '贷款余额'].sum() / x['贷款余额'].sum() * 100) if x['贷款余额'].sum() > 0 else 0
        })).reset_index()
        age_risk_perf = age_stats.to_dict('records')


        return {
            "summary": {
                "total_loan_balance_wan": round(total_loan_balance / 10000, 2),
                "total_overdue_balance_wan": round(total_overdue_balance / 10000, 2),
                "overall_npl_ratio": round(overall_npl_ratio, 2),
                "total_overdue_customers": total_overdue_customers,
                "total_npl_balance_wan": round(total_npl_balance / 10000, 2),
                "total_npl_customers": total_npl_customers
            },
            "branch_npl_rank": branch_npl_rank,
            "asset_quality_distribution": asset_quality_dist,
            "product_npl_rank": product_npl_rank,
            "product_overdue_balance": product_overdue_balance,
            "overdue_day_distribution": overdue_day_dist,
            "age_risk_performance": age_risk_perf
        }
