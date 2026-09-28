class Twitter {
    int time = 0;
    unordered_map<int, vector<pair<int, int>>> tweets;     // user → (time, tweetId), oldest first
    unordered_map<int, unordered_set<int>> follows;
public:
    Twitter() {}

    void postTweet(int userId, int tweetId) {
        tweets[userId].emplace_back(time++, tweetId);
    }

    vector<int> getNewsFeed(int userId) {
        unordered_set<int> users = follows[userId];
        users.insert(userId);
        priority_queue<tuple<int, int, int, int>> heap;    // (time, tweetId, user, index), max time on top
        for (int u : users) {
            auto it = tweets.find(u);
            if (it == tweets.end() || it->second.empty()) continue;
            int i = it->second.size() - 1;                  // newest tweet of u
            heap.emplace(it->second[i].first, it->second[i].second, u, i);
        }
        vector<int> feed;
        while (!heap.empty() && feed.size() < 10) {
            auto [t, id, u, i] = heap.top();
            heap.pop();
            feed.push_back(id);
            if (i > 0) {                                    // next older from the same user
                auto& e = tweets[u][i - 1];
                heap.emplace(e.first, e.second, u, i - 1);
            }
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
