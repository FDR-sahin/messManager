import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchNotices,
  addNotice,
  deleteNotice,
  selectAllNotices,
} from "../store/slices/noticesSlice";
import { useAuth } from "../context/AuthContext";
import EmptyState from "../components/EmptyState";

function NoticeBoard() {
  const dispatch = useDispatch();
  const notices = useSelector(selectAllNotices);
  const { userProfile, isAdmin } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", message: "" });

  useEffect(() => {
    dispatch(fetchNotices());
  }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await dispatch(
        addNotice({
          authorId: userProfile.id,
          authorName: userProfile.name,
          title: form.title,
          message: form.message,
          type: isAdmin ? "notice" : "complaint",
        })
      ).unwrap();
      toast.success(isAdmin ? "Notice post hoyeche!" : "Complaint pathano hoyeche!");
      setForm({ title: "", message: "" });
      setShowForm(false);
    } catch {
      toast.error("Post korte somossa hoyeche");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Ei post ta delete korte chan?")) return;
    try {
      await dispatch(deleteNotice(id)).unwrap();
      toast.success("Delete kora hoyeche");
    } catch {
      toast.error("Delete korte somossa hoyeche");
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate2-900">Notice Board</h1>
          <p className="text-slate2-400 mt-1">
            {isAdmin ? "Notice post korun, member-er complaint dekhun" : "Notice dekhun, complaint janan"}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm((v) => !v)}
          className="btn-primary"
        >
          {showForm ? "Bondho korun" : isAdmin ? "+ Notice Dhin" : "+ Complaint Janan"}
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="card mb-6 space-y-4 overflow-hidden"
          >
            <div>
              <label className="block text-sm font-medium text-slate2-600 mb-1">Title</label>
              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                className="input-field"
                placeholder={isAdmin ? "jemon: Pani somossa shomadhan hoyeche" : "jemon: Bathroom-e somossa"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate2-600 mb-1">Message</label>
              <textarea
                name="message"
                required
                rows={3}
                value={form.message}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? "Pathano hocche..." : "Post Korun"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {notices.length === 0 ? (
        <div className="card">
          <EmptyState message="Ekhono kono notice ba complaint nei." />
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice, i) => (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    notice.type === "notice"
                      ? "bg-brand-50 text-brand-600"
                      : "bg-accent-amber/10 text-accent-amber"
                  }`}>
                    {notice.type === "notice" ? "Notice" : "Complaint"}
                  </span>
                  <span className="text-xs text-slate2-400">{formatDate(notice.createdAt)}</span>
                </div>
                {(isAdmin || notice.authorId === userProfile?.id) && (
                  <button
                    onClick={() => handleDelete(notice.id)}
                    className="text-slate2-400 hover:text-accent-red"
                    aria-label="Delete korun"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-4.5 h-4.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-.8 12a2 2 0 0 1-2 1.8H9.8a2 2 0 0 1-2-1.8L7 7" />
                    </svg>
                  </button>
                )}
              </div>
              <h3 className="font-display font-semibold text-slate2-900">{notice.title}</h3>
              <p className="text-slate2-600 text-sm mt-1">{notice.message}</p>
              <p className="text-xs text-slate2-400 mt-3">— {notice.authorName}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NoticeBoard;
