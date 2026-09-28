import heapq

class Twitter:
    def __init__(self):
        self.time = 0
        self.tweets = {}                        # user → [(time, tweetId)], oldest first
        self.follows = {}

    def postTweet(self, userId: int, tweetId: int) -> None:
        self.tweets.setdefault(userId, []).append((self.time, tweetId))
        self.time += 1

    def getNewsFeed(self, userId: int) -> List[int]:
        users = self.follows.get(userId, set()) | {userId}
        heap = []
        for u in users:
            t = self.tweets.get(u)
            if t:
                i = len(t) - 1                  # newest tweet of u
                heap.append((-t[i][0], t[i][1], u, i))
        heapq.heapify(heap)
        feed = []
        while heap and len(feed) < 10:
            _, tid, u, i = heapq.heappop(heap)
            feed.append(tid)
            if i > 0:                           # next older from the same user
                tm, nid = self.tweets[u][i - 1]
                heapq.heappush(heap, (-tm, nid, u, i - 1))
        return feed

    def follow(self, followerId: int, followeeId: int) -> None:
        self.follows.setdefault(followerId, set()).add(followeeId)

    def unfollow(self, followerId: int, followeeId: int) -> None:
        self.follows.get(followerId, set()).discard(followeeId)
