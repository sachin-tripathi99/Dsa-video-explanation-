class Solution {
    private final List<List<Integer>> out = new ArrayList<>();

    public List<List<Integer>> combine(int n, int k) {
        go(n, k, 1, new ArrayList<>());
        return out;
    }

    private void go(int n, int k, int start, List<Integer> path) {
        if (path.size() == k) { out.add(new ArrayList<>(path)); return; }
        int need = k - path.size();
        for (int x = start; x <= n - need + 1; x++) {       // enough numbers left
            path.add(x);
            go(n, k, x + 1, path);
            path.remove(path.size() - 1);
        }
    }
}
