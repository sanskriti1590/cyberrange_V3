import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = []
const instanceSlice = createSlice({
    name: 'instance',
    initialState,
    reducers: {
        addInstance: {
            reducer(state, action) {
                state.push(action.payload)
            },
            prepare(instance) {
                return {
                    payload: {
                        id: nanoid(),
                        'instance_name': instance.instance_name,
                        'network_location': instance.network_location,
                        'image_id': instance.image_id,
                        'flavor_id': instance.flavor_id,
                        'flavor_for': instance.instance_for,
                        'instance_ip': instance.instance_ip
                    }
                }
            }
        },
        deleteInstance: {
            reducer(state, action) {
                const itemDelete = action.payload;
                return state.filter((item) => item.id !== itemDelete)
            }
        }

    }
})


export const selectAllInstance = (state) => state.instance;
export const { addInstance, deleteInstance } = instanceSlice.actions
export default instanceSlice.reducer;