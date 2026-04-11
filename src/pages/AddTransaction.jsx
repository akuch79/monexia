import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.js";

export default function AddTransaction() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [phone, setPhone] = useState(""); // ✅ NEW
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/transactions", {
        description,
        amount: parseFloat(amount),
        type,
        phone, // ✅ NEW SENT TO BACKEND
        date: new Date().toISOString(),
      });

      alert("Transaction added successfully!");
      navigate("/transactions");
    } catch (err) {
      console.error("Failed to add transaction:", err);
      alert(err.response?.data?.message || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "50px 20px", background: "linear-gradient(135deg, #667eea, #764ba2, #6b8dd6)", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: "450px", background: "white", borderRadius: "20px", padding: "40px 30px" }}>

        <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold", marginBottom: "30px", color: "#4f46e5" }}>
          Add Transaction
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Description */}
          <div>
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{ width: "100%", padding: "12px" }}
            />
          </div>

          {/* Amount */}
          <div>
            <label>Amount (KES)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              style={{ width: "100%", padding: "12px" }}
            />
          </div>

          {/* Type */}
          <div>
            <label>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* ✅ PHONE FIELD ADDED */}
          <div>
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={{ width: "100%", padding: "12px" }}
            />
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Transaction"}
          </button>

        </form>
      </div>
    </div>
  );
}