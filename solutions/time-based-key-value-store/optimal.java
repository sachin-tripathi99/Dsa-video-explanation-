class TimeMap {
    private final Map<String, List<Integer>> times = new HashMap<>();
    private final Map<String, List<String>> values = new HashMap<>();

    public TimeMap() {}

    public void set(String key, String value, int timestamp) {
        times.computeIfAbsent(key, k -> new ArrayList<>()).add(timestamp);   // stays sorted
        values.computeIfAbsent(key, k -> new ArrayList<>()).add(value);
    }

    public String get(String key, int timestamp) {
        List<Integer> ts = times.get(key);
        if (ts == null) return "";
        int lo = 0, hi = ts.size() - 1, best = -1;
        while (lo <= hi) {                                      // last time ≤ timestamp
            int mid = (lo + hi) >>> 1;
            if (ts.get(mid) <= timestamp) { best = mid; lo = mid + 1; }
            else hi = mid - 1;
        }
        return best < 0 ? "" : values.get(key).get(best);
    }
}
