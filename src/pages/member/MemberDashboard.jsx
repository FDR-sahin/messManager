import { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses, selectAllExpenses, selectExpensesByMember } from "../../store/slices/expensesSlice";
import { fetchBills, selectAllBills } from "../../store/slices/billsSlice";
import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/StatCard";
import EmptyState from "../../components/EmptyState";

function MemberDashboard() {
  const dispatch = useDispatch();
  const { userProfile } = useAuth();
  const expenses = useSelector(selectAllExpenses);
  const expensesByMember = useSelector(selectExpensesByMember);
  const bills = useSelector(selectAllBills);

  useEffect(() => {
    dispatch(fetchExpenses());
    dispatch(fetchBills());
  }, [dispatch]);

  const myBazarTotal = userProfile ? expensesByMember[userProfile.name] || 0 : 0;
  const myBills = bills.filter(
    (b) => b.memberId === userProfile?.id || b.memberId === "all"
  );
  const myUnpaidBills = myBills.filter((b) => !b.isPaid);
  const myUnpaidTotal = myUnpaidBills.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <h1 className="text-2xl font-display font-bold text-slate2-900">
          Assalamu Alaikum, {userProfile?.name}
        </h1>
        <p className="text-slate2-400 mt-1">Apnar mess account-er summary ekhane</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Amar Total Bazar Khoroch"
          value={myBazarTotal}
          prefix="৳"
          icon="M3 3h2l.4 2M7 13h10l3-7H6.4M7 13 5.4 5M7 13l-1.5 4.5h11"
          color="green"
        />
        <StatCard
          label="Amar Baki Bill"
          value={myUnpaidBills.length}
          icon="M9 12h6m-6 4h6M7 4h10a2 2 0 0 1 2 2v14l-4-2-2 2-2-2-2 2-4-2V6a2 2 0 0 1 2-2Z"
          color="red"
        />
        <StatCard
          label="Total Baki Taka"
          value={myUnpaidTotal}
          prefix="৳"
          icon="M12 8v8m-4-4h8"
          color="amber"
        />
      </div>

      <div className="card">
        <h2 className="font-display font-semibold text-slate2-900 mb-4">
          Recent Bazar Entry
        </h2>
        {expenses.length === 0 ? (
          <EmptyState message="Ekhono kono bazar entry nei." />
        ) : (
          <ul className="space-y-3">
            {expenses.slice(0, 6).map((exp) => (
              <li key={exp.id} className="flex items-center justify-between border-b border-slate2-100 pb-3 last:border-0">
                <div>
                  <p className="font-medium text-slate2-800 text-sm">{exp.item}</p>
                  <p className="text-xs text-slate2-400">{exp.memberName} • {exp.date}</p>
                </div>
                <span className="text-accent-green font-display font-semibold text-sm">৳{exp.amount}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MemberDashboard;
