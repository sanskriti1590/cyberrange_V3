import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = [];

const firewallSlice = createSlice({
    name: "firewall", // updated name for clarity
    initialState,
    reducers: {
        addFirewall: {
            reducer(state, action) {
                state.push(action.payload);
            },
            prepare(instance) {
                return {
                    payload: {
                        id: nanoid(),
                        instance_name: instance.name,
                        network_location: instance.network_name,
                        image_id: instance.image,
                        flavor_id: instance.flavor,
                        flavor_for: instance.team,
                        instance_ip: instance.ip_address,
                    },
                };
            },
        },
        deleteFirewall: {
            reducer(state, action) {
                const idToDelete = action.payload;
                return state.filter((item) => item.id !== idToDelete);
            },
        },
    },
});

// Export actions and reducer
export const selectAllFirewalls = (state) => state.firewall;
export const { addFirewall, deleteFirewall } = firewallSlice.actions;
export default firewallSlice.reducer;
