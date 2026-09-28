class SnapshotArray {
    private final int[] cur;
    private final List<int[]> copies = new ArrayList<>();

    public SnapshotArray(int length) {
        cur = new int[length];
    }

    public void set(int index, int val) {
        cur[index] = val;
    }

    public int snap() {
        copies.add(cur.clone());                                // O(n) copy every time
        return copies.size() - 1;
    }

    public int get(int index, int snap_id) {
        return copies.get(snap_id)[index];
    }
}
