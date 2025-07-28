// src/pages/ReturnVnpay.jsx
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./css/ReturnVnpay.css";

const ReturnVnpay = () => {
  const { search } = useLocation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(search);
    const code = params.get("vnp_ResponseCode");
    const status = params.get("vnp_TransactionStatus");
    setIsSuccess(code === "00" && status === "00");
    setData(Object.fromEntries(params.entries()));
  }, [search]);

  const formatDateTime = (rawDate) => {
    if (!rawDate || rawDate.length !== 14) return rawDate;
    const year = rawDate.substring(0, 4);
    const month = rawDate.substring(4, 6);
    const day = rawDate.substring(6, 8);
    const hour = rawDate.substring(8, 10);
    const minute = rawDate.substring(10, 12);
    const second = rawDate.substring(12, 14);
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  return (
    <div className="return-vnpay-container">
      <h2 className={`return-vnpay-title ${isSuccess ? "" : "failed"}`}>
        {isSuccess ? "✅ Thanh toán thành công!" : "❌ Thanh toán thất bại!"}
      </h2>
      <div className="return-vnpay-details">
        <p><strong>Đơn hàng:</strong> {data.vnp_OrderInfo}</p>
        <p><strong>Mã giao dịch:</strong> {data.vnp_TransactionNo}</p>
        <p><strong>Số tiền:</strong> {(parseInt(data.vnp_Amount || 0) / 100).toLocaleString()} VNĐ</p>
        <p><strong>Thời gian:</strong> {formatDateTime(data.vnp_PayDate)}</p>
      </div>
      <Link to="/" className="return-vnpay-button">
        Quay về trang chủ
      </Link>
    </div>
  );
};

export default ReturnVnpay;
