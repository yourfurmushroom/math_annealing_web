export interface Application{
  name:string,
  director:string[],
  details:string,
  imagePath:string[]
}
export const applications: Application[] = [
    {
        "name": "藥物分子設計",
        "director": ["林榮信 Jung-Hsin Lin"],
        "imagePath": ["/application/medicine1.png","/application/medicine2.png"],
        "details": "傳統的藥物模擬或分子對接，通常要一個一個地嘗試不同結構，計算時間長、成本高；但數位退火可以同時考慮數千種原子排列或化學配體，在短時間內找到能量最低、穩定、可能與蛋白質結合的分子。可更快發現潛在藥物、節省成本、提高成功率。"
    },
    {
        "name": "智慧人員排班系統技術導入麥味登",
        "director": ["歐家和 Chia-Ho Ou"],
        "imagePath": ["/application/mwd1.png","/application/mwd2.png"],
        "details": "國立屏東大學與麥味登合作，首度將「量子智慧排班技術」導入台灣餐飲業，開創AI與量子運算結合的創新應用。系統以AI銷售預測結合QUBO量子最佳化模型，能自動生成符合工時法規與員工偏好的最優排班表。實測於桃園大興示範店，編制時間縮短逾80%，大幅提升人事效率與員工滿意度。此專案象徵餐飲管理從經驗決策邁向量子智慧化的新時代，展現量子運算在實務營運上的落地應用潛力"
    },
    {
        "name": "排班問題體驗",
        "director": ["舒宇宸 Yu-Chen Shu"],
        "imagePath": ["/application/schedule1.png"],
        "details": "可自行設定總員工人數、總天數、每日值勤人數、最長連續工作日、最少休假天數，以及使用者自定之休假設定。"
    },
    {
        "name": "光學微影技術之反向光罩設計",
        "director": ["余沛慈 Pei-chen Yu"],
        "imagePath": ["/application/ILT1.png","/application/ILT2.png"],
        "details": "光學微影技術為半導體製程關鍵，隨線寬縮小與曝光波長縮短挑戰增加。採用反向微影技術（Inverse lithography technology, ILT），可獲得更佳解析度與邊緣精度。傳統電腦計算常卡在局部結果，透過退火運算與模擬，可加快設計速度並提升產品品質"
    },
    {
        "name": "國立中央大學退火機  NCU Annealer",
        "director": ["江振瑞 Jehn-Ruey Jiang"],
        "imagePath": ["/application/NCU1.png","/application/NCU2.png"],
        "details": "為一套分散式量子啟發求解系統，針對二次無約束二元最佳化（QUBO）問題進行求解。其核心演算法DABS（多樣自適應大規模搜尋）結合CPU上的遺傳演算法操作（GAO）與GPU上的平行區域搜尋（LSA），能動態選擇表現較佳的搜尋策略，提升效率與多樣性。另提出SVRS（鬆弛變數範圍搜尋）技術，透過引入少量鬆弛變數將大規模不等式問題分割為可平行處理的子問題，大幅降低計算複雜度，成功將傳統無法計算的背包問題轉化為可行解空間。"
    },
    {
        "name": "用糖果裝貨櫃來體驗背包問題",
        "director": ["舒宇宸 Yu-Chen Shu"],
        "imagePath": ["/application/container1.png","/application/container2.png"],
        "details": "挑戰以糖果為貨物的背包最佳化遊戲，體驗有限空間的取捨思考！積分高者獲更多糖果，知識與甜蜜一次收穫！"
    },
    {
        "name": "CGA–Space Filling Designs",
        "director": ["陳瑞彬 Ray-Bing Chen","陳秉洋 Ping-Yang Chen"],
        "imagePath": ["/application/CGA1.png"],
        "details": "在高成本實驗中，如何以最少樣本獲得最大資訊是一項關鍵挑戰。本研究結合統計設計理論、組合最佳化與量子啟發運算，提出以 QUBO 架構實現空間填充設計的新方法。此方法能在有限資源下生成高品質實驗設計。雖與商業演算法仍有差距，但展示了退火式搜尋與隨機設計結合的潛力，為實驗設計自動化與量子最佳化應用開啟新方向。"
    },
    {
        "name": "大型語言模型輔助的退火運算應用",
        "director": ["莊坤達 Kun-Ta Chuang","舒宇宸 Yu-Chen Shu"],
        "imagePath": ["/application/LLM1.png"],
        "details": "我們將引入檢索強化生成（RAG）技術，結合 AI 進行探索與對話服務，讓退火運算與 QUBO 轉譯過程在大型語言模型的協助下更直觀。例如在排班應用中，使用者只需以自然語言描述需求，系統即可自動完成計算與最佳化，推動專業技術普及化與智慧化應用。"
    },
    {
        "name": "抓寶可夢路徑問題體驗",
        "director": ["舒宇宸 Yu-Chen Shu"],
        "imagePath": ["/application/pokemon1.png"],
        "details": "化身訓練家，在捕獲眾多寶可夢的過程中找出最短路徑，讓一般大眾感受數位退火在最佳化中的應用！"
    },
]