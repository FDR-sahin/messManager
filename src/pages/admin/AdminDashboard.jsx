import { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchMembers, selectAllMembers } from "../../store/slices/membersSlice";
import { fetchExpenses, selectAllExpenses, selectTotalExpenses } from "../../store/slices/expensesSlice";
import { fetchBills, selectAllBills, selectUpcomingDueBills } from "../../store/slices/billsSlice";
import StatCard from "../../components/StatCard";
import EmptyState from "../../components/EmptyState";

function AdminDashboard() {
  const dispatch = useDispatch();
  const members = useSelector(selectAllMembers);
  const expenses = useSelector(selectAllExpenses);
  const totalExpenses = useSelector(selectTotalExpenses);
  const bills = useSelector(selectAllBills);
  const upcomingDue = useSelector(selectUpcomingDueBills);

  useEffect(() => {
    dispatch(fetchMembers());
    dispatch(fetchExpenses());
    dispatch(fetchBills());
  }, [dispatch]);

  const unpaidBillsCount = bills.filter((b) => !b.isPaid).length;
  const perHeadExpense = members.length > 0 ? Math.round(totalExpenses / members.length) : 0;

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <h1 className=" md:text-2xl text-xl font-display font-bold text-slate2-900">
          Admin Dashboard
        </h1>
        <p className="text-slate2-400 mt-1">Apnar mess-er shob ekhane dekhte parben</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Member"
          value={members.length}
          icon="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM3 21v-1a7 7 0 0 1 14 0v1M19 8v3m0 0v3m0-3h3m-3 0h-3"
          color="brand"
        />
        <StatCard
          label="Total Bazar Khoroch"
          value={totalExpenses}
          prefix="৳"
          icon="M3 3h2l.4 2M7 13h10l3-7H6.4M7 13 5.4 5M7 13l-1.5 4.5h11"
          color="green"
        />
        <StatCard
          label="Jon Proti Khoroch"
          value={perHeadExpense}
          prefix="৳"
          icon="M12 8v8m-4-4h8"
          color="amber"
        />
        <StatCard
          label="Baki Bill"
          value={unpaidBillsCount}
          icon="M9 12h6m-6 4h6M7 4h10a2 2 0 0 1 2 2v14l-4-2-2 2-2-2-2 2-4-2V6a2 2 0 0 1 2-2Z"
          color="red"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h2 className="font-display font-semibold text-slate2-900 mb-4">
            Khub Tratari Due Bill
          </h2>
          {upcomingDue.length === 0 ? (
            <EmptyState message="Ekhon kono bill due nei. Sob thik ache!" />
          ) : (
            <ul className="space-y-3">
              {upcomingDue.map((bill) => (
                <li key={bill.id} className="flex items-center justify-between border-b border-slate2-100 pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-slate2-800 text-sm">
                      {bill.type === "bari_bhara" ? "Bari Bhara" : bill.type === "wifi" ? "WiFi Bill" : bill.type === "current" ? "Current Bill" : "Other"}
                      {bill.memberName ? ` — ${bill.memberName}` : ""}
                    </p>
                    <p className="text-xs text-slate2-400">Due: {bill.dueDate}</p>
                  </div>
                  <span className="text-accent-red font-display font-semibold text-sm">
                    ৳{bill.amount}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="card"
        >
          <h2 className="font-display font-semibold text-slate2-900 mb-4">
            Recent Bazar Entry
          </h2>
          {expenses.length === 0 ? (
            <EmptyState message="Ekhono kono bazar entry add kora hoyni." />
          ) : (
            <ul className="space-y-3">
              {expenses.slice(0, 5).map((exp) => (
                <li key={exp.id} className="flex items-center justify-between border-b border-slate2-100 pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-slate2-800 text-sm">{exp.item}</p>
                    <p className="text-xs text-slate2-400">
                      {exp.memberName} • {exp.date}
                    </p>
                  </div>
                  <span className="text-accent-green font-display font-semibold text-sm">
                    ৳{exp.amount}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default AdminDashboard;
