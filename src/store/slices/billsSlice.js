// =====================================================================
// BILLS SLICE (Redux)
// =====================================================================
// Bari bhara, WiFi, current bill related state ekhane thake.
// =====================================================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchBillsFromFirestore,
  addBillToFirestore,
  updateBillPaidStatus,
  deleteBillFromFirestore,
} from "../../firebase/billsService";

export const fetchBills = createAsyncThunk("bills/fetchBills", async () => {
  return await fetchBillsFromFirestore();
});

export const addBill = createAsyncThunk("bills/addBill", async (billData) => {
  const id = await addBillToFirestore(billData);
  return { id, ...billData, amount: Number(billData.amount), isPaid: false };
});

export const togglePaidStatus = createAsyncThunk(
  "bills/togglePaidStatus",
  async ({ billId, isPaid }) => {
    await updateBillPaidStatus(billId, isPaid);
    return { billId, isPaid };
  }
);

export const deleteBill = createAsyncThunk(
  "bills/deleteBill",
  async (billId) => {
    await deleteBillFromFirestore(billId);
    return billId;
  }
);

const billsSlice = createSlice({
  name: "bills",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBills.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addBill.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(togglePaidStatus.fulfilled, (state, action) => {
        const bill = state.list.find((b) => b.id === action.payload.billId);
        if (bill) bill.isPaid = action.payload.isPaid;
      })
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.list = state.list.filter((b) => b.id !== action.payload);
      });
  },
});

export const selectAllBills = (state) => state.bills.list;

// Jegulo ekhono unpaid ar due date kache ese gече (3 diner moddhe)
export const selectUpcomingDueBills = (state) => {
  const today = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(today.getDate() + 3);

  return state.bills.list.filter((bill) => {
    if (bill.isPaid) return false;
    const due = new Date(bill.dueDate);
    return due <= threeDaysLater;
  });
};

export default billsSlice.reducer;
