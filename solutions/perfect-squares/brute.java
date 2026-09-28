class Solution {
    public int numSquares(int n) {
        if (n == 0) return 0;
        int best = Integer.MAX_VALUE;
        for (int s = 1; s * s <= n; s++) best = Math.min(best, 1 + numSquares(n - s * s));   // last square s²
        return best;
    }
}
