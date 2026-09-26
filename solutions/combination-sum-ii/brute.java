class Solution {
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        int n = candidates.length;
        Set<List<Integer>> seen = new HashSet<>();
        for (int mask = 0; mask < (1 << n); mask++) {
            int sum = 0;
            List<Integer> s = new ArrayList<>();
            for (int i = 0; i < n; i++) if ((mask >> i & 1) == 1) { sum += candidates[i]; s.add(candidates[i]); }
            if (sum == target) { Collections.sort(s); seen.add(s); }
        }
        return new ArrayList<>(seen);
    }
}
