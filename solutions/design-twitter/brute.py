class Twitter:
    def __init__(self):
        self.all = []                           # (userId, tweetId), oldest first
        self.follows = {}

    def postTweet(self, userId: int, tweetId: int) -> None:
        self.all.append((userId, tweetId))

    def getNewsFeed(self, userId: int) -> List[int]:
        f = self.follows.get(userId, set())
        feed = []
        for u, t in reversed(self.all):         # newest first, every tweet
            if u == userId or u in f:
                feed.append(t)
                if len(feed) == 10:
                    break
        return feed

    def follow(self, followerId: int, followeeId: int) -> None:
        self.follows.setdefault(followerId, set()).add(followeeId)

    def unfollow(self, followerId: int, followeeId: int) -> None:
        self.follows.get(followerId, set()).discard(followeeId)
