import { createSlice ,nanoid } from "@reduxjs/toolkit";

const initialState = []

const networkSlice = createSlice({
    name:"network",
    initialState,
    reducers:{
        networkAdded:{
            reducer(state,action){
            state.push(action.payload)
            },
            prepare(network){
                return{
                    payload:{
                        'network_name':network.network_name,
                        "subnet_name":network.subnet_name,
                        "subnet_cidr":network.subnet_cidr,
                        id:nanoid()
                    }
                }
            }
        },
        networkDelete:{
            reducer(state,action){
                const itemIdToDelete = action.payload;
                return state.filter(item => item.id !== itemIdToDelete);
            
            }
        }
    }
})


export const selectAllnetwork = (state) =>state.network
export const { networkAdded , networkDelete } = networkSlice.actions
export default networkSlice.reducer;