import React, { useState, useEffect } from 'react';

import CollectionCard from './CollectionCard';

const CollectionList = () => {
    const [biggestCollections, setBiggestCollections] = useState([]);

    useEffect(() => {
        const fetchBiggestCollections = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/collections/biggest`, {
                    method: 'GET'
                });
                const responseData = await response.json();
                const collections = responseData.collections;
                setBiggestCollections(collections);
            } catch(err) {
                console.error(err);
            }
        }
        fetchBiggestCollections();
    }, []);

    return (
        <>
            {biggestCollections !== undefined && biggestCollections.map(collection => (
                <CollectionCard 
                    key={collection._id}
                    id={collection._id}
                    name={collection.name}
                    alt={collection.name}
                    image={collection.image} 
                    author={collection.creator.username}
                    topic={collection.topic}
                />
            ))}
        </>
    );
}

export default CollectionList;