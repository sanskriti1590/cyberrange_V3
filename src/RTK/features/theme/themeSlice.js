import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    mode:'dark'
}

const toggleTheme = createSlice({
    name:'toggleTheme',
    initialState,
    reducers:{
        settoggleTheme:(state,{payload}) =>{
            state.mode = payload;
        }
    }
})

export const { settoggleTheme } = toggleTheme.actions;
export default toggleTheme.reducer