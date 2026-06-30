// =====================================================================
// NOTICES SLICE (Redux)
// =====================================================================
// Notice board / complaint related state ekhane thake.
// =====================================================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchNoticesFromFirestore,
  addNoticeToFirestore,
  deleteNoticeFromFirestore,
} from "../../firebase/noticesService";

export const fetchNotices = createAsyncThunk(
  "notices/fetchNotices",
  async () => {
    return await fetchNoticesFromFirestore();
  }
);

export const addNotice = createAsyncThunk(
  "notices/addNotice",
  async (noticeData) => {
    const id = await addNoticeToFirestore(noticeData);
    return { id, ...noticeData, createdAt: new Date().toISOString() };
  }
);

export const deleteNotice = createAsyncThunk(
  "notices/deleteNotice",
  async (noticeId) => {
    await deleteNoticeFromFirestore(noticeId);
    return noticeId;
  }
);

const noticesSlice = createSlice({
  name: "notices",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotices.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNotice.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(deleteNotice.fulfilled, (state, action) => {
        state.list = state.list.filter((n) => n.id !== action.payload);
      });
  },
});

export const selectAllNotices = (state) => state.notices.list;

export default noticesSlice.reducer;
