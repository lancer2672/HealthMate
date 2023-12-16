import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  getPlaylists,
  addSong,
  removeSong,
  addPlaylist,
  removePlaylist
} from '../../../features/exercise/components/playlist/data/playlistService'; // Đảm bảo rằng bạn đã xuất các hàm này từ file service của mình

export const getPlaylistsAction = createAsyncThunk(
  'playlist/getPlaylists',
  async (_, thunkAPI) => {
    try {
      return await getPlaylists();
    } catch (error) {
      console.log('Get playlists error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addSongAction = createAsyncThunk(
  'playlist/addSong',
  async (data, thunkAPI) => {
    try {
      return await addSong(data);
    } catch (error) {
      console.log('Add song error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const removeSongAction = createAsyncThunk(
  'playlist/removeSong',
  async (data, thunkAPI) => {
    try {
      return await removeSong(data);
    } catch (error) {
      console.log('Remove song error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addPlaylistAction = createAsyncThunk(
  'playlist/addPlaylist',
  async (playlistName, thunkAPI) => {
    try {
      return await addPlaylist(playlistName);
    } catch (error) {
      console.log('Add playlist error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const removePlaylistAction = createAsyncThunk(
  'playlist/removePlaylist',
  async (playlistName, thunkAPI) => {
    try {
      return await removePlaylist(playlistName);
    } catch (error) {
      console.log('Remove playlist error', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
