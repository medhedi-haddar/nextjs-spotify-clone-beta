import { atom } from 'recoil';

export const playListState = atom({
    key: "playListState",
    default: ""
});

export const playlistIdState = atom({
    key : "playlistIdState",
    default: null
});
