import React, { useEffect, useState } from 'react';

import ItemCard from './ItemCard';

const ItemList = () => {
    const [recentItems, setRecentItems] = useState([]);

    useEffect(() => {
        const fetchRecentItems = async () => {
            try {
                const url1 = 'https://senior-dev-website-no-joke.herokuapp.com/api/items/recent';
                const url2 = 'http://localhost:5000/api/items/recent';
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