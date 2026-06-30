import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchBills,
  addBill,
  togglePaidStatus,
  deleteBill,
  selectAllBills,
} from "../../store/slices/billsSlice";
import { fetchMembers, selectAllMembers } from "../../store/slices/membersSlice";
import Modal from "../../components/Modal";
import EmptyState from "../../components/EmptyState";

const billTypeLabels = {
  bari_bhara: "Bari Bhara",
  wifi: "WiFi Bill",
  current: "Current Bill",
  other: "Other",
};

function AdminBills() {
  const dispatch = useDispatch();
  const bills = useSelector(selectAllBills);
  const members = useSelector(selectAllMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    memberId: "all",
    type: "bari_bhara",
    amount: "",
    month: "",
    dueDate: "",
  });

  useEffect(() => {
    dispatch(fetchBills());
    dispatch(fetchMembers());
  }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const selectedMember = members.find((m) => m.id === form.memberId);
      await dispatch(
        addBill({
          memberId: form.memberId === "all" ? "all" : selectedMember?.id,
          memberName: form.memberId === "all" ? "Shobar jonno" : selectedMember?.name,
          type: form.type,
          amount: form.amount,
          month: form.month,
          dueDate: form.dueDate,
        })
      ).unwrap();
      toast.success("Bill add hoyeche!");
      setForm({ memberId: "all", type: "bari_bhara", amount: "", month: "", dueDate: "" });
      setIsModalOpen(false);
    } catch {
      toast.error("Bill add korte somossa hoyeche");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePaid = async (billId, currentStatus) => {
    try {
      await dispatch(togglePaidStatus({ billId, isPaid: !currentStatus })).unwrap();
    } catch {
      toast.error("Status update korte somossa hoyeche");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Ei bill ta delete korte chan?")) return;
    try {
      await dispatch(deleteBill(id)).unwrap();
      toast.success("Bill delete kora hoyeche");
    } catch {
      toast.error("Delete korte somossa hoyeche");
    }
  };

  const isOverdue = (dueDate, isPaid) => !isPaid && new Date(dueDate) < new Date();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate2-900">Bill Management</h1>
          <p className="text-slate2-400 mt-1">Bari bhara, WiFi, current bill — sob ekhane track korun</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          + Notun Bill
        </motion.button>
      </div>

      <div className="card">
        {bills.length === 0 ? (
          <EmptyState message="Ekhono kono bill add kora hoyni." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate2-400 border-b border-slate2-100">
                  <th className="py-3 pr-4 font-medium">Type</th>
                  <th className="py-3 pr-4 font-medium">Kar Jonno</th>
                  <th className="py-3 pr-4 font-medium">Month</th>
                  <th className="py-3 pr-4 font-medium">Taka</th>
                  <th className="py-3 pr-4 font-medium">Due Date</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill, i) => (
                  <motion.tr
                    key={bill.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-slate2-50 last:border-0"
                  >
                    <td className="py-3 pr-4 font-medium text-slate2-800">{billTypeLabels[bill.type]}</td>
                    <td className="py-3 pr-4 text-slate2-600">{bill.memberName}</td>
                    <td className="py-3 pr-4 text-slate2-500">{bill.month}</td>
                    <td className="py-3 pr-4 font-display font-semibold text-slate2-800">৳{bill.amount}</td>
                    <td className={`py-3 pr-4 ${isOverdue(bill.dueDate, bill.isPaid) ? "text-accent-red font-medium" : "text-slate2-500"}`}>
                      {bill.dueDate}
                    </td>
                    <td className="py-3 pr-4">
                      <button
                        onClick={() => handleTogglePaid(bill.id, bill.isPaid)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                          bill.isPaid
                            ? "bg-accent-green/10 text-accent-green"
                            : "bg-accent-red/10 text-accent-red"
                        }`}
                      >
                        {bill.isPaid ? "Paid" : "Baki"}
                      </button>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <button
                        onClick={() => handleDelete(bill.id)}
                        className="text-slate2-400 hover:text-accent-red"
                        aria-label="Bill delete korun"
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Notun Bill Add Korun">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate2-600 mb-1">Bill Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="input-field">
              <option value="bari_bhara">Bari Bhara</option>
              <option value="wifi">WiFi Bill</option>
              <option value="current">Current Bill</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate2-600 mb-1">Kar Jonno</label>
            <select name="memberId" value={form.memberId} onChange={handleChange} className="input-field">
              <option value="all">Shobar jonno (common bill)</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate2-600 mb-1">Month</label>
            <input
              type="text"
              name="month"
              required
              value={form.month}
              onChange={handleChange}
              className="input-field"
              placeholder="jemon: June 2026"
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
              placeholder="6000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate2-600 mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              required
              value={form.dueDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Add hocche..." : "Bill Add Korun"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default AdminBills;
