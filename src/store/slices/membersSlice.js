// =====================================================================
// MEMBERS SLICE (Redux)
// =====================================================================
// Eta Redux store er "members" part. Component theke dispatch korle
// ei file Firestore er sathe kotha bole data anbe/save korbe.
// =====================================================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchMembersFromFirestore,
  addMemberToFirestore,
  updateMemberInFirestore,
  deleteMemberFromFirestore,
} from "../../firebase/membersService";

// Shob member load korar jonno thunk (async function)
export const fetchMembers = createAsyncThunk(
  "members/fetchMembers",
  async () => {
    return await fetchMembersFromFirestore();
  }
);

// Notun member add korar jonno thunk
export const addMember = createAsyncThunk(
  "members/addMember",
  async (memberData) => {
    return await addMemberToFirestore(memberData);
  }
);

// Member update korar jonno thunk
export const updateMember = createAsyncThunk(
  "members/updateMember",
  async ({ memberId, updates }) => {
    await updateMemberInFirestore(memberId, updates);
    return { memberId, updates };
  }
);

// Member delete korar jonno thunk
export const deleteMember = createAsyncThunk(
  "members/deleteMember",
  async (memberId) => {
    await deleteMemberFromFirestore(memberId);
    return memberId;
  }
);

const membersSlice = createSlice({
  name: "members",
  initialState: {
    list: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        const member = state.list.find((m) => m.id === action.payload.memberId);
        if (member) Object.assign(member, action.payload.updates);
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.list = state.list.filter((m) => m.id !== action.payload);
      });
  },
});

export const selectAllMembers = (state) => state.members.list;
export const selectMembersStatus = (state) => state.members.status;

export default membersSlice.reducer;
