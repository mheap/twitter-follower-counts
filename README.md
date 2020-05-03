# twitter-follower-count-last-tweet

This is a small script that allows me to archive my tweets in to an `sqlite` database along with my current follower count. This data can be used to analyse what content grows my audience, and what reduces it.

It is not intended for use by anyone else, but if you want to try it you can clone this repo, add your Twitter auth credentials to `index.js` and run the script. You will likely need to edit the `/data/twitter.db` path if you're not running this in Docker and mounting a volume at `/data`.

This is how I run it on my QNAP NAS:

```
0-59/10 * * * * docker run -v /share/CACHEDEV1_DATA/Databases:/data -t mheap/twitter-followers:latest
```

The image is not pushed to Dockerhub, so you'd need to build and save it yourself with `docker build` and `docker save` if you wanted to do the same.
