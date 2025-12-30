export interface DashboardData {
  summary: {
    total_loan_balance_wan: number;
    total_overdue_balance_wan: number;
    overall_npl_ratio: number;
    total_overdue_customers: number;
    total_npl_balance_wan: number;
    total_npl_customers: number;
  };
  branch_npl_rank: { branch_name: string; npl_ratio: number }[];
  asset_quality_distribution: { category: string; value: number; value_wan: number; percentage: number }[];
  product_npl_rank: { product_name: string; npl_ratio: number }[];
  product_overdue_balance: { product_name: string; overdue_balance_wan: number }[];
  overdue_day_distribution: { bucket: string; overdue_balance_wan: number; customer_count: number }[];
  age_risk_performance: { age_segment: string; npl_ratio: number; overdue_ratio: number }[];
}

export interface AnalysisResult {
  analysis: string;
  image_path: string | null;
  download_path: string | null;
  notebook_path: string | null;
}
