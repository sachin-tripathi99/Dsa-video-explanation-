class RecentCounter {
    private final List<Integer> all = new ArrayList<>();

    public int ping(int t) {
        all.add(t);
        int count = 0;
        for (int x : all) if (x >= t - 3000) count++;   // rescan everything
        return count;
    }
}
