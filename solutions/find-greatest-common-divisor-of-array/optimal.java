class Solution {
    public int findGCD(int[] nums) {
        int mn = Integer.MAX_VALUE, mx = Integer.MIN_VALUE;
        for (int x : nums) { mn = Math.min(mn, x); mx = Math.max(mx, x); }
        int a = mx, b = mn;
        while (b != 0) {           // Euclid: gcd(a, b) = gcd(b, a % b)
            int t = a % b;
            a = b;
            b = t;
        }
        return a;
    }
}
