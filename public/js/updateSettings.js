/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async(data, type) => {
    try {
        const url = type === 'data' ?
            'http://127.0.0.1:3000/api/v1/users/updateMe' :
            'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        const res = await axios({
            method: 'PATCH',
            url,
            data
        });

        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully!`);
            window.setTimeout(() => {
                location.assign('/');
            }, 1000);

            // if (type === 'photo') {
            //     return res.data.data.user.photo;
            // }
        }

        console.log(res);
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}