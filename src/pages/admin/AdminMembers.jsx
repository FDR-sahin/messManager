import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchMembers,
  addMember,
  deleteMember,
  selectAllMembers,
  selectMembersStatus,
} from "../../store/slices/membersSlice";
import Modal from "../../components/Modal";
import EmptyState from "../../components/EmptyState";

function AdminMembers() {
  const dispatch = useDispatch();
  const members = useSelector(selectAllMembers);
  const status = useSelector(selectMembersStatus);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" });

  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await dispatch(addMember(form)).unwrap();
      toast.success("Notun member add hoyeche!");
      setForm({ name: "", email: "", password: "", role: "member" });
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Member add korte somossa hoyeche");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (memberId, name) => {
    if (!window.confirm(`Apni ki "${name}" ke delete korte chan?`)) return;
    try {
      await dispatch(deleteMember(memberId)).unwrap();
      toast.success("Member delete kora hoyeche");
    } catch {
      toast.error("Delete korte somossa hoyeche");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate2-900">Members</h1>
          <p className="text-slate2-400 mt-1">Apnar flat-er shob member ekhane manage korun</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          + Notun Member
        </motion.button>
      </div>

      <div className="card">
        {status === "loading" ? (
          <p className="text-slate2-400 text-center py-10">Loading...</p>
        ) : members.length === 0 ? (
          <EmptyState message="Ekhono kono member add kora hoyni." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate2-400 border-b border-slate2-100">
                  <th className="py-3 pr-4 font-medium">Naam</th>
                  <th className="py-3 pr-4 font-medium">Email</th>
                  <th className="py-3 pr-4 font-medium">Role</th>
                  <th className="py-3 pr-4 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, i) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-slate2-50 last:border-0"
                  >
                    <td className="py-3 pr-4 font-medium text-slate2-800">{member.name}</td>
                    <td className="py-3 pr-4 text-slate2-500">{member.email}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        member.role === "admin"
                          ? "bg-brand-50 text-brand-600"
                          : "bg-slate2-100 text-slate2-600"
                      }`}>
                        {member.role === "admin" ? "Admin" : "Member"}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <button
                        onClick={() => handleDelete(member.id, member.name)}
                        className="text-slate2-400 hover:text-accent-red"
                        aria-label="Member delete korun"
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Notun Member Add Korun">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate2-600 mb-1">Naam</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Member-er puro naam"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate2-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="input-field"
              placeholder="member@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate2-600 mb-1">
              Password (Login korar jonno)
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              className="input-field"
              placeholder="Kom-pokkhe 6 character"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate2-600 mb-1">Role</label>
            <select name="role" value={form.role} onChange={handleChange} className="input-field">
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Add hocche..." : "Member Add Korun"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default AdminMembers;
