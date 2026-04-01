import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ViewCounter = () => {
    const [views, setViews] = useState<number | null>(null);

    useEffect(() => {
        // Fetch and increment the view count from a free counter API
        fetch('https://api.counterapi.dev/v1/hassaku-music/views/up')
            .then(res => res.json())
            .then(data => {
                if (data && typeof data.count === 'number') {
                    setViews(data.count);
                }
            })
            .catch(err => console.error("Could not fetch view count", err));
    }, []);

    if (views === null) return null; // Don't show anything while loading

    // Format the number with commas (e.g. 1,234)
    const formattedViews = new Intl.NumberFormat('en-US').format(views);

    return (
        <motion.div 
            className="view-counter-container"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
        >
            <div className="view-counter">
                <span className="view-label">TOTAL VISITS</span>
                <span className="view-number">{formattedViews}</span>
            </div>
        </motion.div>
    );
};

export default ViewCounter;
