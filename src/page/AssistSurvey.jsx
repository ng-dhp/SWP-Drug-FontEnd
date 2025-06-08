import React, { useState } from 'react';
import './css/AssistSurvey.css';

const substances = [
  { key: 'tobacco', label: 'Thuốc lá' },
  { key: 'alcohol', label: 'Rượu' },
  { key: 'cannabis', label: 'Cần sa' },
  { key: 'cocaine', label: 'Cốc-ca-in' },
  { key: 'stimulants', label: 'Thuốc kích thích' },
  { key: 'sedatives', label: 'Thuốc an thần, gây ngủ' },
  { key: 'inhalants', label: 'Chất hít' },
  { key: 'opioids', label: 'Heroin và các opioid khác' },
  { key: 'other', label: 'Khác' }
];

const questionLabels = {
  q2: 'Trong 3 tháng vừa qua, bạn đã sử dụng [CHẤT] bao nhiêu lần?',
  q3: 'Bạn có cảm thấy thèm [CHẤT] không?',
  q4: 'Việc sử dụng [CHẤT] có gây ra vấn đề?',
  q5: 'Việc sử dụng [CHẤT] có ảnh hưởng đến trách nhiệm?',
  q6: 'Người khác có lo ngại về việc sử dụng [CHẤT] không?',
  q7: 'Bạn từng cố gắng bỏ [CHẤT] nhưng không thành công?',
  q8: 'Bạn đã từng tiêm [CHẤT] chưa?'
};

const scoreOptionsQ2toQ5 = [
  { label: 'Không bao giờ', value: 0 },
  { label: 'Một hoặc hai lần', value: 2 },
  { label: 'Khoảng mỗi tháng', value: 3 },
  { label: 'Khoảng mỗi tuần', value: 4 },
  { label: 'Hằng ngày hoặc gần như hằng ngày', value: 6 }
];

const scoreOptionsQ6toQ7 = [
  { label: 'Không bao giờ', value: 0 },
  { label: 'Có, nhưng không trong 3 tháng vừa qua', value: 3 },
  { label: 'Có, trong 3 tháng vừa qua', value: 6 }
];

const scoreOptionsQ8Binary = [
  { label: 'Không', value: 0 },
  { label: 'Có', value: 99 }
];

function AssistSurvey() {
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const [customInput, setCustomInput] = useState('');
  const [customLabel, setCustomLabel] = useState('');

  const handleSubstanceSelect = (key) => {
    if (key === 'other') {
      setCustomInput('');
      setCustomLabel('');
    }
    setSelected(key);
  };

  const handleAnswerChange = (substance, question, value) => {
    setAnswers(prev => ({
      ...prev,
      [substance]: {
        ...prev[substance],
        [question]: parseInt(value)
      }
    }));
  };

  const getTotalScore = (substance) => {
    const a = answers[substance] || {};
    if (a.q8 === 99) return 99;
    const baseScore = (a.q2 || 0) + (a.q3 || 0) + (a.q4 || 0) + (a.q5 || 0) + (a.q6 || 0) + (a.q7 || 0);
    return baseScore;
  };

  const getRiskLevel = (substance) => {
    const total = getTotalScore(substance);
    if (total === 99) return 'Nguy cơ cao';
    if (substance === 'alcohol') {
      if (total <= 10) return 'Thấp';
      if (total <= 26) return 'Trung bình';
      return 'Nguy cơ cao';
    } else {
      if (total <= 3) return 'Thấp';
      if (total <= 26) return 'Trung bình';
      return 'Nguy cơ cao';
    }
  };

  return (
    <div className="survey-wrapper">
      {!selected && (
        <div className="container">
          <div className="selection-card">
            <h2 className="header">Khảo sát ASSIST</h2>
            <p className="subtext">Câu 1 – Trong suốt cuộc đời, bạn đã từng sử dụng các chất nào?</p>
            <div className="grid-3-columns">
              {substances.map(s => (
                <div
                  key={s.key}
                  className={`substance-card ${selected === s.key ? 'selected' : ''}`}
                  onClick={() => handleSubstanceSelect(s.key)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleSubstanceSelect(s.key);
                  }}
                >
                  <span className="option-label">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Nút quay về đặt dưới và căn giữa */}
            <div className="center-button-wrapper">
              <button
                className="secondary-button"
                onClick={() => window.history.back()}
              >
                ← Quay về
              </button>
            </div>
          </div>
        </div>
      )}

      {selected === 'other' && !customLabel && (
        <div className="input-container">
          <h2 className="header">Vui lòng nhập tên chất bạn đã sử dụng</h2>
          <input
            type="text"
            className="input-text"
            placeholder="Nhập tên chất..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
          />
          <button
            className="primary-button"
            disabled={!customInput.trim()}
            onClick={() => setCustomLabel(customInput.trim())}
          >
            Tiếp tục
          </button>
          <div className="text-center">
            <button
              className="secondary-button"
              onClick={() => setSelected(null)}
            >
              Quay lại chọn chất khác
            </button>
          </div>
        </div>
      )}

      {selected && (selected !== 'other' || customLabel) && (
        <div className="container">
          <div className="questionnaire-card">
            <h2 className="header">Câu hỏi dành cho: {selected === 'other' ? customLabel : substances.find(s => s.key === selected)?.label}</h2>

            {(() => {
              const label = selected === 'other' ? customLabel : substances.find(s => s.key === selected)?.label;
              const includeQ8 = !['tobacco', 'alcohol'].includes(selected);
              const questions = includeQ8 ? ["q2", "q3", "q4", "q5", "q6", "q7", "q8"] : ["q2", "q3", "q4", "q5", "q6", "q7"];

              return questions.map(q => (
                <div key={q} className="question-card">
                  <label className="question-label">
                    {questionLabels[q].replace('[CHẤT]', label)}
                  </label>
                  <select
                    className="select-box"
                    value={answers[selected]?.[q] || ''}
                    onChange={e => handleAnswerChange(selected, q, e.target.value)}
                  >
                    <option value="">Chọn</option>
                    {(q === 'q8' ? scoreOptionsQ8Binary : q.startsWith('q2') || q === 'q3' || q === 'q4' || q === 'q5'
                      ? scoreOptionsQ2toQ5
                      : scoreOptionsQ6toQ7).map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                  </select>
                </div>
              ));
            })()}

            <div className="tong-diem">
              <p className="font-semibold">Tổng điểm: {getTotalScore(selected)}</p>
              <p>
                Mức nguy cơ:{' '}
                <span className={
                  getRiskLevel(selected) === 'Nguy cơ cao' ? 'risk-high'
                    : getRiskLevel(selected) === 'Trung bình' ? 'risk-medium'
                      : 'risk-low'
                }>
                  {getRiskLevel(selected)}
                </span>
              </p>
            </div>

            <div className="text-center">
              <button
                className="secondary-button"
                onClick={() => setSelected(null)}
              >
                Quay lại chọn chất khác
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssistSurvey;
