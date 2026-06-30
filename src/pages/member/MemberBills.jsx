import { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchBills, selectAllBills } from "../../store/slices/billsSlice";
import { useAuth } from "../../context/AuthContext";
import EmptyState from "../../components/EmptyState";

const billTypeLabels = {
  bari_bhara: "Bari Bhara",
  wifi: "WiFi Bill",
  current: "Current Bill",
  other: "Other",
};

function MemberBills() {
  const dispatch = useDispatch();
  const bills = useSelector(selectAllBills);
  const { userProfile } = useAuth();

  useEffect(() => {
    dispatch(fetchBills());
  }, [dispatch]);

  const myBills = bills.filter(
    (b) => b.memberId === userProfile?.id || b.memberId === "all"
  );

  const isOverdue = (dueDate, isPaid) => !isPaid && new Date(dueDate) < new Date();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-slate2-900">Amar Bill</h1>
        <p className="text-slate2-400 mt-1">Apnar bill-er status ekhane dekhte parben</p>
      </div>

      <div className="card">
        {myBills.length === 0 ? (
          <EmptyState message="Apnar jonno kono bill nei." />
        ) : (
          <div className="space-y-4">
            {myBills.map((bill, i) => (
              <motion.div
                key={bill.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  isOverdue(bill.dueDate, bill.isPaid)
                    ? "border-accent-red/30 bg-accent-red/5"
                    : "border-slate2-100"
                }`}
              >
                <div>
                  <p className="font-display font-medium text-slate2-800">
                    {billTypeLabels[bill.type]}
                  </p>
                  <p className="text-sm text-slate2-400">{bill.month}</p>
                  <p className={`text-xs mt-1 ${isOverdue(bill.dueDate, bill.isPaid) ? "text-accent-red font-medium" : "text-slate2-400"}`}>
                    Due Date: {bill.dueDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display font-semibold text-lg text-slate2-900">৳{bill.amount}</p>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    bill.isPaid
                      ? "bg-accent-green/10 text-accent-green"
                      : "bg-accent-red/10 text-accent-red"
                  }`}>
                    {bill.isPaid ? "Paid" : "Baki Ache"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MemberBills;
