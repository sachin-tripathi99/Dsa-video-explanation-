class Solution {
    private final List<List<Integer>> out = new ArrayList<>();

    public List<List<Integer>> combinationSum3(int k, int n) {
        go(k, 1, n, new ArrayList<>());
        return out;
    }

    private void go(int k, int start, int remain, List<Integer> path) {
        if (path.size() == k) { if (remain == 0) out.add(new ArrayList<>(path)); return; }
        for (int x = start; x <= 9; x++) {
            if (x > remain) break;                          // larger numbers overshoot too
            path.add(x);
            go(k, x + 1, remain - x, path);
            path.remove(path.size() - 1);
        }
    }
}
