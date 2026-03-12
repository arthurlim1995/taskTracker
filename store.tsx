import {
  configureStore,
  combineReducers,
  createListenerMiddleware,
} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import reducers from './src/slice';
import rootSaga from './src/sagas';

const rootReducer = combineReducers(reducers);
const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
