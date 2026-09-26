class Solution {
    private final List<List<Integer>> out = new ArrayList<>();

    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        Arrays.sort(candidates);
        go(candidates, 0, target, new ArrayList<>());
        return out;
    }

    private void go(int[] c, int start, int remain, List<Integer> path) {
        if (remain == 0) { out.add(new ArrayList<>(path)); return; }
        for (int i = start; i < c.length; i++) {
            if (i > start && c[i] == c[i - 1]) continue;    // duplicate at this depth
            if (c[i] > remain) break;                       // overshoot
            path.add(c[i]);
            go(c, i + 1, remain - c[i], path);              // i + 1: use once
            path.remove(path.size() - 1);
        }
    }
}
