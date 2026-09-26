class Solution {
    public int[] nextGreaterElements(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        for (int i = 0; i < n; i++) {
            ans[i] = -1;
            for (int k = 1; k < n; k++)
                if (nums[(i + k) % n] > nums[i]) { ans[i] = nums[(i + k) % n]; break; }
        }
        return ans;
    }
}
