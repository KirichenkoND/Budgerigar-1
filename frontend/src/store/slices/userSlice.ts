import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface User {
	phone: string;
	role: string;
}

const initialState: { user: User | null } = {
	user: null
}

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<{ phone: string, role: string }>) => {
			const { phone, role } = action.payload
			state.user = { phone, role }
		},
		delUser: (state) => {
			state.user = null;
		}
	}
})

export const { setUser, delUser } = userSlice.actions
export default userSlice.reducer