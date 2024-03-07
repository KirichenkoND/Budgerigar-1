import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface User {
	phone: string
}

const initialState: { user: User | null } = {
	user: null
}

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<{ phone: string }>) => {
			const { phone } = action.payload
			state.user = { phone }
		},
		delUser: (state) => {
			state.user = null;
		}
	}
})

export const { setUser, delUser } = userSlice.actions
export default userSlice.reducer