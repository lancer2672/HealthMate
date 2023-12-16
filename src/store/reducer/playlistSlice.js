import {createSlice} from '@reduxjs/toolkit';
import {
  getPlaylistsAction,
  addSongAction,
  removeSongAction,
  addPlaylistAction,
  removePlaylistAction
} from './thunks/playlistAction';

const initialState = {
  playlists: [],
  selectedPlaylist: null,
  isLoading: false,
  error: null
};

const actions = [
  getPlaylistsAction,
  addSongAction,
  removeSongAction,
  addPlaylistAction
];

export const playlistSlice = createSlice({
  name: 'playlist',
  initialState: initialState,
  reducers: {
    setSelectedPlaylist: (state, action) => {
      state.selectedPlaylist = action.payload;
    }
  },
  extraReducers: builder => {
    actions.forEach(action => {
      builder.addCase(action.fulfilled, (state, action) => {
        state.playlists = action.payload;
        if (state.selectedPlaylist) {
          state.selectedPlaylist = action.payload.find(
            playlist => playlist.name === state.selectedPlaylist.name
          );
          console.log(
            'payload playlist',
            state.selectedPlaylist,
            action.payload
          );
        }
      });
    });

    builder.addCase(removePlaylistAction.fulfilled, (state, action) => {
      state.playlists = action.payload;
      if (state.selectedPlaylist) {
        state.selectedPlaylist = null;
      }
    });
  }
});
export const {setSelectedPlaylist} = playlistSlice.actions;
