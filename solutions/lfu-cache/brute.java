class LFUCache {
    private final int cap;
    private int clock = 0;
    private final Map<Integer, int[]> map = new HashMap<>();   // key → {value, uses, last used}

    public LFUCache(int capacity) {
        cap = capacity;
    }

    public int get(int key) {
        int[] e = map.get(key);
        if (e == null) return -1;
        e[1]++;
        e[2] = ++clock;
        return e[0];
    }

    public void put(int key, int value) {
        int[] e = map.get(key);
        if (e != null) { e[0] = value; e[1]++; e[2] = ++clock; return; }
        if (map.size() == cap) {
            int worst = -1;
            for (var en : map.entrySet()) {                         // O(capacity) scan
                int[] x = en.getValue(), w = worst < 0 ? null : map.get(worst);
                if (w == null || x[1] < w[1] || (x[1] == w[1] && x[2] < w[2])) worst = en.getKey();
            }
            map.remove(worst);
        }
        map.put(key, new int[]{value, 1, ++clock});
    }
}
