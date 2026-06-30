import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchExpenses,
  addExpense,
  deleteExpense,
  selectAllExpenses,
  selectExpensesByMember,
} from "../../store/slices/expensesSlice";
import { fetchMembers, selectAllMembers } from "../../store/slices/membersSlice";
import Modal from "../../components/Modal";
import EmptyState from "../../components/EmptyState";

function AdminExpenses() {
  const dispatch = useDispatch();
  const expenses = useSelector(selectAllExpenses);
  const expensesByMember = useSelector(selectExpensesByMember);
  const members = useSelector(selectAllMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    memberId: "",
    item: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    dispatch(fetchExpenses());
    dispatch(fetchMembers());
  }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedMember = members.find((m) => m.id === form.memberId);
    if (!selectedMember) {
      toast.error("Member select korun");
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(
        addExpense({
          memberId: selectedMember.id,
          memberName: selectedMember.name,
          item: form.item,
          amount: form.amount,
          date: form.date,
        })
      ).unwrap();
      toast.success("Bazar entry add hoyeche!");
      setForm({ memberId: "", item: "", amount: "", date: new Date().toISOString().split("T")[0] });
      setIsModalOpen(false);
    } catch {
      toast.error("Entry add korte somossa hoyeche");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Ei entry ta delete korte chan?")) return;
    try {
      await dispatch(deleteExpense(id)).unwrap();
      toast.success("Entry delete kora hoyeche");
    } catch {
      toast.error("Delete korte somossa hoyeche");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate2-900">Bazar Khoroch</h1>
          <p className="text-slate2-400 mt-1">Ke koto bazar korlo, sob entry ekhane</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          + Notun Entry
        </motion.button>
      </div>

      {Object.keys(expensesByMember).length > 0 && (
        <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {Object.entries(expensesByMember).map(([name, total]) => (
            <div key={name} className="card !p-4">
              <p className="text-xs text-slate2-400">{name}</p>
              <p className="text-lg font-display font-semibold text-accent-green mt-1">৳{total}</p>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        {expenses.length === 0 ? (
          <EmptyState message="Ekhono kono bazar entry add kora hoyni." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate2-400 border-b border-slate2-100">
                  <th className="py-3 pr-4 font-medium">Date</th>
                  <th className="py-3 pr-4 font-medium">Ke Korlo</th>
                  <th className="py-3 pr-4 font-medium">Item</th>
                  <th className="py-3 pr-4 font-medium">Taka</th>
                  <th className="py-3 pr-4 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp, i) => (
                  <motion.tr
                    key={exp.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-slate2-50 last:border-0"
                  >
                    <td className="py-3 pr-4 text-slate2-500">{exp.date}</td>
                    <td className="py-3 pr-4 font-medium text-slate2-800">{exp.memberName}</td>
                    <td className="py-3 pr-4 text-slate2-600">{exp.item}</td>
                    <td className="py-3 pr-4 font-display font-semibold text-accent-green">৳{exp.amount}</td>
                    <td className="py-3 pr-4 text-right">
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="text-slate2-400 hover:text-accent-red"
                        aria-label="Entry delete korun"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-.8 12a2 2 0 0 1-2 1.8H9.8a2 2 0 0 1-2-1.8L7 7" />
                        </svg>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Notun Bazar Entry">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate2-600 mb-1">Ke Bazar Korlo</label>
            <select name="memberId" required value={form.memberId} onChange={handleChange} className="input-field">
              <option value="">Member select korun</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate2-600 mb-1">Item / Description</label>
            <input
              type="text"
              name="item"
              required
              value={form.item}
              onChange={handleChange}
              className="input-field"
              placeholder="jemon: Chal, Dal, Tarkari"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate2-600 mb-1">Taka</label>
            <input
              type="number"
              name="amount"
              required
              min="1"
              value={form.amount}
              onChange={handleChange}
              className="input-field"
              placeholder="500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate2-600 mb-1">Date</label>
            <input
              type="date"
              name="date"
              required
              value={form.date}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Add hocche..." : "Entry Add Korun"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default AdminExpenses;
