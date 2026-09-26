class Solution {
    public int[] findErrorNums(int[] nums) {
        int i = 0, n = nums.length;
        while (i < n) {
            int home = nums[i] - 1;
            if (nums[i] != nums[home]) { int t = nums[i]; nums[i] = nums[home]; nums[home] = t; }
            else i++;
        }
        for (int k = 0; k < n; k++) if (nums[k] != k + 1) return new int[]{nums[k], k + 1};   // the one misfit
        return new int[0];
    }
}
