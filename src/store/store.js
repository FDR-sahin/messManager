import { configureStore } from "@reduxjs/toolkit";
import membersReducer from "./slices/membersSlice";
import expensesReducer from "./slices/expensesSlice";
import billsReducer from "./slices/billsSlice";
import noticesReducer from "./slices/noticesSlice";

export const store = configureStore({
  reducer: {
    members: membersReducer,
    expenses: expensesReducer,
    bills: billsReducer,
    notices: noticesReducer,
  },
});
