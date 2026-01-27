import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    mode:''
}

const PathUrl = createSlice({
    name:'PathUrl',
    initialState,
    reducers:{
        setPathUrl:(state,{payload}) =>{
            state.mode = payload;
        }
    }
})

export const { setPathUrl } = PathUrl.actions;
export default PathUrl.reducer