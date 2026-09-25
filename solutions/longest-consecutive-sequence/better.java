class Solution {
    public int longestConsecutive(int[] nums) {
        if (nums.length == 0) return 0;
        Arrays.sort(nums);
        int best = 1, run = 1;
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] == nums[i - 1]) continue;               // duplicate: ignore
            if ((long) nums[i] == (long) nums[i - 1] + 1) run++;
            else run = 1;
            best = Math.max(best, run);
        }
        return best;
    }
}
