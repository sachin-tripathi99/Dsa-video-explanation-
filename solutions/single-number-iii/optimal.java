class Solution {
    public int[] singleNumber(int[] nums) {
        int x = 0;
        for (int y : nums) x ^= y;                          // a ^ b
        int low = x & -x;                                   // a bit where a and b differ
        int a = 0, b = 0;
        for (int y : nums) {
            if ((y & low) != 0) a ^= y;                     // pairs cancel inside each group
            else b ^= y;
        }
        return new int[]{a, b};
    }
}
