import React, { useState } from 'react';
import './css/CrafftSurvey.css';

function CrafftSurvey() {
  const [partA, setPartA] = useState({
    alcohol: '',
    cannabis: '',
    otherDrugs: ''
  });

  const [partB, setPartB] = useState({
    C: false,
    R: false,
    A: false,
    F1: false,
    F2: false,
    T: false
  });

  const handlePartAChange = (e) => {
    const { name, value } = e.target;
    setPartA(prev => ({ ...prev, [name]: value }));
  };

  const handlePartBChange = (e) => {
    const { name, checked } = e.target;
    setPartB(prev => ({ ...prev, [name]: checked }));
  };

  const anyUse = Object.values(partA).some(value => parseInt(value) > 0);
  const score = Object.values(partB).filter(val => val).length;

  return (
    <div className="the-khao-sat">
      <h2 className="tieu-de">Khảo sát CRAFFT</h2>
      <p className="tieu-de">Công cụ sàng lọc sử dụng chất gây nghiện cho thanh thiếu niên (12–21 tuổi).</p>

      {/* PHẦN A */}
      <h3 className="tieu-de">Phần A: Tần suất sử dụng trong 12 tháng qua</h3>
      <p className="tieu-de">(Điền số ngày, nếu không sử dụng ghi "0")</p>

      <div className="cach-khoang">
        <div className="cau-hoi">
          <label className="tieu-de">1. Rượu (hơn vài ngụm): </label>
          <input
            type="number"
            name="alcohol"
            value={partA.alcohol}
            onChange={handlePartAChange}
            className="hop-chon"
            min="0"
          />
        </div>
        <div className="cau-hoi">
          <label className="tieu-de">2. Cần sa hoặc hashish: </label>
          <input
            type="number"
            name="cannabis"
            value={partA.cannabis}
            onChange={handlePartAChange}
            className="hop-chon"
            min="0"
          />
        </div>
        <div className="cau-hoi">
          <label className="tieu-de">3. Bất kỳ chất nào khác để cảm thấy “phê”: </label>
          <input
            type="number"
            name="otherDrugs"
            value={partA.otherDrugs}
            onChange={handlePartAChange}
            className="hop-chon"
            min="0"
          />
        </div>
      </div>

      {/* PHẦN B */}
      {(anyUse || score > 0) && (
        <>
          <h3 className="tieu-de">Phần B: Câu hỏi CRAFFT</h3>
          <p className="tieu-de">Trong 12 tháng vừa qua:</p>

          <div className="cach-khoang">
            <label className="cau-hoi">
              <input type="checkbox" name="C" checked={partB.C} onChange={handlePartBChange} className="mr-2" />
              C – Ngồi trong xe do người đang “phê” hoặc sử dụng rượu/lái?
            </label>
            <label className="cau-hoi">
              <input type="checkbox" name="R" checked={partB.R} onChange={handlePartBChange} className="mr-2" />
              R – Sử dụng để thư giãn, cảm thấy tốt hơn hoặc hòa nhập?
            </label>
            <label className="cau-hoi">
              <input type="checkbox" name="A" checked={partB.A} onChange={handlePartBChange} className="mr-2" />
              A – Sử dụng khi ở một mình?
            </label>
            <label className="cau-hoi">
              <input type="checkbox" name="F1" checked={partB.F1} onChange={handlePartBChange} className="mr-2" />
              F – Quên những việc đã làm khi sử dụng?
            </label>
            <label className="cau-hoi">
              <input type="checkbox" name="F2" checked={partB.F2} onChange={handlePartBChange} className="mr-2" />
              F – Bị người thân/bạn bè khuyên nên dừng?
            </label>
            <label className="cau-hoi">
              <input type="checkbox" name="T" checked={partB.T} onChange={handlePartBChange} className="mr-2" />
              T – Gặp rắc rối khi đang sử dụng?
            </label>
          </div>

          {/* Đánh giá kết quả */}
          <div className="hop-diem">
            <p className="tieu-de">Kết quả đánh giá:</p>
            <p>Tổng điểm: {score}</p>
            <p>
              Mức nguy cơ:{' '}
              <span className={
                score >= 2 ? 'nguy-co-cao' : 'nguy-co-thap'
              }>
                {score >= 2 ? 'Nguy cơ cao' : 'Nguy cơ thấp'}
              </span>
            </p>
          </div>
        </>
      )}

      {!anyUse && score === 0 && (
        <div className="nguy-co-trung-binh">
          Bạn không sử dụng chất nào trong 12 tháng qua. Vui lòng trả lời câu hỏi B1.
        </div>
      )}
    </div>
  );
}

export default CrafftSurvey;
