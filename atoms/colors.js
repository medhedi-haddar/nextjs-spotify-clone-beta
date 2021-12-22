import { atom } from 'recoil';

export const colorsState = atom({
    key: "colorsState",
    default: [
        {
            gradiant : 'linear-gradient(rgb(55, 65, 81), rgb(17, 24, 39), rgb(0, 0, 0))',
            color : 'rgb(55, 65, 81)'
        },
        {
            gradiant : 'linear-gradient(rgb(180, 83, 9), rgb(146, 64, 14), rgb(0, 0, 0))',
            color : 'rgb(180, 83, 9)'
        },
        {
            gradiant :'linear-gradient(rgb(20, 184, 166), rgb(19, 78, 74), rgb(0, 0, 0))',
            color : 'rgb(20, 184, 166)',
        },
        {
            gradiant :'linear-gradient(rgb(220, 38, 38), rgb(127, 29, 29), rgb(0, 0, 0))',
            color : 'rgb(220, 38, 38)',
        },
        {
            gradiant :'linear-gradient(rgb(147, 51, 234), rgb(88, 28, 135), rgb(0, 0, 0))',
            color : 'rgb(147, 51, 234)',
        },
        {
            gradiant :'linear-gradient(rgb(2, 132, 199), rgb(12, 74, 110), rgb(0, 0, 0))',
            color : 'rgb(2, 132, 199)',
        },
        {
            gradiant :'linear-gradient(rgb(234, 88, 12), rgb(124, 45, 18), rgb(0, 0, 0))',
            color : 'rgb(234, 88, 12)',
        },
        {
            gradiant :'linear-gradient(rgb(75, 85, 99), rgb(17, 24, 39), rgb(0, 0, 0))',
            color : 'rgb(75, 85, 99)',
        },
        {
            gradiant :'linear-gradient(rgb(87, 83, 78), rgb(28, 25, 23), rgb(0, 0, 0))',
            color : 'rgb(87, 83, 78)',
        },
        {
            gradiant :'linear-gradient(rgb(5, 150, 105), rgb(6, 78, 59), rgb(0, 0, 0))',
            color : 'rgb(5, 150, 105)',
        }
    ]
});
