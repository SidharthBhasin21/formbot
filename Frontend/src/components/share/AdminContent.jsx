import React from 'react';

function AdminContent({ item }) {
    const { type, value } = item.data;
    console.log(value)
    if (type === 'Image' || type === 'GIF') {
        return <img src={value} alt="img" />;
    } else if (type === 'Video') {
        return (
            <video controls>
                <source src={value} type="video/mp4" />
            </video>
        );
    } else {
        return value;
    }
}

export default AdminContent