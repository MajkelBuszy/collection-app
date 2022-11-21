import React, { useEffect, useState } from 'react';

import ItemCard from './ItemCard';

const ItemList = () => {
    const [recentItems, setRecentItems] = useState([]);

    useEffect(() => {
        const fetchRecentItems = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/items/recent`, {
                    method: 'GET'
                });
                const responseData = await response.json();
                const items = responseData.items;
                setRecentItems(items);
            } catch(err) {
                console.error(err);
            }
        }
        fetchRecentItems();
    }, []);

    return (
        <>
            {recentItems !== undefined && recentItems.map(item => (
                <ItemCard
                    key={item._id}
                    id={item._id}
                    name={item.name}
                    collection={item.origin.name}
                    author={item.author.username}
                    image={item.image}
                    alt={item.name}
                />
            ))}
        </>
    );
}

export default ItemList;