class SnapshotArray {
    private final List<int[]>[] hist;                           // per index: {snapId, value}
    private int snapId = 0;

    @SuppressWarnings("unchecked")
    public SnapshotArray(int length) {
        hist = new List[length];
        for (int i = 0; i < length; i++) {
            hist[i] = new ArrayList<>();
            hist[i].add(new int[]{-1, 0});                      // sentinel: 0 before any set
        }
    }

    public void set(int index, int val) {
        List<int[]> h = hist[index];
        int[] last = h.get(h.size() - 1);
        if (last[0] == snapId) last[1] = val;                   // same snapshot: overwrite
        else h.add(new int[]{snapId, val});
    }

    public int snap() {
        return snapId++;
    }

    public int get(int index, int snap_id) {
        List<int[]> h = hist[index];
        int lo = 0, hi = h.size() - 1, best = 0;
        while (lo <= hi) {                                      // last entry with snap ≤ snap_id
            int mid = (lo + hi) >>> 1;
            if (h.get(mid)[0] <= snap_id) { best = mid; lo = mid + 1; }
            else hi = mid - 1;
        }
        return h.get(best)[1];
    }
}
