class Solution {
    public int climbStairs(int n) {
        if (n <= 1) return 1;
        return climbStairs(n - 1) + climbStairs(n - 2);     // last move: 1 or 2 steps
    }
}
