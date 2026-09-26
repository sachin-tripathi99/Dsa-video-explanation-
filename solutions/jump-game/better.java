class Solution {
    public boolean canJump(int[] nums) {
        int n = nums.length;
        boolean[] good = new boolean[n];
        good[n - 1] = true;
        for (int i = n - 2; i >= 0; i--)
            for (int step = 1; step <= nums[i] && i + step < n; step++)
                if (good[i + step]) { good[i] = true; break; }
        return good[0];
    }
}
