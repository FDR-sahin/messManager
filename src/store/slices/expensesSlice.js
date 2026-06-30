// =====================================================================
// EXPENSES SLICE (Redux)
// =====================================================================
// Bazar khoroch related state ekhane thake. Component theke dispatch
// korle Firestore theke data ashbe ba notun entry save hobe.
// =====================================================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchExpensesFromFirestore,
  addExpenseToFirestore,
  deleteExpenseFromFirestore,
} from "../../firebase/expensesService";

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async () => {
    return await fetchExpensesFromFirestore();
  }
);

export const addExpense = createAsyncThunk(
  "expenses/addExpense",
  async (expenseData) => {
    const id = await addExpenseToFirestore(expenseData);
    return { id, ...expenseData, amount: Number(expenseData.amount) };
  }
);

export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
  async (expenseId) => {
    await deleteExpenseFromFirestore(expenseId);
    return expenseId;
  }
);

const expensesSlice = createSlice({
  name: "expenses",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.list = state.list.filter((e) => e.id !== action.payload);
      });
  },
});

export const selectAllExpenses = (state) => state.expenses.list;

// Total bazar khoroch calculate korar jonno (sob month-er total)
export const selectTotalExpenses = (state) =>
  state.expenses.list.reduce((sum, e) => sum + e.amount, 0);

// Proti member koto bazar korlo, eta calculate korar jonno
export const selectExpensesByMember = (state) => {
  const totals = {};
  state.expenses.list.forEach((e) => {
    totals[e.memberName] = (totals[e.memberName] || 0) + e.amount;
  });
  return totals;
};

export default expensesSlice.reducer;
