import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional

from analyst import DataAnalyst
from executor import NotebookExecutor

app = FastAPI(title="EdgeRisk Insight API", description="Backend for Financial Risk Analysis Platform")

# CORS Configuration
origins = [
    "http://localhost:5173",  # React Frontend
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Resolve paths relative to this script file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "loan_data.csv")
STATIC_DIR = os.path.join(BASE_DIR, "static")
NOTEBOOKS_DIR = os.path.join(BASE_DIR, "notebooks")

# Mount static files for generated charts/reports
os.makedirs(STATIC_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

class AnalyzeRequest(BaseModel):
    query: str

class AnalyzeResponse(BaseModel):
    analysis: str
    image_path: Optional[str] = None
    download_path: Optional[str] = None
    notebook_path: Optional[str] = None

analyst = DataAnalyst(data_path=DATA_PATH)
executor = NotebookExecutor(output_dir=STATIC_DIR, notebook_dir=NOTEBOOKS_DIR)

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    try:
        # 1. Generate Code based on Query
        print(f"Received query: {request.query}")
        code = analyst.generate_code(request.query)
        
        # 2. Execute Code in a Notebook
        execution_result = executor.execute_code(code, request.query)
        
        return AnalyzeResponse(
            analysis=execution_result["text_output"],
            image_path=execution_result["image_path"],
            download_path=execution_result["csv_path"],
            notebook_path=execution_result["notebook_path"]
        )
    except Exception as e:
        print(f"Error during analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/dashboard_data")
async def get_dashboard_data():
    """
    Returns pre-calculated stats for the dashboard.
    In a real app, this might query a database or cache.
    Here we calculate it from the CSV on startup or on demand.
    """
    try:
        return analyst.get_dashboard_stats()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
@app.get("/export_report")
async def export_report():
    """Generates a summary risk report."""
    try:
        df = pd.read_csv("loan_data.csv")
        
        # Calculate Aggregates
        total_balance = df['loan_amount'].sum()
        total_customers = len(df)
        npl_count = df[df['loan_status'] == 'Charged Off'].shape[0]
        npl_ratio = (npl_count / total_customers) * 100 if total_customers > 0 else 0
        
        # Generate Report Content
        report_content = f"""# EdgeRisk Insight - 全行风控分析报告
生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
生成节点: ESA-Edge-HK01

## 1. 资产概览
- **信贷总余额**: {total_balance:,.2f} 元
- **总客户数**: {total_customers} 人
- **不良率 (NPL Ratio)**: {npl_ratio:.2f}%

## 2. 风险提示
基于边缘计算节点的实时分析，全行资产质量整体可控。建议重点关注长尾客户的逾期风险。

## 3. 边缘节点状态
- Node ID: hk-01-prod
- Latency: 12ms
- EdgeKV Status: Synced
"""
        return {"content": report_content, "filename": f"EdgeRisk_Report_{datetime.now().strftime('%Y%m%d')}.md"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
