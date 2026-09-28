class Solution {
    public int rob(int[] nums) {
        int prev2 = 0, prev1 = 0;                           // best up to i − 2, i − 1
        for (int x : nums) {
            int cur = Math.max(prev1, prev2 + x);           // skip or rob
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}
