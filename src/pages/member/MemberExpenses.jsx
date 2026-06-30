import { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses, selectAllExpenses, selectExpensesByMember } from "../../store/slices/expensesSlice";
import EmptyState from "../../components/EmptyState";

function MemberExpenses() {
  const dispatch = useDispatch();
  const expenses = useSelector(selectAllExpenses);
  const expensesByMember = useSelector(selectExpensesByMember);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-slate2-900">Bazar Khoroch</h1>
        <p className="text-slate2-400 mt-1">Shobar bazar entry ekhane dekhte parben</p>
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
          <div className="overflow-x-auto ">
            <table className="w-full text-sm ">
              <thead>
                <tr className="text-left text-slate2-400 border-b border-slate2-100">
                  <th className="py-3 pr-4 font-medium">Date</th>
                  <th className="py-3 pr-4 font-medium">Ke Korlo</th>
                  <th className="py-3 pr-4 font-medium">Item</th>
                  <th className="py-3 pr-4 font-medium">Taka</th>
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
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MemberExpenses;
