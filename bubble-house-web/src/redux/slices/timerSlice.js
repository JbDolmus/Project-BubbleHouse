import { createSlice } from '@reduxjs/toolkit';

const timerSlice = createSlice({
    name: 'timer',
    initialState: {
        value: parseInt(localStorage.getItem('cartTimer'), 10) || 0,
        isCounting: false,
    },
    reducers: {
        incrementTimer: (state) => {
            state.value += 1;
            localStorage.setItem('cartTimer', state.value);
        },
        resetTimer: (state) => {
            state.value = 0;
            state.isCounting = false;
            localStorage.removeItem('cartTimer');
        },
        startTimer: (state) => {
            state.isCounting = true;
        },
        stopTimer: (state) => {
            state.isCounting = false;
        },
    },
});

export const runTimer = () => (dispatch, getState) => {
    const { timer } = getState();

    if (timer.isCounting) {
        const interval = setInterval(() => {
            dispatch(incrementTimer());

            if (timer.value >= 120) {
                dispatch(resetTimer());
                clearInterval(interval);
            }
        }, 1000);

        return interval;
    }
};

export const { incrementTimer, resetTimer, startTimer, stopTimer } = timerSlice.actions;
export default timerSlice.reducer;
