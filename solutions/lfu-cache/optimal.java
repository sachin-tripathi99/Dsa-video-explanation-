class LFUCache {
    private final int cap;
    private int minFreq = 0;
    private final Map<Integer, int[]> map = new HashMap<>();              // key → {value, freq}
    private final Map<Integer, LinkedHashSet<Integer>> buckets = new HashMap<>();   // freq → keys, oldest first

    public LFUCache(int capacity) {
        cap = capacity;
    }

    private void use(int key, int[] e) {                                  // move key to bucket freq + 1
        LinkedHashSet<Integer> b = buckets.get(e[1]);
        b.remove(key);
        if (b.isEmpty() && e[1] == minFreq) minFreq++;
        e[1]++;
        buckets.computeIfAbsent(e[1], f -> new LinkedHashSet<>()).add(key);
    }

    public int get(int key) {
        int[] e = map.get(key);
        if (e == null) return -1;
        use(key, e);
        return e[0];
    }

    public void put(int key, int value) {
        int[] e = map.get(key);
        if (e != null) { e[0] = value; use(key, e); return; }
        if (map.size() == cap) {                                          // evict oldest of the rarest
            LinkedHashSet<Integer> b = buckets.get(minFreq);
            int old = b.iterator().next();
            b.remove(old);
            map.remove(old);
        }
        map.put(key, new int[]{value, 1});
        buckets.computeIfAbsent(1, f -> new LinkedHashSet<>()).add(key);
        minFreq = 1;
    }
}
