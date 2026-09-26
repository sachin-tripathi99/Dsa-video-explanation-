class Solution {
    private final List<List<Integer>> out = new ArrayList<>();

    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        Arrays.sort(candidates);
        go(candidates, 0, target, new ArrayList<>());
        return out;
    }

    private void go(int[] c, int start, int remain, List<Integer> path) {
        if (remain == 0) { out.add(new ArrayList<>(path)); return; }
        for (int i = start; i < c.length; i++) {
            if (c[i] > remain) break;                       // sorted: the rest are bigger
            path.add(c[i]);
            go(c, i, remain - c[i], path);                  // i: reuse allowed
            path.remove(path.size() - 1);
        }
    }
}
