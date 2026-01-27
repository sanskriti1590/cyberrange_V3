import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = []
const routerSlice = createSlice({
    name: "router",
    initialState,
    reducers: {
        routerAdded: {
            reducer(state, action) {
                state.push(action.payload)
            },
            prepare(router) {
                return {
                    payload: {
                        id: nanoid(),
                        "router_name": router.router_name,
                        "external_gateway_connected": router.external_gateway_connected,
                        "internal_interfaces": router.internal_interfaces
                    }
                }
            }
        },
        routerDelete: {
            reducer(state, action) {
                const itemDelete = action.payload;
                return state.filter(item => item.id !== itemDelete)
            }
        }
    }
})


export const selectAllRouter = (state) => state.router
export const { routerAdded, routerDelete } = routerSlice.actions
export default routerSlice.reducer;