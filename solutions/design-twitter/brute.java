class Twitter {
    private final List<int[]> all = new ArrayList<>();                 // {userId, tweetId}, oldest first
    private final Map<Integer, Set<Integer>> follows = new HashMap<>();

    public Twitter() {}

    public void postTweet(int userId, int tweetId) {
        all.add(new int[]{userId, tweetId});
    }

    public List<Integer> getNewsFeed(int userId) {
        Set<Integer> f = follows.getOrDefault(userId, Collections.emptySet());
        List<Integer> feed = new ArrayList<>();
        for (int i = all.size() - 1; i >= 0 && feed.size() < 10; i--) {   // newest first, every tweet
            int u = all.get(i)[0];
            if (u == userId || f.contains(u)) feed.add(all.get(i)[1]);
        }
        return feed;
    }

    public void follow(int followerId, int followeeId) {
        follows.computeIfAbsent(followerId, k -> new HashSet<>()).add(followeeId);
    }

    public void unfollow(int followerId, int followeeId) {
        Set<Integer> s = follows.get(followerId);
        if (s != null) s.remove(followeeId);
    }
}
