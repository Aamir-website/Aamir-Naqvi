class VideoPreloader {
  private queue: string[] = [];
  private preloadedVideos: Map<string, boolean> = new Map();
  private isPreloading = false;

  addToQueue(urls: string[]) {
    urls.forEach(url => {
      if (!this.preloadedVideos.has(url) && !this.queue.includes(url)) {
        this.queue.push(url);
      }
    });

    if (!this.isPreloading) {
      this.processQueue();
    }
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      this.isPreloading = false;
      return;
    }

    this.isPreloading = true;
    const url = this.queue.shift();

    if (!url) {
      this.processQueue();
      return;
    }

    try {
      await this.preloadVideo(url);
      this.preloadedVideos.set(url, true);
      console.log(`Preloaded video: ${url}`);
    } catch (error) {
      console.error(`Failed to preload video: ${url}`, error);
    }

    setTimeout(() => this.processQueue(), 100);
  }

  private preloadVideo(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.muted = true;

      video.addEventListener('loadeddata', () => {
        video.remove();
        resolve();
      });

      video.addEventListener('error', () => {
        video.remove();
        reject(new Error('Failed to load video'));
      });

      video.addEventListener('abort', () => {
        video.remove();
        reject(new Error('Video loading aborted'));
      });

      video.src = url;
      video.load();
    });
  }

  isPreloaded(url: string): boolean {
    return this.preloadedVideos.has(url);
  }
}

export const videoPreloader = new VideoPreloader();
