class Solution {
    public int threeSumClosest(int[] nums, int target) {
        int n = nums.length, best = nums[0] + nums[1] + nums[2];
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                for (int k = j + 1; k < n; k++) {
                    int s = nums[i] + nums[j] + nums[k];
                    if (Math.abs(s - target) < Math.abs(best - target)) best = s;
                }
        return best;
    }
}
