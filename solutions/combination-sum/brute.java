class Solution {
    private final Set<List<Integer>> seen = new HashSet<>();

    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        go(candidates, target, new ArrayList<>());
        return new ArrayList<>(seen);
    }

    private void go(int[] c, int remain, List<Integer> seq) {
        if (remain == 0) {
            List<Integer> s = new ArrayList<>(seq);
            Collections.sort(s);                            // order duplicates collapse here
            seen.add(s);
            return;
        }
        for (int x : c) {                                   // any candidate, any order
            if (x > remain) continue;
            seq.add(x);
            go(c, remain - x, seq);
            seq.remove(seq.size() - 1);
        }
    }
}
