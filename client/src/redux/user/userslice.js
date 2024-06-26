import { createSlice } from "@reduxjs/toolkit";

const initialState={
    currentUser:null,
    loading:false,
    error:false,
};

const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        signinStart:(state)=>{
            state.loading=true;
        },
        signinSuccess:(state,action)=>{
            state.currentUser=action.payload,
            state.loading=false,
            state.error=false;

        },
        signinFaliure:(state,action)=>{
            state.loading=false,
            state.error=action.payload;
        },

        updateUserStart: (state) => {
            state.loading = true;
        },

        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        
        updateUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        deleteUserStart: (state) => {
            state.loading = true;
        },

        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        
        deleteUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        signOutUserStart: (state) => {
            state.loading = true;
        },

          signOutUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },

          signOutUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    } 
});
export const{signinStart,signinSuccess,signinFaliure,
    updateUserStart,updateUserSuccess,updateUserFailure,
    deleteUserStart,deleteUserSuccess,deleteUserFailure, 
    signOutUserStart,signOutUserSuccess,signOutUserFailure }=userSlice.actions;

export default userSlice.reducer;