
interface Video {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
}

interface VideoModalProps {
    video: Video | null;
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
}

const VideoModal = ({ video, onClose }: VideoModalProps) => {
    if (!video) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>&times;</button>
                <div className="iframe-container">
                    <iframe
                        src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default VideoModal;
