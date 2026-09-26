class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length, i = 0;
        while (i < n) {
            int x = nums[i];
            if (x >= 1 && x <= n && nums[x - 1] != x) {   // in range and home not yet taken by x
                nums[i] = nums[x - 1];
                nums[x - 1] = x;
            } else i++;
        }
        for (int k = 0; k < n; k++) if (nums[k] != k + 1) return k + 1;
        return n + 1;
    }
}
