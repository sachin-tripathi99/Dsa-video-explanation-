class Twitter {
    vector<pair<int, int>> all;                             // (userId, tweetId), oldest first
    unordered_map<int, unordered_set<int>> follows;
public:
    Twitter() {}

    void postTweet(int userId, int tweetId) {
        all.emplace_back(userId, tweetId);
    }

    vector<int> getNewsFeed(int userId) {
        auto& f = follows[userId];
        vector<int> feed;
        for (int i = (int)all.size() - 1; i >= 0 && feed.size() < 10; i--) {   // newest first, every tweet
            int u = all[i].first;
            if (u == userId || f.count(u)) feed.push_back(all[i].second);
        }
        return feed;
    }

    void follow(int followerId, int followeeId) {
        follows[followerId].insert(followeeId);
    }

    void unfollow(int followerId, int followeeId) {
        follows[followerId].erase(followeeId);
    }
};
