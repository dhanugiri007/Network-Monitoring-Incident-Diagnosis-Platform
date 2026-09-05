"use client";

import { useState } from "react";
import { monitorApi } from "../services/monitor.api";

export default function MonitorForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    target: "",
    type: "HTTP",
    intervalSeconds: 60,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await monitorApi.create({
        ...form,
        intervalSeconds: Number(form.intervalSeconds),
      });
      setForm({ name: "", target: "", type: "HTTP", intervalSeconds: 60 });
      if (onCreated) onCreated(); // tell parent to refresh list
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Monitor</h3>

      <div>
        <label>Name: </label>
        <input name="name" value={form.name} onChange={handleChange} required />
      </div>

      <div>
        <label>Target (domain): </label>
        <input name="target" value={form.target} onChange={handleChange} required />
      </div>

      <div>
        <label>Type: </label>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="DNS">DNS</option>
          <option value="TCP">TCP</option>
          <option value="TLS">TLS</option>
          <option value="HTTP">HTTP</option>
        </select>
      </div>

      <div>
        <label>Interval (seconds): </label>
        <input
          type="number"
          name="intervalSeconds"
          value={form.intervalSeconds}
          onChange={handleChange}
          min="5"
        />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "Creating..." : "Create Monitor"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}