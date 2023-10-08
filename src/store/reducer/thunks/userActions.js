import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {createAsyncThunk} from '@reduxjs/toolkit';
// user: {
//   uid: 'user1',
//   email: 'user1@example.com',
//   // các trường khác...
//   drinkHistory: [
//     {
//       date: '2023-10-08',
//       goal: 2000, // mục tiêu uống nước trong ngày (ví dụ: 2000ml)
//       sessions: [
//         {
//           time: '08:00',
//           amount: 500, // lượng nước uống trong phiên (ví dụ: 500ml)
//         },
//         {
//           time: '12:00',
//           amount: 500,
//         },
//         // các phiên uống nước khác...
//       ],
//     },
//     // các ngày uống nước khác...
//   ],
// }
const usersRef = firestore().collection('users');
export const logoutUser = createAsyncThunk('user/logout', async () => {
  try {
    await AsyncStorage.multiRemove(['userId', 'token', 'refreshToken']);
  } catch (er) {
    console.log('Logout error', er);
  }
});
export const register = createAsyncThunk(
  'user/register',
  async ({email, password, ...rest}, thunkAPI) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;
      console.log('user', user);
      if (user) {
        // Gửi email xác minh
        await user.sendEmailVerification();

        const userData = {
          uid: user.uid,
          email: user.email,
          ...rest,
        };
        await usersRef.doc(user.uid).set(userData);
        return userData;
      }
    } catch (error) {
      console.log('Register error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
export const login = createAsyncThunk(
  'user/login',
  async ({email, password}, thunkAPI) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;
      if (user) {
        if (!user.emailVerified) {
          return thunkAPI.rejectWithValue('Email not verified');
        }
        // Return user data from userCredential
        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
      }
    } catch (error) {
      console.log('Login error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
export const saveFCMToken = createAsyncThunk(
  'user/saveFCMToken',
  async (FCMToken, thunkAPI) => {
    try {
    } catch (error) {
      console.log('Login error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
