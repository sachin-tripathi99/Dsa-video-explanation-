class Solution {
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        int n = nums.length;
        Set<List<Integer>> seen = new HashSet<>();
        for (int mask = 0; mask < (1 << n); mask++) {
            List<Integer> s = new ArrayList<>();
            for (int i = 0; i < n; i++) if ((mask >> i & 1) == 1) s.add(nums[i]);
            Collections.sort(s);                            // same multiset → same list
            seen.add(s);
        }
        return new ArrayList<>(seen);
    }
}
