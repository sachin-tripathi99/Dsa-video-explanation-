class Solution {
    public int findGCD(int[] nums) {
        int mn = Integer.MAX_VALUE, mx = Integer.MIN_VALUE;
        for (int x : nums) { mn = Math.min(mn, x); mx = Math.max(mx, x); }
        for (int d = mn; d >= 1; d--) {
            if (mn % d == 0 && mx % d == 0) return d;
        }
        return 1;
    }
}
