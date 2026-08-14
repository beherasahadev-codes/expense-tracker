function initBackgroundVideo() {
  const video = document.querySelector('.video-bg video');
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');

  const playVideo = () => video.play().catch(() => {});

  video.addEventListener('loadeddata', playVideo);
  video.addEventListener('canplay', playVideo);

  if (video.readyState >= 2) playVideo();

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) playVideo();
  });

  const resumeOnInteraction = () => {
    playVideo();
    document.removeEventListener('pointerdown', resumeOnInteraction);
    document.removeEventListener('keydown', resumeOnInteraction);
  };

  document.addEventListener('pointerdown', resumeOnInteraction);
  document.addEventListener('keydown', resumeOnInteraction);

  setTimeout(playVideo, 500);
}

initBackgroundVideo();
