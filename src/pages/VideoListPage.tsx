import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Grid, List, ArrowDownNarrowWide, ArrowUpWideNarrow } from 'lucide-react';
import VideoModal from '../components/VideoModal';

interface Video {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
}

interface Props {
    title: string;
    videos: Video[];
}

const VideoListPage = ({ title, videos }: Props) => {
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc'); // desc = newest first, asc = oldest first

    const total = videos?.length || 0;

    const displayVideos = useMemo(() => {
        const arr = [...(videos || [])];
        if (sortOrder === 'asc') {
            arr.reverse();
        }
        return arr;
    }, [videos, sortOrder]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            <div className="page-header-container">
                <h2 className="page-title">{title}</h2>
                <div className="intro-text">
                    <p>八朔です。AI音楽や動画を作成しています。ぜひきいてください。</p>
                    <p className="intro-en">I create AI music and videos. Check them out!</p>
                </div>
            </div>

            <div className="controls-container">
                <div className="view-toggles">
                    <button
                        className={`control-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                        title="リスト表示"
                    >
                        <List size={20} />
                    </button>
                    <button
                        className={`control-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                        title="グリッド表示"
                    >
                        <Grid size={20} />
                    </button>
                </div>

                <button
                    className="control-btn sort-btn"
                    onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                    title="並び替え"
                >
                    {sortOrder === 'desc' ? <ArrowDownNarrowWide size={20} /> : <ArrowUpWideNarrow size={20} />}
                    <span>{sortOrder === 'desc' ? '新しい順' : '古い順'}</span>
                </button>
            </div>

            {total === 0 ? (
                <p>現在コンテンツを準備中です。</p>
            ) : (
                <div className={viewMode === 'grid' ? 'video-grid' : 'video-list'}>
                    {displayVideos.map((video, idx) => {
                        // calculate track number based on order
                        const trackNumber = sortOrder === 'desc' ? total - idx : idx + 1;
                        return (
                            <div
                                key={video.id + idx}
                                className="video-card"
                                onClick={() => setSelectedVideo(video)}
                            >
                                <div className="thumbnail-wrapper">
                                    <img src={video.thumbnail} alt={video.title} className="thumbnail-img" loading="lazy" />
                                    <div className="play-overlay">
                                        <Play className="play-icon" />
                                    </div>
                                </div>
                                <div className="video-info">
                                    <div className="video-number">No. {trackNumber.toString().padStart(3, '0')}</div>
                                    <div className="video-title">{video.title}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedVideo && (
                <VideoModal
                    video={selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                />
            )}
        </motion.div>
    );
};

export default VideoListPage;
