class Twitter {
    private int time = 0;
    private final Map<Integer, List<int[]>> tweets = new HashMap<>();  // user → {time, tweetId}, oldest first
    private final Map<Integer, Set<Integer>> follows = new HashMap<>();

    public Twitter() {}

    public void postTweet(int userId, int tweetId) {
        tweets.computeIfAbsent(userId, k -> new ArrayList<>()).add(new int[]{time++, tweetId});
    }

    public List<Integer> getNewsFeed(int userId) {
        Set<Integer> users = new HashSet<>(follows.getOrDefault(userId, Collections.emptySet()));
        users.add(userId);
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> b[0] - a[0]);   // {time, tweetId, user, index}
        for (int u : users) {
            List<int[]> t = tweets.get(u);
            if (t == null || t.isEmpty()) continue;
            int i = t.size() - 1;                                          // newest tweet of u
            heap.add(new int[]{t.get(i)[0], t.get(i)[1], u, i});
        }
        List<Integer> feed = new ArrayList<>();
        while (!heap.isEmpty() && feed.size() < 10) {
            int[] top = heap.poll();
            feed.add(top[1]);
            int i = top[3] - 1;
            if (i >= 0) {                                                  // next older from the same user
                int[] e = tweets.get(top[2]).get(i);
                heap.add(new int[]{e[0], e[1], top[2], i});
            }
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
