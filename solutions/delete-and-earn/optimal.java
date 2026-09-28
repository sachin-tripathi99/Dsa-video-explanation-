class Solution {
    public int deleteAndEarn(int[] nums) {
        int max = 0;
        for (int x : nums) max = Math.max(max, x);
        int[] pts = new int[max + 1];
        for (int x : nums) pts[x] += x;                     // bucket points by value
        int prev2 = 0, prev1 = 0;
        for (int p : pts) {                                 // House Robber over values
            int cur = Math.max(prev1, prev2 + p);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}
