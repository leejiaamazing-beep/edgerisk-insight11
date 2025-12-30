import csv
import random
import datetime

def random_date(start_year=2020, end_year=2024):
    start = datetime.date(start_year, 1, 1)
    end = datetime.date(end_year, 12, 31)
    return start + datetime.timedelta(days=random.randint(0, (end - start).days))

def generate_data(num_rows=100):
    headers = [
        "信贷机构编号", "信贷分行名称", "信贷支行名称", "账务机构", "七级分类", "台账状态", "客户名称", 
        "证件号码", "客户编号", "信贷产品名称（三级）", "贷款起始日", "贷款终止日", "还款方式", 
        "利率调整模式", "本金逾期天数", "利息逾期天数", "户籍所在地", "客户经理", "利率调整方式", 
        "借款用途", "客户类型", "出生年月", "月偿还债务", "月收入", "数据日期", "利率加减点", 
        "首付款比例", "结息方式", "贷款余额", "贷款期限", "展期次数", "利率", "贷款合同金额", 
        "拖欠利息", "利率调整周期（月）", "首付款金额", "欠息累计", "表外欠息", "表内欠息"
    ]

    branches = ["西安分行", "宝鸡分行", "咸阳分行", "渭南分行", "汉中分行"]
    sub_branches = ["高新支行", "雁塔支行", "碑林支行", "经开支行", "莲湖支行"]
    classifications = ["正常", "关注一", "关注二", "关注三", "次级", "可疑", "损失"]
    products = ["个人住房贷款", "个人经营性贷款", "个人消费贷款", "信用贷", "装修贷"]
    purposes = ["购房", "装修", "经营周转", "消费", "留学"]
    
    rows = []
    for i in range(num_rows):
        branch = random.choice(branches)
        start_date = random_date(2018, 2023)
        term_months = random.choice([12, 24, 36, 60, 120, 240, 360])
        end_date = start_date + datetime.timedelta(days=term_months*30)
        
        balance = random.randint(10000, 5000000)
        # correlated classification and overdue days
        if random.random() < 0.8:
            cls = "正常"
            overdue_days = 0
        else:
            cls = random.choice(classifications[1:])
            if cls.startswith("关注"):
                overdue_days = random.randint(1, 90)
            else:
                overdue_days = random.randint(91, 1000)

        contract_amt = balance + random.randint(0, 1000000)
        
        row = [
            f"ORG{i:04d}", branch, random.choice(sub_branches), f"ACC{i:04d}", cls, "正常", 
            f"客户{i}", f"61010119{random.randint(50, 99)}0101{random.randint(1000,9999)}", f"CUST{i:05d}",
            random.choice(products), start_date, end_date, "等额本息", "固定利率", 
            overdue_days, overdue_days, "陕西省西安市", f"经理{random.choice(['张', '王', '李'])}", 
            "按年调整", random.choice(purposes), "个人", "1980-01-01", 
            random.randint(2000, 20000), random.randint(5000, 50000), "2024-12-21", 
            "0", "30%", "按月结息", balance, term_months, 0, 
            round(random.uniform(3.5, 6.5), 2), contract_amt, 
            random.randint(0, 10000) if overdue_days > 0 else 0, 12, 
            contract_amt * 0.3, 0, 0, random.randint(0, 5000) if overdue_days > 0 else 0
        ]
        rows.append(row)

    with open('backend/loan_data.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)

if __name__ == "__main__":
    generate_data()
