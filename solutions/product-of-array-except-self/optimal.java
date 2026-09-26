class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] out = new int[n];
        int p = 1;
        for (int i = 0; i < n; i++) { out[i] = p; p *= nums[i]; }        // left products
        p = 1;
        for (int i = n - 1; i >= 0; i--) { out[i] *= p; p *= nums[i]; }  // times right products
        return out;
    }
}
