import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const usersRef = firestore().collection('users');

export async function logout() {
  try {
    await AsyncStorage.multiRemove(['userId', 'token', 'refreshToken']);
  } catch (er) {
    console.log('Logout error', er);
  }
}

export async function registerUser({email, password, ...rest}) {
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
}

export async function loginUser({email, password}) {
  const userCredential = await auth().signInWithEmailAndPassword(
    email,
    password,
  );
  const user = userCredential.user;
  if (user) {
    if (!user.emailVerified) {
      throw new Error('Email not verified');
    }
    // Return user data from userCredential
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  }
}

export async function saveToken(FCMToken) {
  try {
    // Logic to save FCMToken
  } catch (error) {
    console.log('Save FCMToken error', error.message);
    throw error;
  }
}
