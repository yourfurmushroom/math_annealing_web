
import React, { useEffect, useState } from "react";
import { TagsDefinition } from "./Utilities";

interface AttributeInterface {
  setRow: React.Dispatch<React.SetStateAction<number>>;
  setColumn: React.Dispatch<React.SetStateAction<number>>;
  row: number;
  column: number;
  gridStatus: string[][];
  reservedLeave?: Record<string, number[]>;
  constraints: Constraint[];
  setConstraints: React.Dispatch<React.SetStateAction<Constraint[]>>;
}

interface Constraint {
  name: string;
  parameters: Record<string, any>;
}

export default function AttributePanel({ gridStatus, setRow, setColumn, column, row, reservedLeave,constraints, setConstraints }: AttributeInterface) {
  const [overallScore, setOverallScore] = useState<number>(0);
  const [scoreBreakdown, setScoreBreakdown] = useState<Record<string, { score: number; weight: number }>>({});
  const [modalTag, setModalTag] = useState<TagProps | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  useEffect(() => {
    async function calculateScores() {
      const breakdown: Record<string, { score: number; weight: number }> = {};
      let totalScore = 0;
      let totalWeight = 0;

      for (const constraint of constraints) {
        const tag = TagsDefinition.find(t => t.key === constraint.name);
        if (!tag) continue;

        const allParamsDefined = tag.parameters.every(p => constraint.parameters[p.parameter_alias] !== undefined);
        if (!allParamsDefined && constraint.name !== "customize_leave") continue;

        try {
          const parameters = constraint.name === "customize_leave"
            ? { ...constraint.parameters, reserved_leave: reservedLeave || {} }
            : constraint.parameters;
          const score = await tag.evaluate(
            gridStatus.map(row => row.map(cell => (cell === "上班" ? 1 : 0))),
            parameters
          );
          const weight = Math.max(1, Number(constraint.parameters["weight"]) || 1);
          console.log(`規則: ${tag.text}, 分數: ${score}, 重要程度: ${weight}, 參數:`, parameters);
          breakdown[tag.text] = { score: Math.max(0, Math.min(1, score)), weight };
          totalScore += score * weight;
          totalWeight += weight;
        } catch (error) {
          console.error(`評估 ${tag.text} 時出错:`, error);
        }
      }

      setOverallScore(totalWeight > 0 ? totalScore / totalWeight : 0);
      setScoreBreakdown(breakdown);
    }

    if (gridStatus.length > 0) {
      calculateScores();
    }
  }, [gridStatus, constraints, reservedLeave]);

  const handleAddConstraint = (constraint: Constraint) => {
  setConstraints(prev => [
    ...prev.filter(c => c.name !== constraint.name),
    {
      ...constraint,
      parameters: {
        ...constraint.parameters,
        weight: constraint.parameters.weight ?? 1, // 如果沒有就給 1
      }
    }
  ]);
};

  const handleRemoveConstraint = (constraintName: string) => {
    setConstraints(prev => prev.filter(c => c.name !== constraintName));
  };

  const handleOpenModal = (tag: TagProps) => {
    const existingConstraint = constraints.find(c => c.name === tag.key);
    setFormValues(existingConstraint ? existingConstraint.parameters : {});
    setModalTag(tag);
  };

  const handleCloseModal = () => {
    setModalTag(null);
    setFormValues({});
  };

  const handleAdd = () => {
    if (modalTag) {
      handleAddConstraint({ name: modalTag.key, parameters: formValues });
      handleCloseModal();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value === "" ? "" : Math.max(0, Number(value));
    console.log(`參數: ${name}, 值: ${numericValue}`);
    setFormValues(prev => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  return (
    <div className="flex flex-col justify-around gap-y-2 w-full h-[80vh] p-4">
      <div className="bg-white shadow-2xl shadow-gray-300">
        <Score overallScore={overallScore} scoreBreakdown={scoreBreakdown} />
      </div>
      <div className="bg-white shadow-2xl shadow-gray-300">
        <ShiftConfiguration gridStatus={gridStatus} setRow={setRow} setColumn={setColumn} column={column} row={row} constraints={constraints} setConstraints={setConstraints} />
      </div>
      <div className="bg-white shadow-2xl shadow-gray-300">
        <TagSelector
          constraints={constraints}
          onAddConstraint={handleAddConstraint}
          onRemoveConstraint={handleRemoveConstraint}
          onOpenModal={handleOpenModal}
        />
        {modalTag && (
          <TagModal
            tag={modalTag}
            formValues={formValues}
            onInputChange={handleInputChange}
            onAdd={handleAdd}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}

function Score({ overallScore, scoreBreakdown }: { overallScore: number; scoreBreakdown: Record<string, { score: number; weight: number }> }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {overallScore < 0 && (
        <div className="text-red-500 mb-4">警告：總分異常，請檢查規則參數設置！</div>
      )}
      <div className="flex justify-center mb-6">
        <CircleProgress value={Math.max(0, overallScore * 100)} />
      </div>
      <div className="space-y-3">
        {Object.entries(scoreBreakdown).map(([key, value], index) => {
          const uniqueKey = `${key}-${index}`;
          return (
            <div key={uniqueKey} className="flex justify-between border-b pb-2">
              <span className="text-gray-700">{key}</span>
              <span className="font-semibold text-gray-900">
                {(value.score * 100).toFixed(2)}% (重要程度: {value.weight})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ShiftConfiguration({ setRow, setColumn, column, row,constraints, setConstraints }: AttributeInterface) {
  return (
    <div className="h-fit bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">排班配置</h2>
      <div className="mb-4">
        <label className="mr-2">員工數量:</label>
        <input
          type="number"
          value={row}
          onChange={(e) => setRow(Number(e.target.value))}
          className="border p-1 rounded"
          min="1"
          step="1"
        />
        <label className="ml-4 mr-2">天數:</label>
        <input
          type="number"
          value={column}
          onChange={(e) => setColumn(Number(e.target.value))}
          className="border p-1 rounded"
          min="1"
          step="1"
        />
      </div>
    </div>
  );
}

interface TagProps {
  text: string;
  key: string;
  description: string;
  parameters: { parameter_name: string; parameter_alias: string; parameter_description: string }[];
  evaluate: (shift: number[][], parameters: {}) => Promise<number>;
}

interface TagSelectorProps {
  constraints: Constraint[];
  onAddConstraint: (constraint: Constraint) => void;
  onRemoveConstraint: (constraintName: string) => void;
  onOpenModal: (tag: TagProps) => void;
}

function TagSelector({ constraints, onRemoveConstraint, onOpenModal }: TagSelectorProps) {
  return (
    <div className="h-fit bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">規則選擇</h2>
      <div className="flex flex-wrap gap-2">
        {TagsDefinition.map(tag => {
          const isAdded = constraints.some(c => c.name === tag.key);
          return (
            <div
              key={tag.key}
              className={`relative group px-4 py-2 rounded flex items-center ${isAdded ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                }`}
              onClick={() => (isAdded ? onRemoveConstraint(tag.key) : onOpenModal(tag))}
            >
              <span>{tag.text}</span>
              <button className="ml-2 text-sm">{isAdded ? "×" : "+"}</button>
              <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 -top-10">
                {isAdded && constraints.find(c => c.name === tag.key) ? (
                  <div>
                    parameters:
                    <br />
                    {Object.entries(constraints.find(c => c.name === tag.key)?.parameters || {}).map(
                      ([key, value], index) =>
                        key !== "weight" ? (
                          <span key={index}>
                            {key}: {value}
                            <br />
                          </span>
                        ) : null
                    )}
                    weight: {constraints.find(c => c.name === tag.key)?.parameters["weight"] || 1}
                  </div>
                ) : (
                  "點擊設置參數"
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface TagModalProps {
  tag: TagProps;
  formValues: Record<string, any>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
  onClose: () => void;
}

function TagModal({ tag, formValues, onInputChange, onAdd, onClose }: TagModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-lg font-bold mb-2">{tag.text}</h3>
        <p className="text-sm text-gray-600 mb-4">{tag.description}</p>
        {tag.parameters.map(param => (
          <div key={param.parameter_alias} className="mb-4">
            <label className="mr-2">{param.parameter_name}:</label>
            <input
              type="number"
              name={param.parameter_alias}
              value={formValues[param.parameter_alias] || ""}
              onChange={onInputChange}
              className="border p-1 rounded w-full"
              placeholder="請輸入值"
              min="1"
              step="1"
            />
          </div>
        ))}
        <div className="mb-4">
          <label className="mr-2">重要程度:</label>
          <input
            type="number"
            name="weight"
            value={formValues["weight"] || ""}
            onChange={onInputChange}
            className="border p-1 rounded w-full"
            placeholder="請輸入重要程度"
            min="1"
            step="1"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded">
            關閉
          </button>
          <button onClick={onAdd} className="px-4 py-2 bg-blue-500 text-white rounded">
            添加
          </button>
        </div>
      </div>
    </div>
  );
}

function CircleProgress({ value }: { value: number }) {
  const radius = 50;
  const stroke = 10;
  const normalized = radius - stroke / 2;
  const circumference = normalized * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width="120" height="120" className="transform -rotate-90">
      <circle
        r={normalized}
        cx="60"
        cy="60"
        strokeWidth={stroke}
        stroke="#e5e7eb"
        fill="transparent"
      />
      <circle
        r={normalized}
        cx="60"
        cy="60"
        strokeWidth={stroke}
        stroke="#3b82f6"
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <text
        x="60"
        y="65"
        textAnchor="middle"
        fontSize="18"
        fill="#000"
        className="rotate-90 origin-center"
      >
        {value.toFixed(0)}%
      </text>
    </svg>
  );
}