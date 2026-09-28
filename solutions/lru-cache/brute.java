class LRUCache {
    private final int cap;
    private int time = 0;
    private final Map<Integer, int[]> map = new HashMap<>();   // key → {value, last used}

    public LRUCache(int capacity) {
        cap = capacity;
    }

    public int get(int key) {
        int[] e = map.get(key);
        if (e == null) return -1;
        e[1] = ++time;
        return e[0];
    }

    public void put(int key, int value) {
        if (!map.containsKey(key) && map.size() == cap) {
            int oldest = -1, t = Integer.MAX_VALUE;
            for (var en : map.entrySet())                           // O(capacity) scan
                if (en.getValue()[1] < t) { t = en.getValue()[1]; oldest = en.getKey(); }
            map.remove(oldest);
        }
        map.put(key, new int[]{value, ++time});
    }
}
