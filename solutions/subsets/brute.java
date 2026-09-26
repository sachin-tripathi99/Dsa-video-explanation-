class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        int n = nums.length;
        List<List<Integer>> out = new ArrayList<>();
        for (int mask = 0; mask < (1 << n); mask++) {
            List<Integer> s = new ArrayList<>();
            for (int i = 0; i < n; i++) if ((mask >> i & 1) == 1) s.add(nums[i]);   // bit i → take nums[i]
            out.add(s);
        }
        return out;
    }
}
